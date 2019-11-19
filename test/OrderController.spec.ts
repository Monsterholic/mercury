import { MessagePublisher, JSONMessage } from '../lib';
import { ResultingMessages } from '../lib/message/ResultingMessages';

export class OrderController {
    @MessagePublisher()
    public createOrderCommand(message: object, resultMessages: ResultingMessages): any {
        resultMessages.addMessage(new JSONMessage('order-created', message));
        resultMessages.addMessage(new JSONMessage('order-succeeded', message));
        return { order: 'created' };
    }
}
