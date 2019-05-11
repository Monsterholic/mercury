import { IMessage } from "../interfaces/IMessage";

export default abstract class AbstractMessage implements IMessage {
    _identifier: string;
    _content: string;
    _date: Date;

    constructor(identifier, content) {
        this._content = content;
        this._identifier = identifier;
        this._date = new Date()
    }

    public getContent() {
        return this._content
    }

    public getIdentifier() {
        return this._identifier
    }

}
