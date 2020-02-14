export type ClassDecoratorCustom<T> = (target: T) => void;

export interface Type<T> {
    new (...args: any[]): T;
}
