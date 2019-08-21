import { Channel, Connection, connect } from 'amqplib';
import IConnectionManager from './IConnectionManager';
import { injectable } from 'inversify';

@injectable()
export default class RabbitMQConnectionManager implements IConnectionManager {
    private readonly _publishBrokerName = 'main_event_bus';
    private connection: Connection = null;

    async connect(hostname: string, username: string, password: string, appName: string): Promise<void> {
        this.connection = await connect({
            protocol: 'amqp',
            hostname,
            port: 5672,
            username,
            password,
        });

        await this.setUpMessagingDetails(appName);
    }

    private async setUpMessagingDetails(applicationName: string): Promise<void> {
        let channel = await this.connection.createChannel();

        /* Creating Exchanges and queues */
        await channel.assertExchange(this._publishBrokerName, 'fanout', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertExchange(`${applicationName}_exchange`, 'direct', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertExchange(`${applicationName}_exchange_dead_letter`, 'fanout', {
            durable: true,
            autoDelete: false,
        });
        await channel.assertQueue(`${applicationName}_message_queue`, {
            durable: true,
            autoDelete: false,
            deadLetterExchange: `${applicationName}_exchange_dead_letter`,
        });
        await channel.assertQueue(`${applicationName}_message_queue_dead_letter`, {
            durable: true,
            autoDelete: false,
            deadLetterExchange: `${applicationName}_exchange`,
        });

        /* Creating the basic bindings */
        await channel.bindExchange(this._publishBrokerName, `${applicationName}_message_broker`, '');
        await channel.bindQueue(
            `${applicationName}_message_queue_dead_letter`,
            `${applicationName}_exchange_dead_letter`,
            '',
        );
        await channel.close();
    }

    public isConnected(): boolean {
        return !!this.connection;
    }

    public async createChannel(): Promise<Channel> {
        return await this.connection.createChannel();
    }
}
