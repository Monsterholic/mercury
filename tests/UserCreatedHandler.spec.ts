import MessageHandler from '../lib/decorator/MessageHandler';
import Handler from '../lib/handler/Handler';
import Message from '../lib/message/Message';
import * as sinon from 'sinon';

export const spyUserCreatedMessage = sinon.spy();

@MessageHandler('user-created')
export default class UserCreatedHandler extends Handler {
    handle(message: Message): any {
        spyUserCreatedMessage(message);
    }
}
