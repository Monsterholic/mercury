import { Container } from './interfaces/IContainer';
import { BindingContext, Binding } from './interfaces/IBinding';
import { MercuryBinding } from './Binding/BindingContext';
import { BindingCustom } from './Binding/Binding';
import { BindingDictionary, BDictionary } from './Binding/BindingDictionary';
import { handlerInstance } from './handler.instance';

export class ContainerMercury implements Container {
    private bindingDictionary: BindingDictionary<Binding<any>>;

    constructor() {
        this.bindingDictionary = new BDictionary();
    }

    bind<T>(identifier: string): BindingContext<T> {
        const binding = new BindingCustom<T>();
        this.bindingDictionary.add(identifier, binding);
        return new MercuryBinding(binding);
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
