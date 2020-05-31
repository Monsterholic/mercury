import { IScope } from './IScope';

export interface IServiceProvider {
    get<T>(identifier: string): T;
    resolve<T>(identifier: string): T;
    createScope(): IScope;
    dispose(): Promise<void>;
}
