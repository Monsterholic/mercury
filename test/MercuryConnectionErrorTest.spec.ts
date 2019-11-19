import 'mocha';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

import Mercury from '../lib';

const AWAIT_MESSAGE_TIME_MS = 500;
const AWAIT_END_TIME_MS = 1000;
const CREATE_ORDER_COMMAND_DATA = { product: 'blackBox', price: 200 };

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('Connection error', () => {
    it('Mercury init should Reject when connection fails', async () => {
        const mercury = new Mercury('RABBITMQ', 'localhost', 'fake', 'fake', 'testApp', 'testService');

        await mercury.init().should.eventually.be.rejected;
    });
});
