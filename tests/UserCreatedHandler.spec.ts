import { MessageHandler, Message, Handler } from '../lib';
import * as sinon from 'sinon';

export const spyUserCreatedMessage = sinon.spy();

@MessageHandler('user-created')
export class UserCreatedHandler extends Handler {
    public async handle(message: Message): Promise<void> {
        spyUserCreatedMessage(message);
    }
}
