import Message from './Message';

export default class JSONMessage extends Message {
    public getContent(): object {
        if (this.content instanceof Buffer) {
            return JSON.parse(this.content.toString());
        } else {
            return this.content;
        }
    }

    public getSerializedContent(): string {
        return JSON.stringify(this.content);
    }
}
