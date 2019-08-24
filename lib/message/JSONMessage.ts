import Message from './Message';

export default class JSONMessage extends Message {
    public getContent(): object {
        return JSON.parse(this.content.toString());
    }

    public getSerializedContent(): string {
        return this.content.toString();
    }
}
