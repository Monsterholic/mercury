import 'mocha';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';

import Mercury, { JSONMessage, Message } from '../lib';
import { OrderController } from './OrderController.spec';
import { ResultingMessages } from '../lib/message/ResultingMessages';
import { OrderCreatedHandler, spyOrderCreatedHandler } from '../tests/OrderCreatedHandler.spec';
import { mercury } from './MercuryConnectionSuccessTest.spec';
import sinon = require('sinon');

const CREATE_ORDER_DATA = { product: 'blackBox', price: 200 };
const AWAIT_MESSAGE_TIME_MS = 500;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('Mercury Message Publishing', () => {
    const resultingMessages = new ResultingMessages();

    before(async () => {
        const orderCreatedHandler = new OrderCreatedHandler();
        mercury.useHandler(orderCreatedHandler);
    });

    it('Controller should have been created two messages to be published by mercury', async () => {
        const orderController = new OrderController();
        await orderController.createOrderCommand(CREATE_ORDER_DATA, resultingMessages);

        resultingMessages.should.be.a.instanceOf(ResultingMessages);
        for (const result of resultingMessages.messages) {
            result.should.be.a.instanceOf(JSONMessage);
        }
    });

    it('should consume message published by OrderController', done => {
        setTimeout(() => {
            try {
                spyOrderCreatedHandler.should.have.been.calledOnce;
                done();
            } catch (e) {
                done(e);
            }
        }, AWAIT_MESSAGE_TIME_MS);
    });

    it('consumed message should have same content published by OrderController', done => {
        setTimeout(() => {
            try {
                const CREATE_ORDER_MESSAGE = resultingMessages.messages[0];
                const ms = new JSONMessage(
                    CREATE_ORDER_MESSAGE.getDescriptor(),
                    Buffer.from(CREATE_ORDER_MESSAGE.getSerializedContent()),
                    CREATE_ORDER_MESSAGE.getUUID(),
                    CREATE_ORDER_MESSAGE.getCreationDate().getTime(),
                    CREATE_ORDER_MESSAGE.getParentMessage(),
                );

                spyOrderCreatedHandler.should.have.been.calledOnceWith(sinon.match(ms));
                done();
            } catch (e) {
                done(e);
            }
        }, AWAIT_MESSAGE_TIME_MS);
    });
});
