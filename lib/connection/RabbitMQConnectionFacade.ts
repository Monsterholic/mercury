import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import { MessageEmitter } from '../messageBus/MessageBusEventEmitter';
import Mercury, { Message, JSONMessage, Handler } from '..';
import { IContainer } from '../container/interfaces/IContainer';

const MAX_RETRIES = 14;
const DEFAULT_MS_STEP = 1000;

export class RabbitMQConnectionFacade {
    private connection: Connection;
    private channel: Channel;
    private readonly exchange: string;
    private readonly deadLetterExchange: string;
    private readonly queue: string;
    private readonly retryQueue: string;
    private readonly appName: string;
    private readonly delayRetry: number;
    private messagePool: Map<string, ConsumeMessage>;
    private filterTrafic: boolean;
    private preFetch: number;

    private container: IContainer;

    public constructor(
        serviceName: string,
        appName: string,
        delayRetry: number,
        filterTrafic: boolean,
        preFetch = 2,
        container: IContainer,
    ) {
        this.exchange = serviceName;
        this.deadLetterExchange = `${this.exchange}_dlx`;
        this.queue = `${serviceName}_queue`;
        this.retryQueue = `${this.queue}_retry`;
        this.appName = appName;
        this.delayRetry = delayRetry;
        this.messagePool = new Map<string, ConsumeMessage>();
        this.filterTrafic = filterTrafic;
        this.preFetch = preFetch;
        this.container = container;
    }

    public async subscribeAll(messageBindings: Map<string, string>): Promise<boolean> {
        try {
            for (const [key] of messageBindings) {
                await this.subscribe(key);
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    public async disconnect(): Promise<boolean> {
        if (this.connection) {
            try {
                this.channel.removeAllListeners();
                await this.channel.close();
                await this.connection.close();
                this.connection = undefined;
                return true;
            } catch (e) {
                throw e;
            }
        } else {
            return false;
        }
    }

    public async connect(hostname: string, username: string, password: string): Promise<Connection> {
        try {
            this.connection = await connect({
                hostname,
                password,
                port: 5672,
                protocol: 'amqp',
                username,
            });
            this.connection.on('error', () => {});
            this.channel = await this.connection.createChannel();
            this.channel.on('error', error => {
                console.error(error);
            });
            this.channel.on('close', () => {
                console.log('rabbitmq channel closed');
            });
            await this.setUp();
        } catch (e) {
            throw e;
        }

        const emitter = MessageEmitter.getMessageEmitter();

        emitter.on(MessageEmitter.PROCESS_SUCCESS, (resultingMessages: Message[]) => {
            if (resultingMessages) {
                for (const message of resultingMessages) {
                    try {
                        this.publish(message);
                    } catch (e) {
                        emitter.emit('error', e);
                    }
                }
            }
        });

        try {
            await this.channel.prefetch(this.preFetch);
            await this.channel.consume(
                `${this.queue}`,
                async (msg: ConsumeMessage): Promise<void> => {
                    if (!this.filterTrafic || msg.properties.appId === this.appName) {
                        if (msg.properties.messageId) {
                            const descriptor = msg.fields.routingKey;
                            this.messagePool.set(msg.properties.messageId, msg);
                            await this.dispatchMessage(descriptor, msg);
                        } else {
                            this.channel.ack(msg);
                        }
                    } else {
                        this.channel.ack(msg);
                    }
                },
            );
            return this.connection;
        } catch (e) {
            throw e;
        }
    }

    public publish(message: Message, alternativeExchange: string = null): boolean {
        const exchange = alternativeExchange ? alternativeExchange : this.appName;
        try {
            return this.channel.publish(
                exchange,
                message.getDescriptor(),
                Buffer.from(message.getSerializedContent()),
                {
                    appId: this.appName,
                    headers: { parentMessage: message.getParentMessage() },
                    messageId: message.getUUID(),
                    persistent: true,
                    timestamp: new Date().getTime(),
                },
            );
        } catch (e) {
            throw e;
        }
    }

    public async subscribe(descriptor: string): Promise<string> {
        try {
            await this.channel.bindQueue(this.queue, this.exchange, descriptor);
            return descriptor;
        } catch (e) {
            throw e;
        }
    }

    public async dispatchMessage(descriptor: string, msg: ConsumeMessage): Promise<void> {
        const handlers = Mercury.handlerRegistry;

        const handler = this.container.get<Handler>(descriptor);

        if (Reflect.hasMetadata('messageBindings', Mercury.prototype.constructor)) {
            const bindings: Map<string, string> = Reflect.getMetadata('messageBindings', Mercury.prototype.constructor);
            const handlerClassName = bindings.get(descriptor);
            if (handlerClassName) {
                //if (handlers.has(handlerClassName))
                if (handler) {
                    //const handler = handlers.get(handlerClassName);
                    try {
                        const MercuryMessage = new JSONMessage(
                            descriptor,
                            msg.content,
                            msg.properties.messageId,
                            msg.properties.timestamp,
                            msg.properties.headers.parentMessage,
                        );
                        const result = await handler.handle(MercuryMessage);
                        const resultMessages =
                            Array.isArray(result) && result.every(r => r instanceof Message)
                                ? result
                                : result instanceof Message
                                ? [result]
                                : null;

                        this.channel.ack(this.messagePool.get(msg.properties.messageId));
                        if (resultMessages) {
                            for (const message of resultMessages) {
                                this.publish(message);
                            }
                        }
                        this.messagePool.delete(msg.properties.messageId);
                    } catch (e) {
                        this.messagePool.delete(msg.properties.messageId);
                        if (
                            !msg.properties.headers['x-death'] ||
                            (msg.properties.headers['x-death'] &&
                                msg.properties.headers['x-death'][0].count < MAX_RETRIES)
                        ) {
                            this.channel.nack(msg, false, false);
                        } else {
                            this.channel.ack(msg);
                        }
                    }
                } else {
                    this.channel.ack(msg);
                }
            }
        }
    }

    private async setUp(): Promise<boolean> {
        /* Creating Exchanges and queues */
        try {
            await this.channel.assertExchange(this.appName, 'fanout', {
                autoDelete: false,
                durable: true,
            });
            await this.channel.assertExchange(this.exchange, 'direct', {
                autoDelete: false,
                durable: true,
            });
            await this.channel.assertExchange(this.deadLetterExchange, 'fanout', {
                autoDelete: false,
                durable: true,
            });
            await this.channel.assertQueue(this.queue, {
                autoDelete: false,
                deadLetterExchange: this.deadLetterExchange,
                durable: true,
            });
            await this.channel.assertQueue(this.retryQueue, {
                arguments: {
                    'x-message-ttl': this.delayRetry * DEFAULT_MS_STEP,
                },
                autoDelete: false,
                deadLetterExchange: this.exchange,
                durable: true,
            });

            /* Creating the basic bindings */
            await this.channel.bindExchange(this.exchange, this.appName, '');
            await this.channel.bindQueue(this.retryQueue, this.deadLetterExchange, '');
        } catch (e) {
            throw e;
        }
        return true;
    }
}
