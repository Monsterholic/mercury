import Mercury from '..';

const MessageHandler = (messageDescriptor: string) => {
    return (constructor: Function) => {
        if (!Reflect.hasMetadata('messageBindings', Mercury.prototype.constructor)) {
            Reflect.defineMetadata('messageBindings', new Map(), Mercury.prototype.constructor);
        }
        const binding: Map<string, string> = Reflect.getMetadata('messageBindings', Mercury.prototype.constructor);
        binding.set(messageDescriptor, constructor.name);
    };
};

export default MessageHandler;
