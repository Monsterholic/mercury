import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

const handler = (messageDescriptor: string = null, maxRetries: number = null): MethodDecorator => {
    return (target, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        if (messageDescriptor) {
            if (!Reflect.hasMetadata('descriptors', Mercury.prototype.constructor)) {
                Reflect.defineMetadata('descriptors', [], Mercury.prototype.constructor);
            }

            const descriptors = Reflect.getMetadata('descriptors', Mercury.prototype.constructor) as string[];
            if (!descriptors.includes(messageDescriptor)) {
                descriptors.push(messageDescriptor);
            }

            Reflect.defineMetadata('descriptors', descriptors, Mercury.prototype.constructor);
        }

        const original = propertyDescriptor.value;
        const decoratedFunction = async (...args): Promise<Message[]> => {
            let message = null;
            if (Array.isArray(args)) {
                message = args.find((arg: Message): boolean => arg instanceof Message);
            }
            try {
                const result: Message[] = await original.apply(this, args);
                const resultingMessages =
                    Array.isArray(result) && result.every(r => r instanceof Message)
                        ? result
                        : result instanceof Message
                        ? [result]
                        : null;
                if (message) {
                    MessageEmitter.getMessageEmitter().emit(
                        MessageEmitter.MESSAGE_PROCESS_SUCCESS,
                        message.getUUID(),
                        resultingMessages,
                    );
                } else {
                    MessageEmitter.getMessageEmitter().emit(MessageEmitter.PROCESS_SUCCESS, resultingMessages);
                }
                return result;
            } catch (e) {
                if (message) {
                    MessageEmitter.getMessageEmitter().emit(
                        MessageEmitter.MESSAGE_PROCESS_ERROR,
                        e,
                        message.getUUID(),
                        message,
                        maxRetries,
                    );
                } else {
                    throw e;
                }
            }
        };

        propertyDescriptor.value = decoratedFunction;
        MessageEmitter.getMessageEmitter().addListener(messageDescriptor, () => {
            decoratedFunction();
        });

        return propertyDescriptor;
    };
};

export default handler;
