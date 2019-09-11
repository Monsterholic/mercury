import { Message } from '..';

export abstract class Handler {
    constructor() {}
    abstract handle(msg: Message): any;
}
