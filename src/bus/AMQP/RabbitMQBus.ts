import { inject, injectable, postConstruct, interfaces } from 'inversify';
import { ConsumeMessage } from 'amqplib';

import IMessageBus from '../../domain/interface/IMessageBus';
import IManager from '../../domain/interface/IManager';
import AbstractMessage from '../../domain/abstract/AbstractMessage';
import IRabbitMQConnection from './interface/IRabbitMQConnection';
import InvalidMessageRouteError from './error/InvalidMessageRouteError';

@injectable()
export class RabbitMQBus implements IMessageBus {
    private static readonly MAIN_EXCHANGE = 'main';

    private readonly _eventManager: IManager;
    private readonly _connection: IRabbitMQConnection;

    constructor(connection: IRabbitMQConnection) {
        this._connection = connection;
    }

    /**
     *
     * publishes one message in the default exchange, in rabbitMQ this message will be routed based in the route
     * param provided
     *
     * @param route (in this case this is exactly the same identifier of the event or command)
     * @param message (content of the message)
     */
    async publish(route: string, message: AbstractMessage): Promise<void> {
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

    subscribeAll(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async consume(): Promise<void> {
        let channel = await this._connection.getChannel();
        channel.consume('para configura', (msg: ConsumeMessage) => {});
        return;
    }
}
