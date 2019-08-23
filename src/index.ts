import 'reflect-metadata';
import Mercury from './Mercury';
import './testeClass';

let mercury = new Mercury('rabbitmq', 'localhost', 'guest', 'guest', 'testApp', 'testService');

mercury.init();
