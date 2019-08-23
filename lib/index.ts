import 'reflect-metadata';
import Mercury from './Mercury';
import JSONMessage from './message/JSONMessage';
import handler from './decorator/HandlerDecorator';

export const messageHandler = handler;
export const JsonMessage = JSONMessage;
export default Mercury;
