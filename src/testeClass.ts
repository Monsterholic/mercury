import { handler } from './decorator/handlerDecorator';
import JSONMessage from './message/JSONMessage';

export default class TesteClass {
    @handler('coisaCancelada')
    public handler() {
        console.log('evento coisa cancelada AConteceu');
        throw new Error('Erro teste');
    }

    @handler('coisaComprada')
    public handler2() {
        console.log('evento coisa comprada aconteceu');
        return new JSONMessage('coisaRegistrada', { teste: 'teste' });
    }
}
