import { Mercury } from '../Mercury';

export const MessageHandler = (messageDescriptor: string) => {
    return (constructor: Function): void => {
        if (!Reflect.hasMetadata('messageBindings', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('messageBindings', new Map(), Mercury.prototype.constructor);
        }
        const binding: Map<string, string> = Reflect.getMetadata('messageBindings', Mercury.prototype.constructor);
        binding.set(messageDescriptor, constructor.name);
    };
};
