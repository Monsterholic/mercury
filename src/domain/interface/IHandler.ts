import AbstractMessage from "../abstract/AbstractMessage";

namespace src.domain.interfaces {

    export interface IHandler <T extends AbstractMessage> {
        handle(message:T):Promise<void>
    }
}

