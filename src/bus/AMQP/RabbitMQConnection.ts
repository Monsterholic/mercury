import IAMQPConnection from "../interface/IAMQPConnection";
import { Channel, Connection, connect } from 'amqplib';
import {injectable} from "inversify";


@injectable()
export default class RabbitMQConnection implements IAMQPConnection{

    private _amqpPersistentConnection:Connection

    public async connect(): Promise<Connection> {
        if(!this._amqpPersistentConnection){
            this._amqpPersistentConnection = await connect({
                protocol:'amqp',
                hostname:process.env.API_LEAD_RABBIT_HOSTNAME,
                port:5672,
                username: process.env.API_LEAD_RABBIT_USER,
                password: process.env.API_LEAD_RABBIT_PASSWORD
            })
        }

        return this._amqpPersistentConnection
    }

    public async getChannel(): Promise<Channel> {
        return undefined;
    }

    public isConnected(): boolean {
        return this._amqpPersistentConnection !== null &&
            this._amqpPersistentConnection !== undefined
    }

}