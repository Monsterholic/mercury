import { IBinding } from "../interfaces/IBinding";

export interface IBindingDictionary<T> {
    add(identifier: string, binding: IBinding<T>)
}

export class BindingDictionary<T> implements IBindingDictionary<T> {
    private dictionary: Map<string, IBinding<T>>;

    constructor() {
        this.dictionary = new Map()
    }

    add(identifier: string, binding: IBinding<T>) {
        this.dictionary.set(identifier, binding)
    }
}