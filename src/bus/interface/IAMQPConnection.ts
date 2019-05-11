import { Channel, Connection } from 'amqplib'

export interface IAMQPConnection {
    isConnected(): boolean
    getChannel(): Promise<Channel>
    connect(): Promise<Connection>
}   