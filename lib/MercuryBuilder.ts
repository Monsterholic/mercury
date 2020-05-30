import { IContainer } from './di/Interfaces/IContainer';
import { AwilixContainer } from 'awilix';
import { AwilixContainerAdapter } from './di/Awilix/AwilixContainerAdapter';
import { Mercury } from './Mercury';

//SHOULD BE CALLED LIKE:
//MercuryBuilder.withAwilix(createContainer()).init();
export class MercuryBuilder {
    private mercury: Mercury;
    private container: IContainer;

    public static withAwilix(awilixContainer: AwilixContainer): MercuryBuilder {
        var mercuryBuilder = new MercuryBuilder();
        mercuryBuilder.mercury = new Mercury('', '', '', '', '');
        mercuryBuilder.container = new AwilixContainerAdapter(awilixContainer);
        mercuryBuilder.mercury.setContainer(mercuryBuilder.container);
        return mercuryBuilder;
    }

    public init(): void {
        if (!this.container) throw Error('container not instantiated.');
        this.mercury.init();
    }
}
