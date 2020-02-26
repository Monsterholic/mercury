import { Type, ClassDecoratorCustom } from './interfaces/IInstanceHandler';

export const handlerInstance = new (class {
    resolve<T>(target: Type<any>): T {
        const instances: Array<any> = Reflect.getMetadata('design:paramtypes', target) || [];

        console.log('[X] count dependences: ', instances.length);

        const instancesInjections = instances.map((instance: any) => handlerInstance.resolve(instance));

        return new target(...instancesInjections);
    }
})();

export const InjectDependecy = (name: string): ClassDecoratorCustom<Type<object>> => {
    return (target: Type<object>) => {
        console.log(`[X] params: ${name}`, Reflect.getMetadata('design:paramtypes', target));
    };
};
