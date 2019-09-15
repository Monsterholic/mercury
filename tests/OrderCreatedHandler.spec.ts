import MessageHandler from '../lib/decorator/MessageHandler';
import Handler from '../lib/handler/Handler';
import Message from '../lib/message/Message';

@MessageHandler('order-created')
export default class OrderCreatedHandler extends Handler {
    handle(message: Message): any {
        const content = message.getContent();
    }
}
