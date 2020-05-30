import { IBindingContext, IBinding } from '../Interfaces/IBinding';
import { Replaceable } from '../Interfaces/IContainer';
import { TypeBinding } from './BindingEnum';
import { IBindingScope } from '../Interfaces/IBindingScope';
import { Scope } from './Scope';

export class CustomBindingScope implements IBindingScope {
    type: Scope;

    constructor() {
        this.type = Scope.Transient;
    }

    InScope(): void {
        this.type = Scope.Scoped;
    }
    InTransient(): void {
        this.type = Scope.Transient;
    }
    InSingleton(): void {
        this.type = Scope.Singleton;
    }
}

export class MercuryBinding<T> implements IBindingContext<T> {
    binding: IBinding<T>;
    bindingScope: IBindingScope;

    constructor(binding: IBinding<T>) {
        this.binding = binding;
    }

    to<T>(constructor: Replaceable<T>): IBindingScope {
        this.binding.type = TypeBinding.Instance;
        this.binding.implementationMain = constructor;
        return new CustomBindingScope();
    }

    toConstantValue<T>(value: T): IBindingScope {
        this.binding.type = TypeBinding.ConstantValue;
        this.binding.implementationConstantValue = value;
        var singletonScope = new CustomBindingScope();
        singletonScope.InSingleton();
        return singletonScope;
    }
}
