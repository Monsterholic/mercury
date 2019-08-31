import 'reflect-metadata';
import Mercury from './Mercury';
import handler from './decorator/HandlerDecorator';
import JSONMessage from './message/JSONMessage';
import Message from './message/Message';
import { BrokerType } from './Mercury';

export default Mercury;
export { handler, Message, JSONMessage, BrokerType };
