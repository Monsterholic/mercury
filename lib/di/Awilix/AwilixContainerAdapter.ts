import { IContainer } from '../Interfaces/IContainer';
import { IBindingContext } from '../interfaces/IBinding';
import { IServiceProvider } from '../Interfaces/IServiceProvider';
import { AwilixContainer } from 'awilix';
import { AwilixServiceProvider } from './AwilixServiceProvider';
import { AwilixBindingContextAdapter } from './AwilixBindingContextAdapter';

export class AwilixContainerAdapter implements IContainer {
    private bindings: IBindingContext<any>[] = [];

    constructor(private readonly awilixContainer: AwilixContainer) {}

    public bind<T>(identifier: string): IBindingContext<T> {
        var newBinding = new AwilixBindingContextAdapter<T>(identifier, this.awilixContainer);
        this.bindings.push(newBinding);
        return newBinding;
    }

    public unbind(identifier: string): void {
        throw new Error('Method not implemented.');
    }

    public build(): IServiceProvider {
        this.bindings.forEach(b => {
            if (!b.bindingScope.type) b.bindingScope.InTransient();
        });
        return new AwilixServiceProvider(this.awilixContainer);
    }
}
