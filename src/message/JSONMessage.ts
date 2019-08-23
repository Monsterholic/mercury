import Message from './Message';

export default class JSONMessage extends Message {
    public getSerializedContent(): string {
        return this.content.toString();
    }
}
