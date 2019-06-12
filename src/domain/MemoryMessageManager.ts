import IMessageManager from "./interface/IMessageManager";
import {injectable} from "inversify";

@injectable()
export default class MemoryMessageManager implements IMessageManager {

    private _subscriptions:object = {}


    getHandlers(messageIdentifier: string): symbol[] {
        return this._subscriptions[messageIdentifier]
    }

    subscribe(messageIdentifier: string, handlerSymbol: symbol): void {
        if(!this._subscriptions[messageIdentifier])
            this._subscriptions[messageIdentifier] = []

        this._subscriptions[messageIdentifier] = this._subscriptions[messageIdentifier].concat([handlerSymbol])
    }

    subscriptions(): object {
        return this._subscriptions
    }

}