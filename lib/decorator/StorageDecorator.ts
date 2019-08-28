import Mercury from '..';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

export function StorageEvent() {
    return function(target, propertyKey: string, descriptors: PropertyDescriptor) {
        const Events: Array<string> = Reflect.getMetadata('descriptors', Mercury);

        Events.forEach((value: string) => {
            MessageEmitter.getMessageEmitter().on(value, function(args) {
                console.log('event save!', args);
            });
        });
    };
}
