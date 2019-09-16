import { MessageHandler, Message, Handler } from '../lib';
import * as sinon from 'sinon';

export const spyOrderCreatedHandler = sinon.spy();

@MessageHandler('order-created')
export default class OrderCreatedHandler extends Handler {
    public async handle(message: Message): Promise<void> {
        spyOrderCreatedHandler(message);
    }
}
