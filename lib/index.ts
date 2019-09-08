import 'reflect-metadata';
import handler from './decorator/HandlerDecorator';
import JSONMessage from './message/JSONMessage';
import Message from './message/Message';
import Mercury, { BrokerType } from './Mercury';

export default Mercury;
export { handler, Message, JSONMessage, BrokerType };
