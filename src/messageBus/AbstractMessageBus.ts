import ConnectionFacade from '../connection/ConnectionFacade';
import MessageBus from './MessageBus';
import Message from '../message/Message';

export default abstract class AbstractMessageBus<T extends ConnectionFacade> implements MessageBus {
    protected connectionFacade: T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public abstract configure(args: any): Promise<void>;

    public async publish(message: Message): Promise<void> {
        await this.connectionFacade.publish(message);
    }
}
