import { Binding } from '../interfaces/IBinding';

export interface BindingDictionary<T> {
    add(identifier: string, binding: Binding<T>);
    get(identifier: string): Binding<T>;
    remove(identifier: string): boolean;
}

export class BDictionary<T> implements BindingDictionary<T> {
    private dictionary: Map<string, Binding<T>>;

    constructor() {
        this.dictionary = new Map();
    }

    add(identifier: string, binding: Binding<T>): void {
        if (this.dictionary.has(identifier)) throw Error(`already exists bind for identifier: ${identifier}`);
        this.dictionary.set(identifier, binding);
    }

    get(identifier: string): Binding<T> {
        return this.dictionary.get(identifier);
    }

    remove(identifier: string): boolean {
        return this.dictionary.delete(identifier);
    }
}
