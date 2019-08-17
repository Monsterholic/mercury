import IConnectionFacade from "./IConnectionFacade";
import ISerializable from "../message/ISerializable";
import {connect, Connection} from "amqplib";

export default class RabbitMQConnectionFacade<T extends ISerializable> implements IConnectionFacade<T> {

    private connection:Connection
    private serviceName:string

    constructor(serviceName:string) {
        this.serviceName = serviceName
    }

    public async connect(
        hostname:string,
        username:string,
        password:string,
    ): Promise<void> {
        this.connection = await connect({
            protocol:'amqp',
            hostname,
            port:5672,
            username,
            password
        })

        await this.setUp()
    }


    public pulish(T): Promise<void> {
        return undefined;
    }

    private async setUp(): Promise<void> {
        let channel = await this.connection.createChannel()

        /* Creating Exchanges and queues */
        await channel.assertExchange("hermes_main_message_bus",'fanout',{
            durable:true,
            autoDelete:false
        })
        await channel.assertExchange(`${this.serviceName}_exchange`,'direct',{
            durable:true,
            autoDelete:false
        })
        await channel.assertExchange(`${this.serviceName}_exchange_dead_letter`,'fanout',{
            durable:true,
            autoDelete:false
        })
        await channel.assertQueue(`${this.serviceName}_message_queue`,{
            durable:true,
            autoDelete:false,
            deadLetterExchange:`${this.serviceName}_exchange_dead_letter`
        })
        await channel.assertQueue(`${this.serviceName}_message_queue_dead_letter`,{
            durable:true,
            autoDelete:false,
            deadLetterExchange:`${this.serviceName}_exchange`
        })

        /* Creating the basic bindings */
        await channel.bindExchange("hermes_main_message_bus",`${this.serviceName}_message_broker`,"")
        await channel.bindQueue(`${this.serviceName}_message_queue_dead_letter`,`${this.serviceName}_exchange_dead_letter`,'')
        await channel.close()
    }

    async subscribeToTopics(topics:Array<string>): Promise<void> {
        let channel = await this.connection.createChannel()

        for(let topic of topics){
            await channel.bindQueue(`${this.serviceName}_message_queue`,`${this.serviceName}_exchange`,topic)
        }
    }

}