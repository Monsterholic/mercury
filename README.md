![CircleCI](https://img.shields.io/circleci/build/github/Monsterholic/mercury/master)
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

### Message Consumers

To begin consuming messages, Start Mercury, providing the broker configuration values in your index file:

```typescript
import Mercury,{ Container } from 'mercury-messenger';
import './testHandler';

let mercury = new Mercury('RABBITMQ', 'localhost', 'user', 'password', 'testApp', 'testService');

mercury.init();
```

create class handlers for the corresponding event/message

```typescript
import { MessageHandler, Handler, JSONMessage } from 'mercury-messenger';

@MessageHandler('user-created')
class UserCreatedHandler implements Handler {
    handle(msg) {
        console.log('A user has been created');

        // if a error occurs during execution, this message will be retried
        throw new Error('something gone wrong');
    }
}

@MessageHandler('order-created')
class OrderCreatedHandler implements Handler {
    handle(msg) {
        console.log('Something has been ordered');

        let msgContent = msg.getContent();

        /*your business rule (service call, database operations, etc ...)*/

        return new JSONMessage('product-purchased', { test: 'data' });
    }
}
```

And finnaly register handlerClasses in Mercury instance and init mercury after that:

```typescript

const container = new Container()

container.bind("BIND1").to(OrderCreatedHandler)
container.bind("BIND2").to(UserCreatedHandler)

mercury.setContainer(container)

mercury.init();
```

Now, messages published in the broker by Mercury are correctly routed and consumed by subscribed applications.

### Message Producers

To publish messages just use @MessagePublisher decorator in any method,return a new Mercury message in it and it's done.

```typescript
import { MessagePublisher, JSONMessage } from 'mercury-message';

export class OrderController {
    @MessagePublisher()
    public async createOrderCommand(request){
        await newOrder = orderDatabaseService.save(request.data)
        return new JSONMessage('order-created', newOrder)
    }
}
```

### Mercury Configuration

You must provide some information regarding broker credentials and names for your service

```typescript
let mercury = new Mercury(applicationName, brokerHostName, brokerUserName, brokerPassword, serviceName, retryDelay);
```

List of mercury constructor parameters:

|                       | type   | description                                                                                                                      |
| --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| applicationName       | string | A descriptor/name for your entire distributed system (only services defined with the same 'appName' communicate with each other) |
| serviceName           | string | A descriptor/name for the current service                                                                                        |
| brokerType            | string | Here we define the message broker used (only rabbitmq supported for now)                                                         |
| brokerAddress         | string | Message broker address                                                                                                           |
| brokerUser            | string | message broker admin credentials                                                                                                 |
| brokerPassword        | string | message broker password por provided user                                                                                        |
| retryDelay (optional) | number | the default delay in seconds during retries (default 60)                                                                         |

### Mercury Initialization

```typescript
mercury.init();
```

The init() method start the process to configure broker with the provided configuration and
registering handlers as well.It's important to call this method only when all Mercury configuration is done
(please be aware that handlers instances must be added to Mercury before using the userHandler() method)

### Message Handlers

Mercury needs MessageHandlers to work, message handlers are special classes that provide information about what
events or messages the application is interested and provide the logic to run when some message occur in the broker.
Use class decorator @MessageHandler and implements the Handler class to define proper messageHandlers compatible with Mercury.
Implementing Handler class implies the implementation of the handle() method in your class.
Register message handlers instances using the userHandler() method prior to Mercury initialization.

#### Errors

If an error is thown during the message handling, the message will not be acknowledged in the message broker,and will be
retried some time later.

```typescript
@MessageHandler('user-created')
class UserCreatedHandler implements Handler {
    handle(msg) {
        console.log('A user has been created');

        // if a error occurs during execution, this message will be retried
        throw new Error('something gone wrong');
    }
}
```

Be careful with database logic or external services invocation here, Always find some way to
rollback or revert previous operations before handler finish if the operations aren't idempotent.
You can define the delay between retries in Mercury constructor.

#### Succeeded Handlers

If there is no errors during handler execution, then any Message or array of Messages returned by the handler function will be
published into the system messaging ecosystem and possibly consumed by others subscribers services.

```typescript
@MessageHandler('order-created')
class OrderCreatedHandler implements Handler {
    handle(msg) {
        console.log('Something has been ordered');

        let msgContent = msg.getContent();

        /*your business rule (service call, database operations, etc ...)*/

        return new JSONMessage('product-purchased', { test: 'data' });
    }
}
```

### Publishers

Message publish are intended to only procuce new Mercury messages and publish then into the broker.
To publish messages to the broker Just use the '@MessagePublisher' decorator and return a new message:

```typescript
import { MessagePublisher, JSONMessage } from 'mercury-message';

export class OrderController {
    @MessagePublisher()
    public async createOrderCommand(request){
        await newOrder = orderDatabaseService.save(request.data)
        return new JSONMessage('order-created', newOrder)
    }
}
```

## TODO

-   Exponential retry strategy with max retry using DLE (dead letter)

-   Register all messages received and published to external databases like MongoDB or Redis (event-store)

-   Implement some mechanism to ensure that the publishing of new messages happens only when some pre-registered conditions have
    been succeeded. (Like publishing the 'order-created' message only when client code commit the transaction to 'order-database' successfully)

-   Support to more message brokers like Redis, Apache ActiveMQ, Apache Kafka.

[npm]: https://www.npmjs.com/package/mercury-messenger
[badgenpm]: https://img.shields.io/npm/v/mercury-messenger
[npmdown]: https://img.shields.io/npm/dw/mercury-messenger
