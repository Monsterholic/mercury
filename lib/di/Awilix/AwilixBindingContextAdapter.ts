import { Replaceable } from '../Interfaces/IContainer';
import { IBindingContext, IBinding } from '../interfaces/IBinding';
import { AwilixContainer, asClass } from 'awilix';
import { IBindingScope } from '../Interfaces/IBindingScope';
import { AwilixBindingScopeAdapter } from './AwilixBindingScopeAdapter';
export class AwilixBindingContextAdapter<T> implements IBindingContext<T> {
    public binding: IBinding<T>;
    public bindingScope: IBindingScope;
    constructor(private readonly identifier: string, private readonly awilixContainer: AwilixContainer) {}
    to<T>(constructor: Replaceable<T>): IBindingScope {
        this.bindingScope = new AwilixBindingScopeAdapter(this.identifier, asClass(constructor), this.awilixContainer);
        return this.bindingScope;
    }
    toConstantValue<T>(value: T): IBindingScope {
        throw new Error('Method not implemented.');
    }
}
