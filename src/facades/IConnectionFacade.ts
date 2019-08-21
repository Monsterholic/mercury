import ISerializable from '../message/ISerializable';

export default interface IConnectionFacade<T extends ISerializable> {
    pulish(T): Promise<void>;
    subscribeToTopics(topics: Array<string>): Promise<void>;
}
