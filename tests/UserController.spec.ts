import { MessagePublisher, JSONMessage } from '../lib';

export class UserController {
    @MessagePublisher()
    public createUserCommand(message: object): Promise<JSONMessage> {
        return Promise.resolve(new JSONMessage('user-created', message));
    }
}
