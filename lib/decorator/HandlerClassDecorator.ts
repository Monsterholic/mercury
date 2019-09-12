import Mercury from '..';

const HandlerDecorator = (messageDescriptor: string) => {
    return (constructor: Function) => {
        if (!Reflect.hasMetadata('descriptors', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('descriptors', [], Mercury.prototype.constructor);
        }

        if (!Reflect.hasMetadata('eventLinkToClass', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('eventLinkToClass', new Map(), Mercury.prototype.constructor);
        }

        const binding: Map<string, string> = Reflect.getMetadata('eventLinkToClass', Mercury.prototype.constructor);
        binding.set(messageDescriptor, constructor.name);
        const descriptors = Reflect.getMetadata('descriptors', Mercury.prototype.constructor) as string[];
        if (!descriptors.includes(messageDescriptor)) {
            descriptors.push(messageDescriptor);
        }
    };
};

export default HandlerDecorator;
