import Publisher from '../lib/decorator/Publisher';
import JSONMessage from '../lib/message/JSONMessage';

export default class UserController {
    @Publisher()
    public createUserCommand(message: object): JSONMessage {
        return new JSONMessage('user-created', message);
    }
}
