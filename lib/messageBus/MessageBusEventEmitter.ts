import * as EventEmitter from 'events';

export default class MessageEmitter extends EventEmitter {
    private static emitter: MessageEmitter;

    private constructor() {
        super();
    }

    public static getMessageEmitter(): MessageEmitter {
        if (!MessageEmitter.emitter) {
            MessageEmitter.emitter = new MessageEmitter();
        }

        return MessageEmitter.emitter;
    }
}
