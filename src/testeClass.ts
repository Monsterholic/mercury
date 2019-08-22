import { handler } from './decorator/handlerDecorator';

export default class TesteClass {
    @handler('coisaCancelada')
    public handler() {
        console.log('evento coisa cancelada AConteceu');
        throw new Error('Erro teste');
    }

    @handler('coisaComprada')
    public handler2() {
        console.log('evento coisa comprada aconteceu');
    }
}
