import { IBindingContext } from './IBinding';

export interface IContainer {
    bind<T>(identifier: string): IBindingContext<T>;
    get<T>(identifier: string): T;
    unbind(identifier: string): void;
}

export type Replaceable<T> = new (...args: any[]) => T;
