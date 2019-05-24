export default interface IMessageManager {
    subscribe(messageIdentifier: string, handlerSymbol: symbol): void;
    getHandlers(messageIdentifier: string): symbol[];
}
