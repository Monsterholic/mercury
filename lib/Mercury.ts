import RabbitMQMessageBus from './messageBus/RabbitMQMessageBus';
import MessageBus from './messageBus/MessageBus';

export enum BrokerType {
    RABBITMQ = 'RABBITMQ',
}

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

    public async init(): Promise<void> {
        await this.messageBus.configure({
            brokerHostName: this.brokerHostName,
            brokerUserName: this.brokerUserName,
            brokerPassword: this.brokerPassword,
            appName: this.appName,
            serviceName: this.serviceName,
            retryDelay: this.retryDelay,
        });
    }

    public async terminate(): Promise<void> {
        await this.messageBus.terminate();
    }
}
