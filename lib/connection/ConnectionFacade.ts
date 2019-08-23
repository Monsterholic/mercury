import Message from '../message/Message';

export default interface ConnectionFacade {
    publish(message: Message): Promise<void>;
    subscribeAll(topics: string[]): Promise<void>;
}
