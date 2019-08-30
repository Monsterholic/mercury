import 'reflect-metadata';
import Mercury, { BrokerType } from '../lib/index';
import './handler';

describe('connection', () => {
    test('throw error on connection failure', () => {
        const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'unused', 'unused', 'testApp', 'testService');
        expect(mercury.init()).rejects.toThrow();
    });

    describe('active connections', () => {
        let mercury;

        beforeEach(() => {
            mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'guest', 'guest', 'testApp', 'testService');
        });

        test('can connect to a real rabbit', async done => {
            await mercury.init();
            mercury.terminate();
            done();
        });
    });
});
