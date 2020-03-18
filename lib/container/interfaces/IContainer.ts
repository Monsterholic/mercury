import { BindingContext } from './IBinding';

export interface Container {
    bind<T>(identifier: string): BindingContext<T>;
    get<T>(identifier: string): T;
    unbind(identifier: string): void;
}

export type Replaceable<T> = new (...args) => T;
