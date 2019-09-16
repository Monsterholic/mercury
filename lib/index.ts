import 'reflect-metadata';
import { MessageHandler } from './decorator/MessageHandler';
import { JSONMessage } from './message/JSONMessage';
import { Message } from './message/Message';
import { Mercury, BrokerType } from './Mercury';
import { MessagePublisher } from './decorator/MessagePublisher';
import { Handler } from './handler/Handler';

export default Mercury;
export { MessageHandler, Message, JSONMessage, BrokerType, MessagePublisher, Handler };
