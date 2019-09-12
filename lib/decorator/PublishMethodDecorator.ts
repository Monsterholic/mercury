import { Message } from '..';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';

const Publish = (...args: any) => {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        let resultingMessages = target[propertyKey](...args);
        resultingMessages =
            Array.isArray(resultingMessages) && resultingMessages.every(r => r instanceof Message)
                ? resultingMessages
                : resultingMessages instanceof Message
                ? [resultingMessages]
                : null;
        MessageEmitter.getMessageEmitter().emit(MessageEmitter.PROCESS_SUCCESS, resultingMessages);
    };
};
export { Publish };
