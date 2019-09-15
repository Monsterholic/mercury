import Mercury, { JSONMessage } from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import UserController from './UserController.spec';

import UserCreatedHandler, { spyUserCreatedMessage } from './UserCreatedHandler.spec';
import OrderCreatedHandler, { spyOrderCreatedHandler } from './OrderCreatedHandler.spec';
import OrderSucceededHandler, { spyOrderSucceededHandler } from './OrderSucceededHandler.spec';

import Message from '../lib/message/Message';
import OrderController from './OrderController.spec';

const AWAIT_MESSAGE_TIME_MS = 500;
const AWAIT_END_TIME_MS = 1000;
const createUserCommandData = { name: 'cl3dson', age: 25 };
const createOrderComandData = { product: 'blackBox', price: 200 };

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('Broker Connection', () => {
    describe('Connection Error', () => {
        it('init() promise should be rejected on connection failure', async () => {
            const mercury = new Mercury('RABBITMQ', 'localhost', 'unused', 'unused', 'testApp', 'testService');
            try {
                mercury.init().should.eventually.be.rejected;
            } catch (e) {
                await mercury.terminate();
            }
        });
    });
    describe('connection success', () => {
        it('init() promise should be fulfilled on connection success', async () => {
            const mercury = new Mercury('RABBITMQ', 'localhost', 'guest', 'guest', 'testApp', 'testService');

            const userCreatedHandler = new UserCreatedHandler();
            const orderCreatedHandler = new OrderCreatedHandler();
            const orderSucceededHandler = new OrderSucceededHandler();

            mercury.useHandler(userCreatedHandler);
            mercury.useHandler(orderCreatedHandler);
            mercury.useHandler(orderSucceededHandler);

            await mercury.init().should.eventually.be.fulfilled;

            describe('messaging testes', () => {
                const userController = new UserController();
                const userResult = userController.createUserCommand(createUserCommandData);

                const orderController = new OrderController();
                const orderResult = orderController.createOrderCommand(createOrderComandData);

                describe('UserControler', () => {
                    it('createUserCommand from UserControler return JSONMessage', () => {
                        userResult.should.be.a.instanceOf(JSONMessage);
                    });

                    it('message returned from createUserCommand has correct Content', () => {
                        userResult.getContent().should.be.deep.eq(createUserCommandData);
                    });

                    it("message returned from createUserCommand has the correct descriptor ('user-created')", () => {
                        userResult.getDescriptor().should.be.equals('user-created');
                    });

                    it('message returned from createUserCommand has an uuid', () => {
                        userResult.getUUID().should.be.a('string');
                    });
                });

                describe('UserCreatedHandler', () => {
                    it('should consume message published by UserController', done => {
                        setTimeout(() => {
                            try {
                                spyUserCreatedMessage.should.have.been.calledOnce;
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });

                    it('should consumed message has same content published by UserController', done => {
                        setTimeout(() => {
                            try {
                                spyUserCreatedMessage.args[0][0]
                                    .getContent()
                                    .should.be.deep.equals(userResult.getContent());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });

                    it('should consumed message has same descriptor published by UserController', done => {
                        setTimeout(() => {
                            try {
                                spyUserCreatedMessage.args[0][0]
                                    .getDescriptor()
                                    .should.be.equals(userResult.getDescriptor());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });
                });

                describe('OrderController', () => {
                    it('createOrderCommand from OrderController returns an array of messages', () => {
                        orderResult.should.be.a('array');
                        if (Array.isArray(orderResult)) {
                            for (let result of orderResult) {
                                result.should.be.a.instanceOf(JSONMessage);
                            }
                        }
                    });
                });

                describe('OrderCreatedHandler', () => {
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
                                spyOrderCreatedHandler.args[0][0]
                                    .getContent()
                                    .should.be.deep.equals(orderResult[0].getContent());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });

                    it("consumed message should have same descriptor published by OrderController ('order-created')", done => {
                        setTimeout(() => {
                            try {
                                spyOrderCreatedHandler.args[0][0]
                                    .getDescriptor()
                                    .should.be.equals(orderResult[0].getDescriptor());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });
                });

                describe('OrderSucceededHandler', () => {
                    it('should consume message published by OrderController', done => {
                        setTimeout(() => {
                            try {
                                spyOrderSucceededHandler.should.have.been.calledOnce;
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });

                    it('consumed message should have same content published by OrderController', done => {
                        setTimeout(() => {
                            try {
                                spyOrderSucceededHandler.args[0][0]
                                    .getContent()
                                    .should.be.deep.equals(orderResult[1].getContent());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });

                    it("consumed message should have same descriptor published by OrderController ('order-succeeded')", done => {
                        setTimeout(() => {
                            try {
                                spyOrderSucceededHandler.args[0][0]
                                    .getDescriptor()
                                    .should.be.equals(orderResult[1].getDescriptor());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });
                });

                describe('Connection', () => {
                    it('should finish connection', done => {
                        setTimeout(() => {
                            mercury.terminate().should.eventually.be.fulfilled;
                            done();
                        }, AWAIT_END_TIME_MS);
                    });
                });
            });
        });
    });
});
