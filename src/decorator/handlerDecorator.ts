import Mercury from '../Mercury';
import MessageEmitter from '../messageBus/MessageBusEventEmitter';

export const handler = (descriptor: string): MethodDecorator => {
    console.log('teste2');

    return (target, propertyKey: string): void => {
        let handlerFunction = target[propertyKey];
        MessageEmitter.getMessageEmitter().addListener(descriptor, handlerFunction);

        let mercuryObj = new Mercury('');
        if (!Reflect.hasMetadata('descriptors', mercuryObj.constructor)) {
            Reflect.defineMetadata('descriptors', [], mercuryObj.constructor);
        }

        const descriptors = Reflect.getMetadata('descriptors', mercuryObj.constructor) as string[];
        descriptors.push(descriptor);
        Reflect.defineMetadata('descriptors', descriptors, mercuryObj.constructor);
    };
};
