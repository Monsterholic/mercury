import "reflect-metadata";
import { Container, interfaces } from "inversify";
import Types from './Types'
import RabbitMQConnectionManager from "../connection/RabbitMQConnectionManager";
import IConnectionManager from "../connection/IConnectionManager";
import IMessageBus from "../bus/IMessageBus";
import {RabbitMQBus} from "../bus/RabbitMQBus";
import ISerializable from "../message/ISerializable";
import AbstractMessage from "../message/AbstractMessage";

export default class ContainerBuilder {
    public static buildContainer():Container{
        let container = new Container()

        //AMQP Connection
        container.bind<IConnectionManager>(Types.IConnectionManager).to(RabbitMQConnectionManager).inSingletonScope()
        container.bind<IMessageBus<ISerializable,AbstractMessage<ISerializable>>>(Types.IMessageBus).to(RabbitMQBus).inSingletonScope()

        return container
    }
}