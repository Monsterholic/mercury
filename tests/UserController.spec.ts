import { MessagePublisher, JSONMessage } from '../lib';

export class UserController {
    @MessagePublisher()
    public async createUserCommand(message: object): Promise<JSONMessage> {
        return new JSONMessage('user-created', message);
    }
}
