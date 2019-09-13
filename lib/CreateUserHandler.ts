import HandlerDecorator from './decorator/MessageHandler';
import Handler from './handler/Handler';

@HandlerDecorator('create-user')
export default class CreateUserHandler extends Handler {
    handle() {
        console.log('SendEmail');
    }
}
