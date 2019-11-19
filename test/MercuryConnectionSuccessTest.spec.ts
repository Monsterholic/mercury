import 'mocha';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

import Mercury from '../lib';

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

export const mercury = new Mercury('RABBITMQ', 'localhost', 'guest', 'guest', 'testApp', 'testService');

describe('Connection Success', () => {
    it('Mercury should result a fulfilled promise when connection succeeds', async () => {
        await mercury.init().should.eventually.be.fulfilled;
    });
});
