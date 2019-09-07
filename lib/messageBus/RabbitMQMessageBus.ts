import RabbitMQConnectionFacade from '../connection/RabbitMQConnectionFacade';
import Mercury from '../Mercury';
import MessageBus, { OptionsMap } from './MessageBus';

export default class RabbitMQMessageBus implements MessageBus {
    private connectionFacade: RabbitMQConnectionFacade;

    public async configure(args: OptionsMap): Promise<boolean> {
        const { brokerHostName, brokerUserName, brokerPassword, appName, serviceName, retryDelay } = args;
        this.connectionFacade = new RabbitMQConnectionFacade(serviceName, appName, retryDelay);
        try {
            await this.connectionFacade.connect(brokerHostName, brokerUserName, brokerPassword);
            const descriptors: string[] = Reflect.getMetadata('descriptors', Mercury);
            await this.connectionFacade.subscribeAll(descriptors);
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
            throw e;
        }
    }
}
