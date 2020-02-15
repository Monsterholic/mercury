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
        const instance = this.bindingDictionary.get(identifier);
        return handlerInstance.resolve(instance.implementation_main);
    }

    unbind(identifier: string): void {
        this.bindingDictionary.remove(identifier);
    }
}
