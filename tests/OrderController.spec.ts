import { MessagePublisher, JSONMessage } from '../lib';

export class OrderController {
    @MessagePublisher()
    public createOrderCommand(message: object): Promise<JSONMessage[]> {
        return Promise.resolve([
            new JSONMessage('order-created', message),
            new JSONMessage('order-succeeded', message),
        ]);
    }
}
