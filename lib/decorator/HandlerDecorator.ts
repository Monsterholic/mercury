import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

const handler = (messageDescriptor: string): MethodDecorator => {
    return (target, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        if (!Reflect.hasMetadata('descriptors', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('descriptors', [], Mercury.prototype.constructor);
        }

        const descriptors = Reflect.getMetadata('descriptors', Mercury.prototype.constructor) as string[];
        descriptors.push(messageDescriptor);
        Reflect.defineMetadata('descriptors', descriptors, Mercury.prototype.constructor);

        const original = propertyDescriptor.value;
        const decoratedFunction = async (...args: Message[]): Promise<void> => {
            let message = args.find((arg: Message): boolean => arg instanceof Message);
            try {
                let resultingEvents: Message[] = await original.apply(this, args);
                MessageEmitter.getMessageEmitter().emit('success', message.getUUID(), resultingEvents);
            } catch (e) {
                MessageEmitter.getMessageEmitter().emit('error', e, message.getUUID());
            }
        };

        propertyDescriptor.value = decoratedFunction;

        MessageEmitter.getMessageEmitter().addListener(messageDescriptor, decoratedFunction);

        return propertyDescriptor;
    };
};

export default handler;