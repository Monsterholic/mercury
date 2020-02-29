import { IBinding } from '../interfaces/IBinding';
import { Replaceable } from '../interfaces/IContainer';
import { identifier } from './identifierCount';
import { TypeBinding } from './BindingEnum';

export class Binding<T> implements IBinding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue: any;

    constructor() {
        this.bindingId = identifier();
    }
}
