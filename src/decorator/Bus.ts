export function Bus<T extends { new (...args: any[]): {} }>(constructor: T) {
    const eventsNameHandler = [];

    eventsNameHandler.push('Event1');
    eventsNameHandler.push('Event3');
    eventsNameHandler.push('Event2');

    return class extends constructor {
        _eventsNameHandler = eventsNameHandler;
    };
}
