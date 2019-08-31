import Message from './Message';

export default class JSONMessage extends Message {
    public getContent(): object {
        return JSON.parse(this.content);
    }

    public getSerializedContent(): string {
        return this.content.toString();
    }
}
