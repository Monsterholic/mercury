import { Scope } from '../Binding/Scope';
export interface IBindingScope {
    type: Scope;
    InScope(): void;
    InTransient(): void;
    InSingleton(): void;
}
