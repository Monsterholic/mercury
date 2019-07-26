import {Connection} from "amqplib";

export default interface IConnectionManager {
    isConnected():boolean
    connect(...args:any[]):Promise<void>
}

