import Message from '../message/Message';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';

const Publisher = () => {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        const originalFunc = propertyDescriptor.value;

        propertyDescriptor.value = function(...args: any[]) {
            const result = originalFunc.apply(this, args);
            let resultingMessages =
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
export default Publisher;
