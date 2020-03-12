import { Message } from '..';

export interface Handler {
    handle(msg: Message): Promise<Message | Message[]> | void;
}
