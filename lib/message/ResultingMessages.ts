import { Message } from './Message';

export class ResultingMessages {
    public messages: Message[] = [];

    public addMessage(message: Message): void {
        this.messages.push(message);
    }
}
