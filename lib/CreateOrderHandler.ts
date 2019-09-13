import MessageHandler from './decorator/MessageHandler';
import Handler from './handler/Handler';
import JSONMessage from './message/JSONMessage';

@MessageHandler('create-order')
export default class CreateOrderHandler extends Handler {
    handle(msg) {
        console.log('CreatedLead 111', msg);
        return new JSONMessage('create-user', { teste: 'teste' });
    }
}
