import { IBinding } from '../interfaces/IBinding';

export interface IBindingDictionary<T> {
    add(identifier: string, binding: IBinding<T>);
    get(identifier: string): IBinding<T>;
    remove(identifier: string): boolean;
}

export class BindingDictionary<T> implements IBindingDictionary<T> {
    private dictionary: Map<string, IBinding<T>>;

    constructor() {
        this.dictionary = new Map();
    }

    add(identifier: string, binding: IBinding<T>): void {
        this.dictionary.set(identifier, binding);
    }

    get(identifier: string): IBinding<T> {
        return this.dictionary.get(identifier);
    }

    remove(identifier: string): boolean {
        return this.dictionary.delete(identifier);
    }
}
