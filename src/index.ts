import 'reflect-metadata';
import Mercury from './Mercury';
import './testeClass';

export default class Index {
    public static main(): void {
        let mercury = new Mercury('rabbitmq');

        mercury.start('localhost', 'guest', 'guest', 'testeApp');
    }
}

Index.main();
