import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import Message from '../message/Message';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import JSONMessage from '../message/JSONMessage';

export default class RabbitMQConnectionFacade {
    private readonly main_bus = 'mercury_bus';
    private connection: Connection;
    private channel: Channel;
    private readonly exchange: string;
    private readonly deadLetterExchange: string;
    private readonly queue: string;
    private readonly retryQueue: string;
    private readonly appName: string;
    private delayRetry: number;

    public constructor(serviceName: string, appName: string, delayRetry: number) {
        this.exchange = serviceName;
        this.deadLetterExchange = `${this.exchange}_dlx`;
        this.queue = `${serviceName}_queue`;
        this.retryQueue = `${this.queue}_retry`;
        this.appName = appName;
        this.delayRetry = delayRetry;
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
                protocol: 'amqp',
                hostname,
                port: 5672,
                username,
                password,
            });
            this.connection.on('error', () => () => {});
            this.channel = await this.connection.createChannel();
            this.channel.on('error', () => {});
            await this.setUp();
        } catch (e) {
            throw e;
        }

        const messagePool = new Map<string, ConsumeMessage>();
        const emitter = MessageEmitter.getMessageEmitter();

        emitter.on('error', () => {});

        emitter.on(
            MessageEmitter.MESSAGE_PROCESS_ERROR,
            (error: Error, messageId: string, mercuryMessage: Message, maxRetries: number) => {
                const message: ConsumeMessage = messagePool.get(messageId);
                if (message) {
                    messagePool.delete(messageId);

                    maxRetries = maxRetries ? maxRetries : 60;

                    if (
                        !message.properties.headers['x-death'] ||
                        (message.properties.headers['x-death'] &&
                            message.properties.headers['x-death'][0].count < maxRetries)
                    ) {
                        this.channel.nack(message, false, false);
                    } else {
                        this.channel.ack(message);
                    }
                }
            },
        );

        emitter.on(MessageEmitter.MESSAGE_PROCESS_SUCCESS, (messageId: string, resultingMessages: Message[]) => {
            if (!messageId) {
                return;
            }
            this.channel.ack(messagePool.get(messageId));
            if (resultingMessages) {
                for (const message of resultingMessages) {
                    this.publish(message);
                }
            }
            messagePool.delete(messageId);
        });

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
            await this.channel.consume(`${this.queue}`, (msg: ConsumeMessage): void => {
                if (msg.properties.appId === this.appName) {
                    if (msg.properties.messageId) {
                        const descriptor = msg.fields.routingKey;

                        messagePool.set(msg.properties.messageId, msg);
                        const message = new JSONMessage(
                            descriptor,
                            msg.content,
                            msg.properties.messageId,
                            msg.properties.timestamp,
                            msg.properties.headers.parentMessage,
                        );
                        emitter.emit(descriptor, message);
                    } else {
                        this.channel.ack(msg);
                    }
                } else {
                    this.channel.ack(msg);
                }
            });
            return this.connection;
        } catch (e) {
            throw e;
        }
    }

    public publish(message: Message, alternativeExchange: string = null): boolean {
        const exchange = alternativeExchange ? alternativeExchange : this.main_bus;
        try {
            return this.channel.publish(
                exchange,
                message.getDescriptor(),
                Buffer.from(message.getSerializedContent()),
                {
                    headers: { parentMessage: message.getParentMessage() },
                    persistent: true,
                    messageId: message.getUUID(),
                    timestamp: new Date().getTime(),
                    appId: this.appName,
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

    private async setUp(): Promise<boolean> {
        /* Creating Exchanges and queues */
        try {
            await this.channel.assertExchange(this.main_bus, 'fanout', {
                durable: true,
                autoDelete: false,
            });
            await this.channel.assertExchange(this.exchange, 'direct', {
                durable: true,
                autoDelete: false,
            });
            await this.channel.assertExchange(this.deadLetterExchange, 'fanout', {
                durable: true,
                autoDelete: false,
            });
            await this.channel.assertQueue(this.queue, {
                durable: true,
                autoDelete: false,
                deadLetterExchange: this.deadLetterExchange,
            });
            await this.channel.assertQueue(this.retryQueue, {
                durable: true,
                autoDelete: false,
                deadLetterExchange: this.exchange,
                arguments: {
                    'x-message-ttl': this.delayRetry * 1000,
                },
            });
            /* Creating the basic bindings */
            await this.channel.bindExchange(this.exchange, this.main_bus, '');
            await this.channel.bindQueue(this.retryQueue, this.deadLetterExchange, '');
        } catch (e) {
            throw e;
        }
        return true;
    }

    public async subscribeAll(descriptors: string[]): Promise<boolean> {
        if (Array.isArray(descriptors)) {
            for (const descriptor of descriptors) {
                try {
                    await this.subscribe(descriptor);
                } catch (e) {
                    throw e;
                }
            }
            return true;
        } else {
            return false;
        }
    }
}
