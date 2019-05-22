import AbstractMessage from '../abstract/AbstractMessage';

export interface IHandler<T extends AbstractMessage> {
    handle(message: T): Promise<void>;
}
