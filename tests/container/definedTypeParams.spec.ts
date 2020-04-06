import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';
import { ContainerMercury } from '../../lib/container/Container';
import { InjectDependecy } from '../../lib/container/handler.instance';

describe('Defined type params class', () => {
    class GOP {
        print() {
            console.log('[x][x]');
        }
    }

    @InjectDependecy('POP')
    class POP {
        private gop: object;
        private num: number = 1;

        constructor(gop: object) {
            this.gop = gop;
        }

        inc() {
            this.num += 1;
        }
        print() {
            console.log('[x]');
            return this.num;
        }
    }

    it('print info target', () => {
        const container = ContainerMercury.getInstance();

        container.bind('LOL').to(POP);
        const instance = container.get<POP>('LOL');
        instance.inc();
        expect(2).to.eq(instance.print());
    });

    it('should return same intance of ConteinerMercury', () => {
        const container = ContainerMercury.getInstance();
        const instance = container.get<POP>('LOL');

        expect(1).to.eq(instance.print());
    });
});
