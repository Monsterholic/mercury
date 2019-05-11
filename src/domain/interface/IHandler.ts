import AbstractMessage from "../abstract/AbstractMessage";

export default interface IHandler <T extends AbstractMessage> {
    handle(message:T):Promise<void>
}