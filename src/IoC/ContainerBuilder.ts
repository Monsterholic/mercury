import "reflect-metadata";
import { Container, interfaces } from "inversify";
import IMessageManager from "../domain/interface/IMessageManager";
import Types from './Types'
import MemoryMessageManager from "../domain/MemoryMessageManager";
import IAMQPConnection from "../bus/interface/IAMQPConnection";
import IMessageBus from "../domain/interface/IMessageBus";
import {RabbitMQBus} from "../bus/AMQP/RabbitMQBus";
import RabbitMQConnection from "../bus/AMQP/RabbitMQConnection";

export default class ContainerBuilder {
    public static buildContainer():Container{
        let container = new Container()

        //Message manager
        container.bind<IMessageManager>(Types.IMessageManager).to(MemoryMessageManager).inSingletonScope()

        //Message Bus
        container.bind<IMessageBus>(Types.IMessageBus).to(RabbitMQBus).inSingletonScope()

        //AMQP Connection
        container.bind<IAMQPConnection>(Types.IAMQPConnection).to(RabbitMQConnection).inSingletonScope()

        return container
    }
}