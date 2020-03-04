import { Binding } from '../interfaces/IBinding';
import { Replaceable } from '../interfaces/IContainer';
import { identifier } from './identifierCount';
import { TypeBinding } from './BindingEnum';

export class BindingCustom<T> implements Binding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue: any;

    constructor() {
        this.bindingId = identifier();
    }
}
