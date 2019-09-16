import { MessageHandler, Message, Handler } from '../lib';
import * as sinon from 'sinon';

export const spyOrderSucceededHandler = sinon.spy();

@MessageHandler('order-succeeded')
export class OrderSucceededHandler extends Handler {
    public async handle(message: Message): Promise<void> {
        spyOrderSucceededHandler(message);
    }
}
