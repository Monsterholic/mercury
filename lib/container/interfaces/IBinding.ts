import { Replaceable } from './IContainer';
import { TypeBinding } from '../Binding/BindingEnum';

export interface IBindingContext<T> {
    binding: IBinding<T>;
    to<T>(constructor: Replaceable<T>);
    toConstantValue<T>(value: T);
}

export interface IBinding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue: any;
}
