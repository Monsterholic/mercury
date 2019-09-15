import { Message } from '..';

export default abstract class Handler {
    constructor() {}
    abstract handle(msg: Message): any;
}
