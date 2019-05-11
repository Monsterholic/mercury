namespace src.domain.interfaces {
    export interface IMessageBus {
        eventManager: any;
        publish(msg): Promise<void>
        subscribeAll(): Promise<void>
        consume()
    }
}