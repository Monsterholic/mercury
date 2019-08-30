import Mercury from '..';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

export function StorageEvent() {
    return function(target, propertyKey: string, descriptors: PropertyDescriptor) {
        const Events: Array<string> = Reflect.getMetadata('descriptors', Mercury);

        if (descriptors) {
            const original = descriptors.value;

            const decoratedFunction = async (args: Message[]): Promise<void> => {
                await original.apply(this, args);
            };

            descriptors.value = decoratedFunction;

            Events.forEach((value: string) => {
                MessageEmitter.getMessageEmitter().on(value, decoratedFunction);
            });
        }
        return descriptors;
    };
}
