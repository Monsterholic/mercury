import AbstractMessageBus from './AbstractMessageBus';
import RabbitMQConnectionFacade from '../connection/RabbitMQConnectionFacade';
import Mercury from '../Mercury';

interface OptionsMap {
    appName: string;
    hostName: string;
    userName: string;
    password: string;
}

export default class RabbitMQMessageBus extends AbstractMessageBus<RabbitMQConnectionFacade> {
    public async configure(args: OptionsMap): Promise<void> {
        let { hostName, userName, password, appName } = args;
        this.connectionFacade = new RabbitMQConnectionFacade(appName);
        await this.connectionFacade.connect(hostName, userName, password);

        const descriptors: string[] = Reflect.getMetadata('descriptors', Mercury);
        await this.connectionFacade.subscribeAll(descriptors);
    }
}
