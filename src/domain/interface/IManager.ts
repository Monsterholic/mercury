export default interface IManager {
    subscribe(messageIdentifier: string, handlerSymbol: symbol): void;
    getHandlers(messageIdentifier: string): symbol[];
}
