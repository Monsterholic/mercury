import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

const handler = (messageDescriptor: string, maxRetries: number): MethodDecorator => {
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
        const decoratedFunction = async (args: Message[]): Promise<void> => {
            let message = args.find((arg: Message): boolean => arg instanceof Message);
            try {
                let resultingEvents: Message[] = await original.apply(this, args);
                if (message) {
                    MessageEmitter.getMessageEmitter().emit(
                        MessageEmitter.MESSAGE_PROCESS_SUCCESS,
                        message.getUUID(),
                        resultingEvents,
                    );
                } else {
                    MessageEmitter.getMessageEmitter().emit(MessageEmitter.PROCESS_SUCCESS, resultingEvents);
                }
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
        MessageEmitter.getMessageEmitter().addListener(messageDescriptor, decoratedFunction);

        return propertyDescriptor;
    };
};

export default handler;
