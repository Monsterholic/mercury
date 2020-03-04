import { Type, ClassDecoratorCustom } from './interfaces/IInstanceHandler';
export const handlerInstance = new (class {
    resolve<T>(target: Type<T>): T {
        const instances = Reflect.getMetadata('design:paramtypes', target) || [];

        console.log('[X] count dependencies: ', instances.length);

        const instancesInjections = instances.map(instance => handlerInstance.resolve(instance));

        return new target(...instancesInjections);
    }
})();

export const InjectDependecy = (name: string): ClassDecoratorCustom<Type<object>> => {
    return (target: Type<object>): void => {
        console.log(`[X] params: ${name}`, Reflect.getMetadata('design:paramtypes', target));
    };
};
