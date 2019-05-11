namespace src.domain.interface {
    export interface IMessageBus {
        eventManager: any;
        publish(msg): Promise<void>
        subscribeAll(): Promise<void>
        consume()
    }
}