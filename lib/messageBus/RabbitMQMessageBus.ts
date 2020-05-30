import { RabbitMQConnectionFacade } from '../connection/RabbitMQConnectionFacade';
import { Mercury } from '../Mercury';
import { MessageBus, OptionsMap } from './MessageBus';
import { IContainer } from '../di/Interfaces/IContainer';

export class RabbitMQMessageBus implements MessageBus {
    private connectionFacade: RabbitMQConnectionFacade;
    private container: IContainer;

    constructor(container: IContainer) {
        this.container = container;
    }

    public async configure(args: OptionsMap): Promise<boolean> {
        const {
            brokerHostName,
            brokerUserName,
            brokerPassword,
            appName,
            serviceName,
            retryDelay,
            filterMessages,
            preFetch,
        } = args;
        this.connectionFacade = new RabbitMQConnectionFacade(
            serviceName,
            appName,
            retryDelay,
            filterMessages,
            preFetch,
            this.container,
        );
        try {
            await this.connectionFacade.connect(brokerHostName, brokerUserName, brokerPassword);
            const messageBindings: Map<string, string> = Reflect.getMetadata('messageBindings', Mercury);
            await this.connectionFacade.subscribeAll(messageBindings);
            return true;
        } catch (e) {
            throw e;
        }
    }

    public async terminate(): Promise<boolean> {
        try {
            await this.connectionFacade.disconnect();
            this.connectionFacade = null;
            return true;
        } catch (e) {
            return false;
        }
    }
}
