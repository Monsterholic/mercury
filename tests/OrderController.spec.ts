import MessagePublisher from '../lib/decorator/MessagePublisher';
import JSONMessage from '../lib/message/JSONMessage';

export default class OrderController {
    @MessagePublisher()
    public createOrderCommand(message: object): JSONMessage[] {
        return [new JSONMessage('order-created', message), new JSONMessage('order-succeeded', message)];
    }
}
