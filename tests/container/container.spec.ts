import 'mocha';
import { expect } from 'chai';
import { ContainerMercury } from '../../lib/container/Container';

describe('Container', () => {
    it('should throw exception if identifier exists', () => {
        const container = new ContainerMercury();
        class Test {}

        container.bind('BindEvent').to(Test);

        expect(() => {
            container.bind('BindEvent').to(Test);
        }).to.throw();
    });

    it('should throw exception if binding not exists', () => {
        const container = new ContainerMercury();

        expect(() => {
            const instance = container.get('BindEvent');
        }).to.throw();
    });
});
