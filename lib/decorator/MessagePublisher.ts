import { Message } from '..';
import { MessageEmitter } from '../messageBus/MessageBusEventEmitter';

export const MessagePublisher = (): MethodDecorator => {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): void {
        const originalFunc = propertyDescriptor.value;

        propertyDescriptor.value = function(...args: any[]): Message {
            const result = originalFunc.apply(this, args);
            const resultingMessages =
                Array.isArray(result) && result.every(r => r instanceof Message)
                    ? result
                    : result instanceof Message
                    ? [result]
                    : null;
            MessageEmitter.getMessageEmitter().emit(MessageEmitter.PROCESS_SUCCESS, resultingMessages);
            return result;
        };
    };
};
