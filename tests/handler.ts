import { handler, JSONMessage } from '../lib/index';

export default class {
    @handler('user-created', 30)
    private userCreated(): void {
        throw new Error('something went wrong');
    }

    @handler('order-created')
    private orderCreated(): JSONMessage {
        return new JSONMessage('product-purchased', { test: 'data' });
    }
}
