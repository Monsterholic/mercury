import { BindingContext, Binding } from '../interfaces/IBinding';
import { Replaceable } from '../interfaces/IContainer';
import { TypeBinding } from './BindingEnum';

export class MercuryBinding<T> implements BindingContext<T> {
    binding: Binding<T>;

    constructor(binding: Binding<T>) {
        this.binding = binding;
    }

    to<T>(constructor: Replaceable<T>): this {
        this.binding.type = TypeBinding.Instance;
        this.binding.implementationMain = constructor;
        return this;
    }

    toConstantValue<T>(value: T): this {
        this.binding.type = TypeBinding.ConstantValue;
        this.binding.implementationConstantValue = value;
        return this;
    }
}
