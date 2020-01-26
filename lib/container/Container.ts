import { IContainer } from "./interfaces/IContainer";
import { IBindingContext } from "./interfaces/IBinding";
import { BindingContext } from "./BindingContext";
import { Binding } from "./Binding";

export class Container implements IContainer {

    bind<T>(identifier: string): IBindingContext<T> {
        return new BindingContext(new Binding())
    }

    get<T>(identifier: string): T {
        throw new Error("Method not implemented.");
    }

    unbind(identifier: string): void {
        throw new Error("Method not implemented.");
    }
}