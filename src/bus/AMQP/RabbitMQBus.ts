import { inject, injectable, postConstruct, interfaces } from 'inversify';
import {Channel, ConsumeMessage} from 'amqplib';

import IMessageBus from '../../domain/interface/IMessageBus';
import IMessageManager from '../../domain/interface/IMessageManager';
import AbstractMessage from '../../domain/abstract/AbstractMessage';
import IAMQPConnection from '../interface/IAMQPConnection';
import InvalidMessageRouteError from './error/InvalidMessageRouteError';
import Types from '../../IoC/Types';

@injectable()
export class RabbitMQBus implements IMessageBus {
    private static readonly MAIN_EXCHANGE = 'main';

    private readonly _messageManager: IMessageManager;
    private readonly _connection: IAMQPConnection;

    constructor(
        @inject(Types.IAMQPConnection) connection: IAMQPConnection,
        @inject(Types.IMessageManager) messageManager: IMessageManager,
    ) {
        this._connection = connection;
        this._messageManager = messageManager;
    }

    /**
     *
     * publishes one message in the default exchange, in rabbitMQ this message will be routed based in the route
     * param provided
     *
     * @param route (in this case this is exactly the same identifier of the event or command)
     * @param message (content of the message)
     */
    public async publishMessage(route: string, message: AbstractMessage): Promise<void> {
        if (!route) throw new InvalidMessageRouteError();
        if (!this._connection.isConnected()) await this._connection.connect();

        let channel = await this._connection.getChannel();
        try {
            await channel.publish(
                RabbitMQBus.MAIN_EXCHANGE,
                message.identifier,
                Buffer.from(JSON.stringify(message.content)),
            );
            await channel.close();
        } catch (e) {
            //TODO
        }
        return;
    }


    private async subscribeAll(): Promise<void> {
        //TODO
    }

    private async subscribe(messageIdentifier:string,MessageHandlerSymbol:symbol):Promise<void>{
        if(!this._connection.isConnected())
            await this._connection.connect()

        let channel = await this._connection.getChannel()
        this.assertExchange(channel)
        this.assertQueue(channel,messageIdentifier)
        this.bindQueueToExchange(channel,messageIdentifier,messageIdentifier)
        await channel.close()

    }

    private async assertExchange(channel:Channel):Promise<void>{
        await channel.assertExchange(RabbitMQBus.MAIN_EXCHANGE,'direct',{autoDelete: false, durable: false})
    }

    private async assertQueue(channel:Channel,queueName:string):Promise<void>{
        await channel.assertQueue(queueName,{durable: false, exclusive: false, autoDelete: false})
    }

    private async bindQueueToExchange(channel:Channel, eventIdentifier:string, queueName:string){
        await channel.bindQueue(queueName,RabbitMQBus.MAIN_EXCHANGE,eventIdentifier)
    }

    async consumeMessages(): Promise<void> {
        let channel = await this._connection.getChannel();
        channel.consume('para configura', (msg: ConsumeMessage) => {});
        return;
    }


}
