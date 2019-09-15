import MessagePublisher from '../lib/decorator/MessagePublisher';
import JSONMessage from '../lib/message/JSONMessage';

export default class UserController {
    @MessagePublisher()
    public createUserCommand(message: object): JSONMessage {
        return new JSONMessage('user-created', message);
    }
}
