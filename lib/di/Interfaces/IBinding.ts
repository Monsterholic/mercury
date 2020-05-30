import { IBindingScope } from './IBindingScope';
import { Replaceable } from './IContainer';
import { TypeBinding } from '../Binding/BindingEnum';

export interface IBindingContext<T> {
    binding: IBinding<T>;
    bindingScope: IBindingScope;
    to<T>(constructor: Replaceable<T>): IBindingScope;
    toConstantValue<T>(value: T): IBindingScope;
}
export interface IBinding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue;
}
