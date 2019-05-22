export default abstract class AbstractError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AbstractError.prototype);
    }

    sayHello() {
        return 'hello ' + this.message;
    }
}
