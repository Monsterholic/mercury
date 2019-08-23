import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';
import Message from '../message/Message';

export const handler = (messageDescriptor: string): MethodDecorator => {
    return (target, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
        let mercuryObj = new Mercury('');
        if (!Reflect.hasMetadata('descriptors', mercuryObj.constructor)) {
            Reflect.defineMetadata('descriptors', [], mercuryObj.constructor);
        }

        const descriptors = Reflect.getMetadata('descriptors', mercuryObj.constructor) as string[];
        descriptors.push(messageDescriptor);
        Reflect.defineMetadata('descriptors', descriptors, mercuryObj.constructor);

        const original = propertyDescriptor.value;
        const decoratedFunction = async (...args: any[]): Promise<void> => {
            let message = args.find(arg => arg instanceof Message);
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
