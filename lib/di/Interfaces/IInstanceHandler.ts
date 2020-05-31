export type ClassDecoratorCustom<T> = (target: T) => void;
export interface IType<T> {
    new (...args): T;
}
