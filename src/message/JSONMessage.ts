import Message from './Message';

export default class JSONMessage extends Message {
    private messageData: object;

    public getSerializedContent(): string {
        return this.messageData.toString();
    }
}
