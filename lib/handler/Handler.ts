import { Message } from '..';

export abstract class Handler {
    constructor() {}
    public abstract async handle(msg: Message): Promise<void | Message | Message[]>;
}
