import { handler, JSONMessage } from '../lib/index';
class testHandler {
    @handler('user-created', 30)
    userCreated(msg) {
        console.log('A user has been created');

        throw new Error('something went wrong');
    }

    @handler('order-created')
    orderCreated(msg) {
        console.log('Something has been ordered');
        let msgContent = msg.getContent();

        return new JSONMessage('product-purchased', { test: 'data' });
    }
}
