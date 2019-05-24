import AbstractMessage from '../abstract/AbstractMessage';

export default interface IMessageBus {
    publishMessage(route: string, message: AbstractMessage): Promise<void>;
    subscribeAll(): Promise<void>;
    consumeMessages(): Promise<void>;
}
