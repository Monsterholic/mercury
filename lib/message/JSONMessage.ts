import Message from './Message';

export default class JSONMessage extends Message {
    public getContent(): object {
        return JSON.parse(this.content as string);
    }

    public getSerializedContent(): string {
        return JSON.stringify(this.content);
    }
}
