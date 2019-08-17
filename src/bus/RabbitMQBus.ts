import { inject, injectable, postConstruct, interfaces } from 'inversify';
import Types from '../IoC/Types';
import RabbitMQConnectionManager from '../connection/RabbitMQConnectionManager';
import IMessageBus from './IMessageBus';
import AbstractMessage from '../message/AbstractMessage';
import ISerializable from '../message/ISerializable';
import { Bus } from '../decorator/Bus';

@Bus
@injectable()
export class RabbitMQBus<T extends ISerializable, H extends AbstractMessage<T>> implements IMessageBus<T, H> {
    @inject(Types.IConnectionManager) private connectionManager: RabbitMQConnectionManager;
    private _eventsNameHandler: Array<string>;

    /**
         *constructor(hostname,username,password,appName) {
            this.connectionManager.connect(hostname,username,password,appName)
                .then(() => {
                    console.log("done")
                })
                .catch(e => {
                    throw Error("error connection ")
                })

        } 
     */

    consumeMessages(): Promise<void> {
        console.log(this._eventsNameHandler);
        return;
    }

    publishMessage(message: H): Promise<void> {
        return undefined;
    }
}
