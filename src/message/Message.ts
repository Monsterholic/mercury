export default abstract class Message {
    private readonly uuid: string;
    private readonly descriptor: string;
    private readonly content: any;
    private readonly creationDate: Date;

    public constructor(descriptor: string, content: any, id: string = null) {
        this.uuid = id === null ? this.generateUUID() : id;
        this.descriptor = descriptor;
        this.content = content;
        this.creationDate = new Date();
    }

    public abstract getSerializedContent(): string;

    public getDescriptor(): string {
        return this.descriptor;
    }

    public getCreationDate(): Date {
        return this.creationDate;
    }

    private generateUUID(): string {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    }
}
