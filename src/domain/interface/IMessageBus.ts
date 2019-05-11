import { IManager } from './IManager';
import AbstractMessage from '../abstract/AbstractMessage';
export interface IMessageBus  {
    eventManager: IManager
    publish(msg: AbstractMessage): Promise<void>
    subscribeAll(): Promise<void>
    consume(): Promise<void>
}

