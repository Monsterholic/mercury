import RabbitMQMessageBus from './messageBus/RabbitMQMessageBus';
import MessageBus from './messageBus/MessageBus';
import { BrokerType } from './Enums/BrokerType';

export default class Mercury {
    private messageBus: MessageBus;
    private appName: string;
    private serviceName: string;
    private brokerHostName: string;
    private brokerUserName: string;
    private brokerPassword: string;
    private retryDelay: number;

    public constructor(
        brokerType: BrokerType,
        brokerHostName: string,
        brokerUserName: string,
        brokerPassword: string,
        appName: string,
        serviceName: string,
        retryDelay = 60,
    ) {
        this.appName = appName;
        this.serviceName = serviceName;
        this.brokerHostName = brokerHostName;
        this.brokerUserName = brokerUserName;
        this.brokerPassword = brokerPassword;
        this.retryDelay = retryDelay;

        switch (brokerType) {
            case BrokerType.RABBITMQ:
                this.messageBus = new RabbitMQMessageBus();
                break;
            default:
                this.messageBus = new RabbitMQMessageBus();
                break;
        }
    }

    public async init(): Promise<boolean> {
        try {
            return await this.messageBus.configure({
                brokerHostName: this.brokerHostName,
                brokerUserName: this.brokerUserName,
                brokerPassword: this.brokerPassword,
                appName: this.appName,
                serviceName: this.serviceName,
                retryDelay: this.retryDelay,
            });
        } catch (e) {
            throw e;
        }
    }

    public async terminate(): Promise<boolean> {
        return await this.messageBus.terminate();
    }
}
