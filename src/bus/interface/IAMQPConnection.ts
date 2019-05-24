import { Channel, Connection } from 'amqplib';

export default interface IAMQPConnection {
    isConnected(): boolean;
    getChannel(): Promise<Channel>;
    connect(): Promise<Connection>;
}
