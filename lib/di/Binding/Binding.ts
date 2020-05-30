import { IBinding } from '../Interfaces/IBinding';
import { Replaceable } from '../Interfaces/IContainer';
import { identifier } from './identifierCount';
import { TypeBinding } from './BindingEnum';

export class BindingCustom<T> implements IBinding<T> {
    bindingId: number;
    implementationMain: Replaceable<any>;
    type: TypeBinding;
    implementationConstantValue: any;

    constructor() {
        this.bindingId = identifier();
    }
}
