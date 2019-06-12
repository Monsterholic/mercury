import AbstractMessage from '../abstract/AbstractMessage';

export default interface IMessageBus {
    publishMessage(route: string, message: AbstractMessage): Promise<void>;
}
