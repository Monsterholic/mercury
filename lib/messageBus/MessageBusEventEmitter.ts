import * as EventEmitter from 'events';

export class MessageEmitter extends EventEmitter {
    public static readonly PROCESS_SUCCESS: string = 'PROCESS_SUCCESS';
    public static readonly MESSAGE_PROCESS_SUCCESS: string = 'MESSAGE_PROCESS_SUCCESS';
    public static readonly MESSAGE_PROCESS_ERROR: string = 'MESSAGE_PROCESS_ERROR';
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
