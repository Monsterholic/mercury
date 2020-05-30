import { IType, ClassDecoratorCustom } from './Interfaces/IInstanceHandler';
export const handlerInstance = new (class {
    resolve<T>(target: IType<T>): T {
        const instances = Reflect.getMetadata('design:paramtypes', target) || [];

        console.log('[X] count dependencies: ', instances.length);

        const instancesInjections = instances.map(instance => handlerInstance.resolve(instance));

        return new target(...instancesInjections);
    }
})();

export const InjectDependecy = (name: string): ClassDecoratorCustom<IType<object>> => {
    return (target: IType<object>): void => {
        console.log(`[X] params: ${name}`, Reflect.getMetadata('design:paramtypes', target));
    };
};
