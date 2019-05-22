import AbstractError from '../../../common/abstract/AbstractError';

export default class InvalidMessageRouteError extends AbstractError {
    private static readonly ERROR_MESSAGE = 'Route is invalid';

    constructor() {
        super(InvalidMessageRouteError.ERROR_MESSAGE);
    }
}
