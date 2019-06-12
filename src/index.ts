import ContainerBuilder from "./IoC/ContainerBuilder";
import Types from './IoC/Types'
import IMessageManager from "./domain/interface/IMessageManager";

export default class Index {

    public static main():void{
        let container = ContainerBuilder.buildContainer()
        let messageManager:IMessageManager = container.get(Types.IMessageManager)

        messageManager.subscribe('messageIdentifier',Symbol.for('messageIdentifierHandler'))

        console.log(messageManager)
    }
}

Index.main()