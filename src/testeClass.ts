import { handler } from './decorator/handlerDecorator';

export default class TesteClass {
    @handler('coisaCancelada')
    public handler() {
        console.log('teste');
    }

    @handler('coisaComprada')
    public handler2() {
        console.log('teste');
    }
}
