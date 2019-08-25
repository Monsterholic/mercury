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

    public constructor(serviceName: string, appName: string) {
        this.exchange = serviceName;
        this.deadLetterExchange = `${this.exchange}_dlx`;
        this.queue = `${serviceName}_queue`;
        this.retryQueue = `${this.queue}_retry`;
        this.appName = appName;
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            await this.channel.close();
            await this.connection.close();
            this.connection = undefined;
        }
    }

    public async connect(hostname: string, username: string, password: string): Promise<void> {
        //TODO colocar handlers de eventos para caso a conexao caia
        try {
            this.connection = await connect({
                protocol: 'amqp',
                hostname,
                port: 5672,
                username,
                password,
            });

            this.channel = await this.connection.createChannel();
            await this.setUp();
        } catch (e) {
            console.log(e);
        }

        const messagePool = new Map();

        this.channel.consume(
            `${this.queue}`,
            async (msg: ConsumeMessage): Promise<void> => {
                const emitter = MessageEmitter.getMessageEmitter();

                if (msg.properties.appId === this.appName) {
                    if (msg.properties.messageId) {
                        const descriptor = msg.fields.routingKey;

                        messagePool.set(msg.properties.messageId, msg);

                        emitter.on(
                            'error',
                            async ([error, messageId, mercuryMessage]: [Error, string, Message]): Promise<void> => {
                                let message: ConsumeMessage = messagePool.get(messageId);
                                await this.channel.ack(message);

                                let retries = message.properties.headers.retries
                                    ? message.properties.headers.retries + 1
                                    : 0;

                                if (retries <= 8) {
                                    let delay = Math.pow(2, retries) * 1000;
                                    await this.publish(mercuryMessage, this.deadLetterExchange, retries, delay);
                                }

                                messagePool.delete(messageId);
                            },
                        );

                        emitter.on(
                            'success',
                            async ([messageId, resultingMessages]: [string, Message[] | Message]): Promise<void> => {
                                await this.channel.ack(messagePool.get(messageId));

                                if (resultingMessages !== undefined) {
                                    if (Array.isArray(resultingMessages)) {
                                        for (let message of resultingMessages) {
                                            await this.publish(message);
                                        }
                                    } else if (resultingMessages instanceof Message) {
                                        await this.publish(resultingMessages);
                                    }
                                }

                                messagePool.delete(messageId);
                            },
                        );

                        const message = new JSONMessage(descriptor, msg.content, msg.properties.messageId);
                        emitter.emit(descriptor, message);
                    } else {
                        this.channel.ack(msg);
                    }
                } else {
                    this.channel.ack(msg);
                }
            },
        );
    }

    public async publish(
        message: Message,
        alternativeExchange: string = null,
        retries: number = 0,
        delay: number = 0,
    ): Promise<void> {
        const exchange = alternativeExchange ? alternativeExchange : this.main_bus;

        this.channel.publish(exchange, message.getDescriptor(), Buffer.from(message.getSerializedContent()), {
            headers: { retries },
            persistent: true,
            messageId: message.getUUID(),
            timestamp: new Date().getTime(),
            appId: this.appName,
            expiration: delay ? delay : undefined,
        });
    }

    public async subscribe(descriptor: string): Promise<void> {
        await this.channel.bindQueue(this.queue, this.exchange, descriptor);
    }

    private async setUp(): Promise<void> {
        /* Creating Exchanges and queues */
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
        });
        await this.channel.assertQueue(this.retryQueue, {
            durable: true,
            autoDelete: false,
            deadLetterExchange: this.exchange,
        });

        /* Creating the basic bindings */
        await this.channel.bindExchange(this.exchange, this.main_bus, '');
        await this.channel.bindQueue(this.retryQueue, this.deadLetterExchange, '');
    }

    public async subscribeAll(descriptors: string[]): Promise<void> {
        if (Array.isArray(descriptors)) {
            for (let descriptor of descriptors) {
                await this.subscribe(descriptor);
            }
        }
    }
}
