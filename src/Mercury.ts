import RabbitMQMessageBus from './messageBus/RabbitMQMessageBus';
import ConnectionFacade from './connection/ConnectionFacade';
import AbstractMessageBus from './messageBus/AbstractMessageBus';

const RABBITQM = 'rabbitmq';

export default class Mercury {
    private messageBus: AbstractMessageBus<ConnectionFacade>;
    private appName: string;
    private serviceName: string;
    private brokerHostName: string;
    private brokerUserName: string;
    private brokerPassword: string;

    public constructor(
        brokerType: string,
        brokerHostName: string,
        brokerUserName: string,
        brokerPassword: string,
        appName: string,
        serviceName: string,
    ) {
        this.appName = appName;
        this.serviceName = serviceName;
        this.brokerHostName = brokerHostName;
        this.brokerUserName = brokerUserName;
        this.brokerPassword = brokerPassword;

        switch (brokerType) {
            case RABBITQM:
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
        });
    }
}
