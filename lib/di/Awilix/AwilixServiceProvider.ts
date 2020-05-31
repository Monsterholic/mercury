import { IScope } from './../Interfaces/IScope';
import { IServiceProvider } from '../Interfaces/IServiceProvider';
import { AwilixContainer } from 'awilix';
import { AwilixScope } from './AwilixScope';
export class AwilixServiceProvider implements IServiceProvider {
    constructor(private readonly awilixContainer: AwilixContainer) {}
    get<T>(identifier: string): T {
        return this.awilixContainer.resolve<T>(identifier);
    }
    resolve<T>(identifier: string): T {
        return this.awilixContainer.resolve<T>(identifier);
    }
    createScope(): IScope {
        return new AwilixScope(new AwilixServiceProvider(this.awilixContainer.createScope()));
    }
    dispose(): Promise<void> {
        return this.awilixContainer.dispose();
    }
}
