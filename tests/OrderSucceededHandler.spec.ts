import MessageHandler from '../lib/decorator/MessageHandler';
import Handler from '../lib/handler/Handler';
import Message from '../lib/message/Message';
import * as sinon from 'sinon';

export const spyOrderSucceededMessage = sinon.spy();

@MessageHandler('order-succeeded')
export default class OrderSucceededHandler extends Handler {
    handle(message: Message): any {
        const content = message.getContent();
        spyOrderSucceededMessage(content);
    }
}
