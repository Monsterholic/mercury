import * as uuid from 'uuid';

export default abstract class Message {
    protected readonly content: any;
    private readonly uuid: string;
    private readonly descriptor: string;
    private readonly creationDate: Date;
    private parentMessage: string;

    public constructor(
        descriptor: string,
        content: any,
        id: string = null,
        timestamp: number = null,
        parentMessage: string = null,
    ) {
        this.uuid = id ? id : uuid.v4();
        this.descriptor = descriptor;
        this.content = content;
        this.creationDate = timestamp ? new Date(timestamp) : new Date();
        this.parentMessage = parentMessage;
    }

    public getUUID(): string {
        return this.uuid;
    }

    public getParentMessage(): string {
        return this.parentMessage;
    }

    public abstract getContent(): any;
    public abstract getSerializedContent(): string;

    public getDescriptor(): string {
        return this.descriptor;
    }

    public getCreationDate(): Date {
        return this.creationDate;
    }
    public setParentMessage(parentMessageUUID: string): void {
        this.parentMessage = parentMessageUUID;
    }
}
