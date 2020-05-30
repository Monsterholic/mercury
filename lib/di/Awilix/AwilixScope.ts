import { IScope } from './../Interfaces/IScope';
import { IServiceProvider } from '../Interfaces/IServiceProvider';
import { AwilixServiceProvider } from './AwilixServiceProvider';
export class AwilixScope implements IScope {
    constructor(private readonly awilixServiceProvider: AwilixServiceProvider) {}
    public get ServiceProvider(): IServiceProvider {
        return this.awilixServiceProvider;
    }
}
