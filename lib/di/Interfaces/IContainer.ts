import { IBindingContext } from './IBinding';
import { IServiceProvider } from './IServiceProvider';

export interface IContainer {
    bind<T>(identifier: string): IBindingContext<T>;
    unbind(identifier: string): void;
    build(): IServiceProvider;
}

export type Replaceable<T> = new (...args) => T;
