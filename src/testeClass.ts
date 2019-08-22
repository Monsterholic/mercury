import { handler } from './decorator/handlerDecorator';

export default class TesteClass {
    @handler('coisaCancelada')
    public handler() {
        console.log('evento coisa cancelada AConteceu');
    }

    @handler('coisaComprada')
    public handler2() {
        console.log('evento coisa comprada aconteceu');
    }
}
