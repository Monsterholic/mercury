import { IBinding } from '../interfaces/IBinding';
import { Replaceable } from '../interfaces/IContainer';
import { identifier } from './identifierCount';

export class Binding<T> implements IBinding<T> {
    binding_id: number;
    implementation_main: Replaceable<any>;

    constructor() {
        this.binding_id = identifier();
    }
}
