import Mercury, { handler, JSONMessage, BrokerType } from '../lib/index';

const mock = jest.fn();

class TestHandler {
    @handler('user-created')
    public created(message): void {
        const content = message.getContent();
        mock(content);
    }

    @handler()
    public publish(message): JSONMessage {
        return new JSONMessage('user-created', JSON.stringify(message));
    }
}

describe('connection', () => {
    test('throw error on connection failure', () => {
        const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'unused', 'unused', 'testApp', 'testService');
        expect(mercury.init()).rejects.toThrow();
    });

    describe('active connections', () => {
        const testObject = { message: 'User sucessfully created', amount: 5 };
        const handler = new TestHandler();
        let mercury;

        beforeAll(() => {
            mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'guest', 'guest', 'testApp', 'testService');

            return mercury.init();
        });

        afterAll(() => mercury.terminate());

        test('can send message', () => {
            handler.publish(testObject);
        });

        test('can consume message', () => {
            setTimeout(() => {
                expect(mock).toHaveBeenCalledWith(testObject);
            }, 1000);
        });
    });
});
