import Mercury, { handler, JSONMessage, BrokerType } from '../lib/index';
import { expect, assert } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

// A little hacky thing, we must be able to expect on value to assure that the message
// was send correctly
const spy = sinon.spy();

const testObject = { message: 'User sucessfully created', amount: 5 };

class TestHandler {
    @handler('user-created')
    public created(message: JSONMessage): void {
        const content = message.getContent();
        spy(content);
    }

    @handler()
    public publish(message: object): JSONMessage {
        return new JSONMessage('user-created', JSON.stringify(message));
    }
}

describe('connection', () => {
    it('should throw an exception on connection failure', async () => {
        const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'unused', 'unused', 'testApp', 'testService');
        try {
            await mercury.init();
        } catch (e) {
            assert.instanceOf(e, Error);
        } finally {
            mercury.terminate();
        }
    });

    it('should connect to rabbitmq broker', async () => {
        const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'guest', 'guest', 'testApp', 'testService');

        let connected: boolean;

        try {
            await mercury.init();
            connected = true;
        } catch (e) {
            connected = false;
        } finally {
            expect(connected).to.be.ok;
            mercury.terminate();
        }
    });
});

describe('message', () => {
    const handler = new TestHandler();
    let mercury: Mercury;

    before(() => {
        mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'guest', 'guest', 'testApp', 'testService');

        return mercury.init();
    });

    after(() => mercury.terminate());

    it('can send message', () => {
        handler.publish(testObject);
    });

    it('can consume message', done => {
        setTimeout(() => {
            expect(spy.withArgs(testObject).calledOnce).to.be.true;
            done();
        }, 10);
    });
});
