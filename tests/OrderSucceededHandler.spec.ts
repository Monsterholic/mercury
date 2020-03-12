import { MessageHandler, Message, Handler } from '../lib';
import * as sinon from 'sinon';

export const spyOrderSucceededHandler = sinon.spy();

@MessageHandler('order-succeeded')
export class OrderSucceededHandler implements Handler {
    public handle(message: Message): void {
        spyOrderSucceededHandler(message);
    }
}
