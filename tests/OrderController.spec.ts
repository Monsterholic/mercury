import { MessagePublisher, JSONMessage } from '../lib';

export class OrderController {
    @MessagePublisher()
    public async createOrderCommand(message: object): Promise<JSONMessage[]> {
        return [new JSONMessage('order-created', message), new JSONMessage('order-succeeded', message)];
    }
}
