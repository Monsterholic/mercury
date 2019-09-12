import HandlerDecorator from './decorator/HandlerClassDecorator';
import { Handler } from './handler/Handler';
import Mercury, { JSONMessage } from '.';
import { Publish } from './decorator/PublishMethodDecorator';

const config = new Mercury('RABBITMQ', 'localhost', 'guest', 'guest', 'mercury', 'test-service');

@HandlerDecorator('CreatedUser')
class SendEmail extends Handler {
    handle() {
        console.log('SendEmail');
    }
}
config.useHandler(new SendEmail());

@HandlerDecorator('CreatedLead')
class EnviarParaVendedor extends Handler {
    handle(msg) {
        console.log('CreatedLead 111', msg);
    }
}
config.useHandler(new EnviarParaVendedor());

console.log('messageBindings', Reflect.getMetadata('messageBindings', Mercury.prototype.constructor));
console.log('registerHandles', Mercury.registerHandlers);
config.init();

class sendEvent {
    @Publish()
    criar() {
        return new JSONMessage('CreatedLead', {
            vsf: 'asdasd',
        });
    }
}

let asd = new sendEvent();
asd.criar();
