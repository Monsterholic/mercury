///<reference path="IManager.ts" />

namespace src.domain.interface {
    export interface IMessageBus {
        eventManager: IManager
        publish(msg): Promise<void>
        subscribeAll(): Promise<void>
        consume(): Promise<void>
    }
}