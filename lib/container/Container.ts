import { Container } from './interfaces/IContainer';
import { BindingContext, Binding } from './interfaces/IBinding';
import { MercuryBinding } from './Binding/BindingContext';
import { BindingCustom } from './Binding/Binding';
import { BindingDictionary, BDictionary } from './Binding/BindingDictionary';
import { handlerInstance } from './handler.instance';
import { TypeBinding } from './Binding/BindingEnum';

export class ContainerMercury implements Container {
    private static instance: ContainerMercury;

    private bindingDictionary: BindingDictionary<Binding<any>>;

    constructor() {
        this.bindingDictionary = new BDictionary();
    }

    static getInstance() {
        if (!ContainerMercury.instance) {
            ContainerMercury.instance = new ContainerMercury();
            return ContainerMercury.instance;
        }
        return ContainerMercury.instance;
    }

    bind<T>(identifier: string): BindingContext<T> {
        const binding = new BindingCustom<T>();
        this.bindingDictionary.add(identifier, binding);
        return new MercuryBinding(binding);
    }

    get<T>(identifier: string): T {
        const binding = this.bindingDictionary.get(identifier);
        if (!binding) throw Error(`${identifier} not found binding.`);

        if (binding.type === TypeBinding.Instance) return handlerInstance.resolve(binding.implementationMain);
        return binding.implementationConstantValue;
    }

    unbind(identifier: string): void {
        this.bindingDictionary.remove(identifier);
    }
}
