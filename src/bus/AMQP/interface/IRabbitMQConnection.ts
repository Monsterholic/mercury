import { Channel, Connection } from 'amqplib';

export default interface IRabbitMQConnection {
    isConnected(): boolean;
    getChannel(): Promise<Channel>;
    connect(): Promise<Connection>;
}
