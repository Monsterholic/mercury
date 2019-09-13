import Mercury, { handler, JSONMessage, BrokerType } from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

const AWAIT_MESSAGE_TIME_MS = 500;
const AWAIT_END_TIME_MS = 1000;

chai.should();
chai.use(sinonChai);

// A little hacky thing, we must be able to expect on value to assure that the message
// was send correctly
const spyUserCreatedMessage = sinon.spy();
const spyOrderCreatedMessage = sinon.spy();
const spyOrderSucceededMessage = sinon.spy();

const createUserCommand = { name: 'cl3dson', age: 25 };
const createOrderComand = { product: 'blackBox', price: 200 };

// class TestHandler {
//     //handlers
//     @handler('user-created')
//     public userCreated(message: JSONMessage): void {
//         const content = message.getContent();
//         spyUserCreatedMessage(content);
//     }

//     @handler('order-created')
//     public orderCreated(message: JSONMessage): void {
//         const content = message.getContent();
//         spyOrderCreatedMessage(content);
//     }

//     @handler('order-succeeded')
//     public orderSucceeded(message: JSONMessage): void {
//         const content = message.getContent();
//         spyOrderSucceededMessage(content);
//     }
//     //publishers
//     @handler()
//     public createUserCommand(message: object): JSONMessage {
//         return new JSONMessage('user-created', message);
//     }

//     @handler()
//     public createOrderCommand(message: object): JSONMessage[] {
//         return [new JSONMessage('order-created', message), new JSONMessage('order-succeeded', message)];
//     }
// }

describe('Broker Connection', () => {
    describe('Connection Error', () => {
        it('should throw an exception on connection failure', async () => {
            const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'unused', 'unused', 'testApp', 'testService');
            try {
                await mercury.init();
                await mercury.terminate();
            } catch (e) {
                chai.assert.instanceOf(e, Error);
                await mercury.terminate();
            }
        });
    });
    describe('Connection', () => {
        it('should connect to rabbitmq broker', async () => {
            const mercury = new Mercury(BrokerType.RABBITMQ, 'localhost', 'guest', 'guest', 'testApp', 'testService');
            const initialized = await mercury.init();
            chai.expect(initialized).to.be.true;

            describe('messaging tests', () => {
                after(() => mercury.terminate());
                // const handler = new TestHandler();

                // it('can publish user created message', () => {
                //     handler.createUserCommand(createUserCommand);
                // });

                // it('can publish order created and order succeeded message', () => {
                //     handler.createOrderCommand(createOrderComand);
                // });

                // it('can consume user created message ', () => {
                //     setTimeout(() => {
                //         spyUserCreatedMessage.should.have.been.calledOnceWith(createUserCommand);
                //     }, AWAIT_MESSAGE_TIME_MS);
                // });

                // it('can consume order created message ', () => {
                //     setTimeout(() => {
                //         spyOrderCreatedMessage.should.have.been.calledOnceWith(createOrderComand);
                //     }, AWAIT_MESSAGE_TIME_MS);
                // });

                // it('can consume order succeeded message ', () => {
                //     setTimeout(() => {
                //         spyOrderSucceededMessage.should.have.been.calledOnceWith(createOrderComand);
                //     }, AWAIT_MESSAGE_TIME_MS);
                // });

                it('should terminate broker connection', done => {
                    setTimeout(() => {
                        done();
                    }, AWAIT_END_TIME_MS);
                });
            });
        });
    });
});
