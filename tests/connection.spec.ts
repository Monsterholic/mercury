import Mercury, { JSONMessage } from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import UserController from './UserController.spec';
import OrderControllerSpec from './OrderController.spec';

import OrderCreatedHandler from './OrderCreatedHandler.spec';
import OrderSucceededHandler from './OrderSucceededHandler.spec';
import UserCreatedHandler, { spyUserCreatedMessage } from './UserCreatedHandler.spec';
import Message from '../lib/message/Message';

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
            mercury.useHandler(userCreatedHandler);

            await mercury.init().should.eventually.be.fulfilled;

            describe('messaging testes', () => {
                const userController = new UserController();
                const result = userController.createUserCommand(createUserCommandData);

                describe('UserControler', () => {
                    it('createUserCommand from UserControler return JSONMessage', () => {
                        result.should.be.a.instanceOf(JSONMessage);
                    });

                    it('message returned from createUserCommand has correct Content', () => {
                        result.getContent().should.be.deep.eq(createUserCommandData);
                    });

                    it("message returned from createUserCommand has the correct descriptor ('user-created')", () => {
                        result.getDescriptor().should.be.equals('user-created');
                    });

                    it('message returned from createUserCommand has an uuid', () => {
                        result.getUUID().should.be.a('string');
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

                    it('should consumed message has same content published by user Controller', done => {
                        setTimeout(() => {
                            try {
                                spyUserCreatedMessage.args[0][0]
                                    .getContent()
                                    .should.have.be.deep.equals(result.getContent());
                                done();
                            } catch (e) {
                                done(e);
                            }
                        }, AWAIT_MESSAGE_TIME_MS);
                    });
                });

                it('should finish connection', done => {
                    setTimeout(() => {
                        mercury.terminate().should.eventually.be.fulfilled;
                        done();
                    }, AWAIT_END_TIME_MS);
                });
            });
        });
    });

    // describe('Connection', () => {
    //     it('should connect to rabbitmq broker', async () => {
    //         const mercury = new Mercury(
    //             "RABBITMQ",
    //             'localhost',
    //             'guest',
    //             'guest',
    //             'testApp',
    //             'testService');
    //
    //         //instantiating message handlers
    //         const orderCreatedHandler = new OrderCreatedHandler();
    //         const orderSucceededHandler = new OrderSucceededHandler();
    //         const userCreatedHandler = new UserCreatedHandler();
    //
    //         //registering message handlers
    //         mercury.useHandler(orderCreatedHandler);
    //         mercury.useHandler(orderSucceededHandler);
    //         mercury.useHandler(userCreatedHandler);
    //
    //         const initialized = await mercury.init();
    //         chai.expect(initialized).to.be.true;
    //
    //         describe('messaging tests', () => {
    //             after(() => {
    //                 mercury.terminate()
    //             });
    //
    //             it('can publish user created message from user controller',() => {
    //                 const userController = new UserController();
    //                 userController.createUserCommand(createUserCommandData)
    //             })
    //
    //
    //
    //             // it('can publish order created and order succeeded message', () => {
    //             //     const orderController = new OrderControllerSpec()
    //             //     orderController.createOrderCommand(createOrderComandData)
    //             // });
    //             //
    //             // it('can consume user created message ', () => {
    //             //     setTimeout(() => {
    //             //         spyUserCreatedMessage.should.have.been.calledOnceWith(createUserCommandData);
    //             //     }, AWAIT_MESSAGE_TIME_MS);
    //             // });
    //             //
    //             // it('can consume order created message ', () => {
    //             //     setTimeout(() => {
    //             //         spyOrderCreatedMessage.should.have.been.calledOnceWith(createOrderComandData);
    //             //     }, AWAIT_MESSAGE_TIME_MS);
    //             // });
    //             //
    //             // it('can consume order succeeded message ', () => {
    //             //     setTimeout(() => {
    //             //         spyOrderSucceededMessage.should.have.been.calledOnceWith(createOrderComandData);
    //             //     }, AWAIT_MESSAGE_TIME_MS);
    //             // });
    //
    //         });
    //     });
    // });
});
