import { IMessageBus } from '../domain/interface/IMessageBus';
import { IManager } from '../domain/interface/IManager';
import AbstractMessage from '../domain/abstract/AbstractMessage';
import { IAMQPConnection } from './interface/IAMQPConnection';
import { ConsumeMessage } from 'amqplib';

export class RabbitMQPBus implements IMessageBus {    
    eventManager: IManager;
    private readonly _connection: IAMQPConnection

    constructor(connection: IAMQPConnection) {
        this._connection = connection
    }

    async publish(msg: AbstractMessage): Promise<void> {
        if(!this._connection.isConnected())
            await this._connection.connect()
        let channel = await this._connection.getChannel()
        channel.publish(" para ser configurado ", msg._identifier, Buffer.from(JSON.stringify(msg._data)))
        return;
    }

    subscribeAll(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async consume(): Promise<void> {
        let channel = await this._connection.getChannel()
        channel.consume("para configura", (msg: ConsumeMessage) => {
            
        } )
        return;
    }
}