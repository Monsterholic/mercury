import { IContainer } from './interfaces/IContainer';
import { IBindingContext, IBinding } from './interfaces/IBinding';
import { BindingContext } from './Binding/BindingContext';
import { Binding } from './Binding/Binding';
import { BindingDictionary, BDictionary } from './Binding/BindingDictionary';
import { handlerInstance } from './handler.instance';

export class Container implements IContainer {
    private bindingDictionary: BindingDictionary<IBinding<any>>;

    constructor() {
        this.bindingDictionary = new BDictionary();
    }

    bind<T>(identifier: string): IBindingContext<T> {
        const binding = new Binding();
        this.bindingDictionary.add(identifier, binding);
        return new BindingContext(binding);
    }

    get<T>(identifier: string): T {
        const binding = this.bindingDictionary.get(identifier);
        if (!binding) throw Error(`${identifier} not found binding.`);
        return handlerInstance.resolve(binding.implementationMain);
    }

    unbind(identifier: string): void {
        this.bindingDictionary.remove(identifier);
    }
}
