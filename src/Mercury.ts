import RabbitMQMessageBus from './messageBus/RabbitMQMessageBus';
import ConnectionFacade from './connection/ConnectionFacade';
import AbstractMessageBus from './messageBus/AbstractMessageBus';

const RABBITQM = 'rabbitmq';

export default class Mercury {
    private messageBus: AbstractMessageBus<ConnectionFacade>;

    public constructor(type: string) {
        switch (type) {
            case RABBITQM:
                this.messageBus = new RabbitMQMessageBus();
                break;
            default:
                this.messageBus = new RabbitMQMessageBus();
                break;
        }
    }

    public async start(hostName: string, userName: string, password: string, appName: string, serviceName: string) {
        await this.messageBus.configure({ hostName, userName, password, appName, serviceName });
    }
}
