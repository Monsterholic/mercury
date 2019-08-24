import RabbitMQConnectionFacade from '../connection/RabbitMQConnectionFacade';
import Mercury from '../Mercury';
import MessageBus, { OptionsMap } from './MessageBus';

export default class RabbitMQMessageBus implements MessageBus {
    private connectionFacade: RabbitMQConnectionFacade;

    public async configure(args: OptionsMap): Promise<void> {
        let { brokerHostName, brokerUserName, brokerPassword, appName, serviceName } = args;
        this.connectionFacade = new RabbitMQConnectionFacade(serviceName, appName);
        await this.connectionFacade.connect(brokerHostName, brokerUserName, brokerPassword);

        const descriptors: string[] = Reflect.getMetadata('descriptors', Mercury);
        await this.connectionFacade.subscribeAll(descriptors);
    }
}
