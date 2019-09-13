import CreateOrderHandler from './CreateOrderHandler';
import CreateUserHandler from './CreateUserHandler';
import Mercury, { JSONMessage } from '.';
import Publisher from './decorator/Publisher';

class sendEvent {
    @Publisher()
    criar() {
        return new JSONMessage('create-order', {
            vsf: 'asdasd',
        });
    }
}

const config = new Mercury('RABBITMQ', 'localhost', '' + 'guest', 'guest', 'mercury', 'test-service');
config.useHandler(new CreateOrderHandler());
config.useHandler(new CreateUserHandler());
config.init().then(() => {
    const testeClass = new sendEvent();
    testeClass.criar();
});
