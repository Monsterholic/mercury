import { IContainer } from './interfaces/IContainer';
import { IBindingContext, IBinding } from './interfaces/IBinding';
import { BindingContext } from './Binding/BindingContext';
import { Binding } from './Binding/Binding';
import { IBindingDictionary, BindingDictionary } from './Binding/BindingDictionary';
import { handlerInstance } from './handler.instance';

export class Container implements IContainer {
    private bindingDictionary: IBindingDictionary<IBinding<any>>;

    constructor() {
        this.bindingDictionary = new BindingDictionary();
    }

    bind<T>(identifier: string): IBindingContext<T> {
        const binding = new Binding();
        this.bindingDictionary.add(identifier, binding);
        return new BindingContext(binding);
    }

    get<T>(identifier: string): T {
        const binding = this.bindingDictionary.get(identifier);
        if (!binding) throw Error(`${identifier} not found binding.`);
        return handlerInstance.resolve(binding.implementation_main);
    }

    unbind(identifier: string): void {
        this.bindingDictionary.remove(identifier);
    }
}
