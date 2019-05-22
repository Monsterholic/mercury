import AbstractMessage from '../abstract/AbstractMessage';

export default interface IMessageBus {
    publish(route: string, message: AbstractMessage): Promise<void>;
    subscribeAll(): Promise<void>;
    consume(): Promise<void>;
}
