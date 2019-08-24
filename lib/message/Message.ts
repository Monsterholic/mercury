export default abstract class Message {
    private readonly uuid: string;
    private readonly descriptor: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected readonly content: any;
    private readonly creationDate: Date;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(descriptor: string, content: any, id: string = null) {
        this.uuid = id === null ? this.generateUUID() : id;
        this.descriptor = descriptor;
        this.content = content;
        this.creationDate = new Date();
    }

    public getUUID(): string {
        return this.uuid;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public abstract getContent(): any;
    public abstract getSerializedContent(): string;

    public getDescriptor(): string {
        return this.descriptor;
    }

    public getCreationDate(): Date {
        return this.creationDate;
    }

    private generateUUID(): string {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c): string {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
}
