import AbstractMessageBus from './AbstractMessageBus';
import RabbitMQConnectionFacade from '../connection/RabbitMQConnectionFacade';
import Mercury from '../Mercury';

interface OptionsMap {
    appName: string;
    brokerHostName: string;
    brokerUserName: string;
    brokerPassword: string;
    serviceName: string;
}

export default class RabbitMQMessageBus extends AbstractMessageBus<RabbitMQConnectionFacade> {
    public async configure(args: OptionsMap): Promise<void> {
        let { brokerHostName, brokerUserName, brokerPassword, appName, serviceName } = args;
        this.connectionFacade = new RabbitMQConnectionFacade(serviceName, appName);
        await this.connectionFacade.connect(brokerHostName, brokerUserName, brokerPassword);

        const descriptors: string[] = Reflect.getMetadata('descriptors', Mercury);
        await this.connectionFacade.subscribeAll(descriptors);
    }
}
