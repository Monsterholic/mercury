import ContainerBuilder from './IoC/ContainerBuilder';
import Types from './IoC/Types';
import { RabbitMQBus } from './bus/RabbitMQBus';
import IMessageBus from './bus/IMessageBus';

export default class Index {
    public static main(): void {
        let container = ContainerBuilder.buildContainer();
        container.bind('LOL').to(RabbitMQBus);
        const bus = container.get<IMessageBus<any, any>>('LOL');

        bus.consumeMessages();

        console.log('workerd');
    }
}

Index.main();
