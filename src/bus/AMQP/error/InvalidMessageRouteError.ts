import AbstractError from '../../../common/abstract/AbstractError';

export default class InvalidMessageRouteError extends AbstractError {
    private static readonly ERROR_MESSAGE = 'Invalid route to publish message';

    constructor() {
        super(InvalidMessageRouteError.ERROR_MESSAGE);
    }
}
