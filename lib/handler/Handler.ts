import { Message } from '..';

export interface Handler {
    handle(msg: Message): Promise<void | Message | Message[]>;
}
