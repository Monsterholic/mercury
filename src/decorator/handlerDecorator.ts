import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';

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
            try {
                await original.apply(this, args);
            } catch (e) {
                MessageEmitter.getMessageEmitter().emit('error', e);
            }
        };

        propertyDescriptor.value = decoratedFunction;

        MessageEmitter.getMessageEmitter().addListener(messageDescriptor, decoratedFunction);

        return propertyDescriptor;
    };
};
