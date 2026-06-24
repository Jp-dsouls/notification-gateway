"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayTimeoutException = exports.ServiceUnavailableException = exports.ProductInactiveException = exports.ApiKeyInvalidException = exports.ApiKeyMissingException = void 0;
const common_1 = require("@nestjs/common");
class ApiKeyMissingException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message: 'X-Product-Key header is required',
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.ApiKeyMissingException = ApiKeyMissingException;
class ApiKeyInvalidException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
            message: 'Invalid API Key',
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.ApiKeyInvalidException = ApiKeyInvalidException;
class ProductInactiveException extends common_1.HttpException {
    constructor(productName) {
        super({
            statusCode: common_1.HttpStatus.FORBIDDEN,
            error: 'Forbidden',
            message: `Product "${productName}" is inactive`,
        }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ProductInactiveException = ProductInactiveException;
class ServiceUnavailableException extends common_1.HttpException {
    constructor(serviceName) {
        super({
            statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Service Unavailable',
            message: `Service "${serviceName}" is unavailable`,
        }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends common_1.HttpException {
    constructor(serviceName) {
        super({
            statusCode: common_1.HttpStatus.GATEWAY_TIMEOUT,
            error: 'Gateway Timeout',
            message: `Service "${serviceName}" timed out`,
        }, common_1.HttpStatus.GATEWAY_TIMEOUT);
    }
}
exports.GatewayTimeoutException = GatewayTimeoutException;
//# sourceMappingURL=gateway.exceptions.js.map