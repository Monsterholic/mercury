import Mercury, { JSONMessage } from '..';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

export function StorageEvent() {
    return function(target, propertyKey: string, descriptors: PropertyDescriptor) {
        const Events: Array<string> = Reflect.getMetadata('descriptors', Mercury);

        if (descriptors) {
            const original = descriptors.value;

            const decoratedFunction = async (...args: Message[]): Promise<void> => {
                let message = null;

                if (Array.isArray(args)) {
                    message = args.find((arg: Message): boolean => arg instanceof Message);
                }
                try {
                    const result = await original.apply(this, args);

                    return result;
                } catch (err) {
                    try {
                        MessageEmitter.getMessageEmitter().emit(
                            MessageEmitter.MESSAGE_PROCESS_ERROR,
                            err,
                            message.getUUID(),
                            message,
                        );
                    } catch (error) {
                        throw error;
                    }
                }
            };

            descriptors.value = decoratedFunction;

            Events.forEach((value: string) => {
                MessageEmitter.getMessageEmitter().addListener(value, decoratedFunction);
            });
        }
        return descriptors;
    };
}
