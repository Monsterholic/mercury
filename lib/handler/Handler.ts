import { Message } from '..';

export default abstract class Handler {
    constructor() {}
    public abstract handle(msg: Message): void | Message | Message[];
}
