import IMessage from '../interface/IMessage';

export default abstract class AbstractMessage implements IMessage {
    _identifier: string;
    _content: object;
    _date: Date;

    constructor(identifier: string, content: object) {
        this._content = content;
        this._identifier = identifier;
        this._date = new Date();
    }

    public get content(): object {
        return this._content;
    }

    public get identifier(): string {
        return this._identifier;
    }

    public get date(): Date {
        return this._date;
    }
}
