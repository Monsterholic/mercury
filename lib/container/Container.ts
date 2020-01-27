import { IContainer } from "./interfaces/IContainer";
import { IBindingContext, IBinding } from "./interfaces/IBinding";
import { BindingContext } from "./Binding/BindingContext";
import { Binding } from "./Binding/Binding";
import { IBindingDictionary, BindingDictionary } from "./Binding/BindingDictionary";

export class Container implements IContainer {

    private bindingDictionary: IBindingDictionary<IBinding<any>>;

    constructor() {
        this.bindingDictionary = new BindingDictionary();
    }

    bind<T>(identifier: string): IBindingContext<T> {
        const binding = new Binding()
        this.bindingDictionary.add(identifier, binding)
        return new BindingContext(binding)
    }

    get<T>(identifier: string): T {
        throw new Error("Method not implemented.");
    }

    unbind(identifier: string): void {
        throw new Error("Method not implemented.");
    }
}

//***
//class ContTest {
//    private m: Map<any, any>;
//    private dependecy: Map<any, any>;
//
//    constructor() {
//        this.m = new Map()
//        this.dependecy = new Map()
//    }
//
//    to<T>(constructor: new (...args: any[]) => T) {
//        let tes: Function
//
//        console.log('constructor.arguments', constructor)
//        console.log('constructor.arguments', constructor.prototype)
//        this.m.set("Event", constructor)
//    }
//
//    injectDependecy<T>(dependecies: Array<new (...args: any[]) => T>) {
//        this.dependecy.set("dependecy1", dependecies)
//    }
//
//    get<T>(identifier: string): T {
//        const instance = this.m.get(identifier)
//        if (typeof instance === "object") {
//            const obj = new Object()
//            const clone = new (instance.constructor)(this.dependecy.get("dependecy1"))
//            return clone
//        }
//
//        const dependecies = this.dependecy.get("dependecy1")
//        const injectDependecy = dependecies.map((dep: new (...args: any) => T) => new dep())
//        return new instance(...injectDependecy)
//    }
//}
//*/