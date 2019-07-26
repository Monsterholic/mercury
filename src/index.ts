import ContainerBuilder from "./IoC/ContainerBuilder";
import Types from './IoC/Types'

export default class Index {

    public static main():void{
        let container = ContainerBuilder.buildContainer()
        let messageBus = container.get(Types.IMessageBus)

        console.log("workerd")
    }
}

Index.main()