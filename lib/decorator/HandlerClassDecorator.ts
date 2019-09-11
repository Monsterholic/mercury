import Mercury from '..';

const HandlerDecorator = (messageDescriptor: string) => {
    return (constructor: Function) => {
        if (!Reflect.hasMetadata('descriptors', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('descriptors', [], Mercury.prototype.constructor);
        }

        const descriptors = Reflect.getMetadata('descriptors', Mercury.prototype.constructor) as string[];
        if (!descriptors.includes(messageDescriptor)) {
            descriptors.push(messageDescriptor);
        }
    };
};

export default HandlerDecorator;
