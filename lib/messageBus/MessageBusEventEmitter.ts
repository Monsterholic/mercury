import * as EventEmitter from 'events';

export default class MessageEmitter extends EventEmitter {
    private static emitter: MessageEmitter;

    private constructor() {
        super();
    }

    public emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, args);
    }

    public static getMessageEmitter(): MessageEmitter {
        if (!MessageEmitter.emitter) {
            MessageEmitter.emitter = new MessageEmitter();
        }

        return MessageEmitter.emitter;
    }
}
