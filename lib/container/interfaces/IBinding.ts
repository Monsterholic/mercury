import { Replaceable } from './IContainer';
import { TypeBinding } from '../Binding/BindingEnum';

export interface BindingContext<T> {
    binding: Binding<T>;
    to<T>(constructor: Replaceable<T>);
    toConstantValue<T>(value: T);
}
export interface Binding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue;
}
