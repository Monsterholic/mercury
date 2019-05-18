export class IllegalOperationError {
    constructor(msg: any, stack: any);
    message: any;
    stack: any;
    stackAtStateChange: any;
}
export function connect(url: any, connOptions: any): any;
export namespace credentials {
    function amqplain(user: any, passwd: any): any;
    function external(): any;
    function plain(user: any, passwd: any): any;
}
