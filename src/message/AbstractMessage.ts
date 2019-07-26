import ISerializable from "./ISerializable";

export default abstract class AbstractMessage <T extends ISerializable> {
    private identifier: string
    private content: T
    private date: Date

    public getContent(): T {
        return this.content;
    }

    public getIdentifier(): string {
        return this.identifier;
    }

    public getDate(): Date {
        return this.date;
    }
}