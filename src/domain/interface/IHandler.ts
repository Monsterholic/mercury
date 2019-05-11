import AbstractMessage from "../abstract/AbstracMessage";

export default interface IHandler <T extends AbstractMessage> {
    handle(message:T):Promise<void>
}