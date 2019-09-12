import 'reflect-metadata';
import handlHandlerDecoratorer from './decorator/HandlerClassDecorator';
import JSONMessage from './message/JSONMessage';
import Message from './message/Message';
import Mercury, { BrokerType } from './Mercury';

export default Mercury;
export { handlHandlerDecoratorer, Message, JSONMessage, BrokerType };
