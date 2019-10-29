import { RabbitMQMessageBus } from './messageBus/RabbitMQMessageBus';
import { MessageBus } from './messageBus/MessageBus';
import { Handler } from './handler/Handler';

const DEFAULT_RETRY_DELAY_TIME = 60;

export enum BrokerType {
    RABBITMQ = 'RABBITMQ',
}

export class Mercury {
    public static handlerRegistry: Map<string, Handler> = new Map();
    private messageBus: MessageBus;
    private appName: string;
    private serviceName: string;
    private brokerHostName: string;
    private brokerUserName: string;
    private brokerPassword: string;
    private retryDelayTime: number;
    private filterMessages: boolean;

    public constructor(
        brokerType: string,
        brokerHostName: string,
        brokerUserName: string,
        brokerPassword: string,
        appName: string,
        serviceName: string,
        retryDelayTime: number = DEFAULT_RETRY_DELAY_TIME,
        filterMessages = true,
    ) {
        this.appName = appName;
        this.serviceName = serviceName;
        this.brokerHostName = brokerHostName;
        this.brokerUserName = brokerUserName;
        this.brokerPassword = brokerPassword;
        this.retryDelayTime = retryDelayTime;
        this.filterMessages = filterMessages;

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
                appName: this.appName,
                brokerHostName: this.brokerHostName,
                brokerPassword: this.brokerPassword,
                brokerUserName: this.brokerUserName,
                retryDelay: this.retryDelayTime,
                serviceName: this.serviceName,
                filterMessages: this.filterMessages,
            });
        } catch (e) {
            throw e;
        }
    }

    public useHandler(handler: Handler): void {
        Mercury.handlerRegistry.set(handler.constructor.name, handler);
    }

    public async terminate(): Promise<boolean> {
        return await this.messageBus.terminate();
    }
}
