import AbstractMessage from "../message/AbstractMessage";
import ISerializable from "../message/ISerializable";

export default interface IMessageBus<T extends ISerializable,H extends AbstractMessage<T>> {
    publishMessage(message:H):Promise<void>
    consumeMessages():Promise<void>
}