import { IContainer } from './Interfaces/IContainer';
import { IServiceProvider } from './Interfaces/IServiceProvider';
import { IBindingContext, IBinding } from './Interfaces/IBinding';
import { MercuryBinding } from './Binding/BindingContext';
import { BindingCustom } from './Binding/Binding';
import { BindingDictionary, BDictionary } from './Binding/BindingDictionary';
import { handlerInstance } from './handler.instance';
import { IScope } from './Interfaces/IScope';

export class ContainerMercury implements IContainer, IServiceProvider {
    private bindingDictionary: BindingDictionary<IBinding<any>>;

    constructor() {
        this.bindingDictionary = new BDictionary();
    }

    resolve<T>(identifier: string): T {
        throw new Error('Method not implemented.');
    }

    createScope(): IScope {
        throw new Error('Method not implemented.');
    }

    dispose(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    build(): IServiceProvider {
        return this;
    }

    bind<T>(identifier: string): IBindingContext<T> {
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
