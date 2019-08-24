![CircleCI](https://img.shields.io/circleci/build/github/cl3dson/mercury/master)
![npm](https://img.shields.io/npm/v/mercury-messenger)
![npm](https://img.shields.io/npm/dw/mercury-messenger)

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

let merc = new Mercury('rabbitmq', 'localhost', 'user', 'password', 'testApp', 'testService');
merc.init();
```

### Parameters

-   brokerType - Here we define the message broker used (only supports rabbitmq for now)
-   brokerAddress - Message broker address
-   brokerUser - message broker admin credentials
-   brokerPassword - message broker password por provided user
-   ApplicationId - A descriptor for your entire distributed system (only services defined with the same 'app id' communicate with each other)
-   ServiceId - A descriptor for the current service

## Handler classes

Now you can define you own class with as many handlers as needed,Just use the 'handler' decorator do subscribe to new messages.
When the intended message appear in the system's message ecosystem, the handler function will be called.

```javascript
import handler from 'mercury-messenger/dist/decorator/HandlerDecorator';
import JSONMessage from 'mercury-messenger/dist/message/JSONMessage';

class testeHandler {
    @handler('used-created')
    handler1(msg) {
        console.log('A user has been created');
        throw new Error('somethin gone wrong');
    }

    @handler('order-created')
    handler2(msg) {
        console.log('Something has been ordered');

        let msgContent = msg.getContent();
        //your business rule ...

        //return a new message, or array of message if needed
        return new JSONMessage('product-purchased', { test: 'data' });
    }
}
```

If an error is thown inside a handler decorated function, the message will not be acknowledged in the message broker,and will be
retried some time later.In future implementations will be possible to set the number of retries and the delay time.

If there is no errors during handler execution, then any Message or array of Messages returned by the handler function will be
published into the main message bus for possible use by others services.

## TODO

-   Exponential retry strategy with max retry using DLE (dead letter)
-   Register all messages received and published to external databases like MongoDB or Redis (event-store)
-   Implement some mechanism to ensure that the publishing of new messages happens only when some pre-registered conditions have
    been succeeded. (Like publishing the 'order-created' message only when client code commit the transaction to 'order-database' successfully)
-   Support to more message brokers like Redis, Apache ActiveMQ, Apache Kafka.
