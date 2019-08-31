![CircleCI](https://img.shields.io/circleci/build/github/cl3dson/mercury/master)
![Codacy coverage](https://img.shields.io/codacy/coverage/cb08ae5080fc4ca8ab6f29716361baec)
![Codacy grade](https://img.shields.io/codacy/grade/cb08ae5080fc4ca8ab6f29716361baec)
[![Npm][badgenpm]][npm]
[![Npm][npmdown]][npm]

# Mercury

Mercury is a tool for managing inter-service communication in distributed systems based in EDA (Event Driven Architecture).
Mercury is intended for systems that relies in message brokers for asynchronous messaging.All Broker based configuration
needed to process messages, like queues, topics, binds, listeners, handlers, retry are set up by Mercury under the hood
and decoupled from your application.Mercury main purpose is for developers use their times to write business logic rather
than messaging or broker specific code.

## How it works

Mercury uses the publish/subscribe pattern for deliver messages to the correct service.You application just need to
define the handlers functions for interested "events" or messages that occurs within the message ecosystem.

## Quick Example

Start Mercury, providing the broker configuration values in your index file:

```javascript
import Mercury from 'mercury-messenger';
import './testHandler';

let mercury = new Mercury('rabbitmq', 'localhost', 'user', 'password', 'testApp', 'testService');
mercury.init();
```

Now, define your own class with as many handlers are needed for your service:

```javascript
import { handler, JSONMessage } from 'mercury-messenger';

class testHandler {
    @handler('user-created', 30)
    handler1(msg) {
        console.log('A user has been created');

        // if a error occurs during execution, this message will be retried 30 times
        throw new Error('something gone wrong');
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

### Mercury Configuration

```javascript
let mercury = new Mercury(
    appName: string,
    brokerHostName: string,
    brokerUserName: string,
    brokerPassword: string,
    serviceName: string,
    retryDelay: number
);
```

-   AppName - A descriptor/name for your entire distributed system (only services defined with the same 'appName' communicate with each other)
-   serviceName - A descriptor/name for the current service
-   brokerType - Here we define the message broker used (only rabbitmq supported for now)
-   brokerAddress - Message broker address
-   brokerUser - message broker admin credentials
-   brokerPassword - message broker password por provided user
-   retryDelay (optional) - the default delay in seconds during retries (default 60)

### Mercury Initialization

```
mercury.init();
```

The init method start the process to configure broker with the provided configuration and
registering handlers as well.

### Handlers

Any function can become a messageHandler, just use @handler as decorator providing a message name/descriptor and optionally
a max number of retries for the handler.

#### Errors

If an error is thown inside a handler decorated function, the message will not be acknowledged in the message broker,and will be
retried some time later.

```javascript
    @handler('user-created', 30)
    handler1(msg) {
        console.log('A user has been created');

        // if a error occurs during execution, this message will be retried 30 times
        throw new Error('something gone wrong');
    }
```

The second parameter to @handler decorator is optional,it define how many times mercury will try to processs this message.If no
value, message will not be retried.Be careful with database logic or external services invocation here, Always find some way to
rollback or revert previous operations before handler finish if the operations aren't idempotent.
You can define the delay between retries in Mercury constructor.

#### Succeeded Handlers

If there is no errors during handler execution, then any Message or array of Messages returned by the handler function will be
published into the system messaging ecosystem and possibly consumed by others subscribers services.

```javascript
 @handler('order-created')
    handler2(msg) {
        console.log('Something has been ordered');

        let msgContent = msg.getContent();
        //your business rule ...

        //return a new message, or array of message if needed
        return new JSONMessage('product-purchased', { test: 'data' });
    }
```

### Publishers

You can define a no-reactive handler function that is intended to publish messages only.Just use the '@handler' decorator
without arguments:

```javascript
import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import {handler,JSONMessage} from "mercury-messenger";

@controller("/foo")
export class TestController implements interfaces.Controller {

    @httpPost("/")
    @handler()
    public async index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<JSONMessage> {
        res.status(201).send('user creation solicited');
        return new JSONMessage("create-user-command",{"name":"jonh"})
    }
}

```

In this case,function will not be called for any new message.but now you can control when invoke the function.In the example
above @handler decorator is chained with another decorator provided by 'inversify-express-utils' package to automatic routing.Any Messages
or Array of messages returned here will be published in the message bus.If the returned value is not a Message instance, then it's ignored.

## TODO

-   Exponential retry strategy with max retry using DLE (dead letter)
-   Register all messages received and published to external databases like MongoDB or Redis (event-store)
-   Implement some mechanism to ensure that the publishing of new messages happens only when some pre-registered conditions have
    been succeeded. (Like publishing the 'order-created' message only when client code commit the transaction to 'order-database' successfully)
-   Support to more message brokers like Redis, Apache ActiveMQ, Apache Kafka.

[npm]: https://www.npmjs.com/package/mercury-messenger
[badgenpm]: https://img.shields.io/npm/v/mercury-messenger
[npmdown]: https://img.shields.io/npm/dw/mercury-messenger
