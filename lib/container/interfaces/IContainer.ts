export interface IContainer {
    bind<T>(identifier: string): IBinding<T>;
    get<T>(identifier: string): T;
    unbind(identifier: string): void;
}

export interface IBinding<T> {
    to(constructor: new (...args: any) => T);
}