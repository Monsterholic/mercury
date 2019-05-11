import { IMessage } from "../interface/IMessage";

export default abstract class AbstractMessage implements IMessage {
    _identifier: string;
    _content: string;
    _data: Date;

    constructor(identifier, content) {
        this._content = content;
        this._identifier = identifier;
    }

}
