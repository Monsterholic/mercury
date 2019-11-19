import { Message } from '..';
import { MessageEmitter } from '../messageBus/MessageBusEventEmitter';
import { ResultingMessages } from '../message/ResultingMessages';

export const MessagePublisher = (): MethodDecorator => {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): void {
        const originalFunc = propertyDescriptor.value;

        propertyDescriptor.value = async function(...args: any[]): Promise<Message> {
            const result = await originalFunc.apply(this, args);
            const resultingMessages = args.find(argument => argument instanceof ResultingMessages);
            if (resultingMessages && resultingMessages.messages.length) {
                MessageEmitter.getMessageEmitter().emit(MessageEmitter.PROCESS_SUCCESS, resultingMessages);
            }
            return result;
        };
    };
};
