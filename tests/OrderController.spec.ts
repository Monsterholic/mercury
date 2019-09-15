import Publisher from '../lib/decorator/Publisher';
import JSONMessage from '../lib/message/JSONMessage';

export default class OrderController {
    @Publisher()
    public createOrderCommand(message: object): JSONMessage[] {
        return [new JSONMessage('order-created', message), new JSONMessage('order-succeeded', message)];
    }
}
