import { Type } from './interfaces/IInstanceHandler';

export const handlerInstance = new (class {
    resolve<T>(target: Type<any>): T {
        const instances: Array<any> = Reflect.getMetadata('mercury:handler', target) || [];
        const instancesInjections = instances.map((instance: any) => handlerInstance.resolve(instance));

        return new target(...instancesInjections);
    }
})();
