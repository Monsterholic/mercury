import { Replaceable } from "./IContainer";

export interface IBindingContext<T> {
    binding: IBinding<T>;
    to<T>(constructor: Replaceable<T>)
    injectDependecies(constructor: Array<Replaceable<any>>)
}

export interface IBinding<T> {
    binding_id: number;
    implementation_main: Replaceable<any>;
    dependecies_main: Array<Replaceable<any>>;
}