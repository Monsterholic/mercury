# Mercury

Mercury is a tool for managing inter-service comunication in distributed systems based in EDA(Event Driven Architecture)
writen in NodeJs.Mercury set-up all underling configurations of message broker, queues, exchanges, binds, topics, etc.
With Mercury your team can focus on writing more code related with your business and less
code related with messaging infra-structure.

## How it works

Mercury uses the publish/subscribe pattern for deliver messages to the correct services.You application just need to
define the handlers functions for interested "events" or messages that occurs within the system ecosystem.In adition,
if a handler returns a message object or an array of messages,all are published in the system ecosystem.

## Quick Example

Starting Mercury, passing the broker configuration values:

```javascript
import Mercury from 'mercury-messenger';
import './testeHandler';

let merc = new Mercury('rabbitmq', 'localhost', 'guest', 'guest', 'testApp', 'testService');
merc.init();
```

Now you can define you own class with as many handlers as needed:

```javascript
import handler from 'mercury-messenger/dist/decorator/HandlerDecorator';
import JSONMessage from 'mercury-messenger/dist/message/JSONMessage';

class testeHandler {
    @handler('used-created')
    handler1() {
        console.log('A user has been created');
        throw new Error('Erro teste');
    }

    @handler('order-created')
    handler2() {
        console.log('Something has been ordered');

        //your business rule ...

        //return a new message, or array of message if needed
        return new JSONMessage('coisaRegistrada', { teste: 'teste' });
    }
}
```
