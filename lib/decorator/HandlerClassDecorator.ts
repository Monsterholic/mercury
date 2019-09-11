const HandlerDecorator = (messageDescriptor: string) => {
    return (constructor: Function) => {
        console.log(messageDescriptor);
        console.log(constructor.name);
    };
};

export default HandlerDecorator;
