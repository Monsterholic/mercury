import { AwilixContainer, BuildResolver } from 'awilix';
import { IBindingScope } from '../Interfaces/IBindingScope';
import { Scope } from '../Binding/Scope';
export class AwilixBindingScopeAdapter implements IBindingScope {
    public type: Scope = null;
    constructor(
        private readonly identifier: string,
        private readonly buildResolver: BuildResolver<any>,
        private readonly awilixContainer: AwilixContainer,
    ) {}
    public InScope(): void {
        this.awilixContainer.register(this.identifier, this.buildResolver.scoped());
        this.type = Scope.Scoped;
    }
    public InTransient(): void {
        this.awilixContainer.register(this.identifier, this.buildResolver.transient());
        this.type = Scope.Transient;
    }
    public InSingleton(): void {
        this.awilixContainer.register(this.identifier, this.buildResolver.singleton());
        this.type = Scope.Singleton;
    }
}
