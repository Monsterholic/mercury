import RabbitMQMessageBus from './messageBus/RabbitMQMessageBus';
import MessageBus from './messageBus/MessageBus';
import Handler from './handler/Handler';

export enum BrokerType {
    RABBITMQ = 'RABBITMQ',
}

const DEFAULT_RETRY_DELAY_TIME = 60;

export default class Mercury {
    public static handlerRegistry: Map<string, Handler> = new Map();
    private messageBus: MessageBus;
    private appName: string;
    private serviceName: string;
    private brokerHostName: string;
    private brokerUserName: string;
    private brokerPassword: string;
    private retryDelayTime: number;

    public constructor(
        brokerType: string,
        brokerHostName: string,
        brokerUserName: string,
        brokerPassword: string,
        appName: string,
        serviceName: string,
        retryDelayTime = DEFAULT_RETRY_DELAY_TIME,
    ) {
        this.appName = appName;
        this.serviceName = serviceName;
        this.brokerHostName = brokerHostName;
        this.brokerUserName = brokerUserName;
        this.brokerPassword = brokerPassword;
        this.retryDelayTime = retryDelayTime;

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
                retryDelay: this.retryDelayTime,
            });
        } catch (e) {
            throw e;
        }
    }

    public useHandler(handler: Handler) {
        Mercury.handlerRegistry.set(handler.constructor.name, handler);
    }

    public async terminate(): Promise<boolean> {
        return await this.messageBus.terminate();
    }
}
