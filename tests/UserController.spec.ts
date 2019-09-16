import { MessagePublisher, JSONMessage } from '../lib';

export default class UserController {
    @MessagePublisher()
    public createUserCommand(message: object): JSONMessage {
        return new JSONMessage('user-created', message);
    }
}
