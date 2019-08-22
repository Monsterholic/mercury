export default interface MessageBus {
    configure(name: string): Promise<void>;
}
