import { IBinding } from '../interfaces/IBinding';
import { Replaceable } from '../interfaces/IContainer';

export class Binding<T> implements IBinding<T> {
    binding_id: number;
    implementation_main: Replaceable<any>;
}
