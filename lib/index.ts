import 'reflect-metadata';
import MessageHandler from './decorator/MessageHandler';
import JSONMessage from './message/JSONMessage';
import Message from './message/Message';
import Mercury, { BrokerType } from './Mercury';
import Publisher from './decorator/Publisher';

export default Mercury;
export { MessageHandler, Message, JSONMessage, BrokerType, Publisher };
