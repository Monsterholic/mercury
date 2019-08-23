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
let mercury = new Mercury('rabbitmq');
mercury.start('localhost', 'guest', 'guest', 'testApp', 'testService');



```
