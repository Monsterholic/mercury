import MessageHandler from '../lib/decorator/MessageHandler';
import Handler from '../lib/handler/Handler';
import Message from '../lib/message/Message';

import * as sinon from 'sinon';

export const spyOrderCreatedHandler = sinon.spy();

@MessageHandler('order-created')
export default class OrderCreatedHandler extends Handler {
    handle(message: Message): any {
        spyOrderCreatedHandler(message);
    }
}
