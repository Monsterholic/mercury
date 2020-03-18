import 'reflect-metadata';
import 'mocha';
import { expect } from 'chai';

import { handlerInstance, InjectDependecy } from '../../lib/container/handler.instance';
import { ContainerMercury } from '../../lib/container/Container';

describe('Function Injector', () => {
    it('should return new instance', () => {
        abstract class Base {
            protected pop: POP;
            constructor(pop: POP) {
                this.pop = pop;
            }
            print_name() {
                console.info('Base', Base.name);
            }
        }

        class POP {
            print() {
                console.info('[x]', POP.name);
            }
        }

        @InjectDependecy(LOL.name)
        class LOL {
            private pop: POP;
            constructor(pop: POP) {
                this.pop = pop;
            }
            print() {
                console.log('[x]', LOL.name);
                this.pop.print();
            }
        }

        @InjectDependecy(Test.name)
        class Test extends Base {
            private ARRAY: Array<number>;
            private lol: LOL;
            constructor(lol: LOL, pop: POP) {
                super(pop);
                this.lol = lol;
                this.ARRAY = [];
            }

            increment(num: number): void {
                this.ARRAY.push(num);
            }
            print() {
                console.log('[X] print', this.ARRAY.length);
                this.lol.print();
                this.pop.print();
            }
        }
        const newClass = handlerInstance.resolve<Test>(Test);
        const newClass2 = handlerInstance.resolve<Test>(Test);
        newClass.print();
        newClass2.increment(2);
        newClass2.print();

        expect(newClass).to.instanceof(Test);
    });

    it('should create new instance a each call get of container class', () => {
        const container = new ContainerMercury();

        interface I {
            print(): void;
        }

        @InjectDependecy(B.name)
        class B implements I {
            print(txt = '[B]') {
                console.log(txt, ' print');
            }
        }

        @InjectDependecy(A.name)
        class A implements I {
            private list: Array<number>;
            private b: B;

            constructor(b: B) {
                this.list = [];
                this.b = b;
            }

            print(): void {
                this.list.push(1);
                console.log('[A] print', this.list.length);
                this.b.print();
            }
        }

        container.bind('A').to(A);
        container.bind('B').to(B);

        const a = container.get<A>('A');
        const ax = container.get<A>('A');
        const b = container.get<B>('B');
        a.print();
        ax.print();

        b.print('[CB]');

        expect(a).to.instanceOf(A);
        expect(b).to.instanceOf(B);
    });
});
