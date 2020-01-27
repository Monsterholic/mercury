import { IBindingContext, IBinding } from "../interfaces/IBinding";
import { Replaceable } from "../interfaces/IContainer";

export class BindingContext<T> implements IBindingContext<T> {
    binding: IBinding<T>;

    constructor(binding: IBinding<T>) {
        this.binding = binding
    }

    to<T>(constructor: Replaceable<T>): this {
        this.binding.implementation_main = constructor
        return this;
    }

    injectDependecies(constructor: Array<Replaceable<any>>): this {
        this.binding.dependecies_main = constructor
        return this;
    }
}