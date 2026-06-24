import { HttpException } from '@nestjs/common';
export declare class ApiKeyMissingException extends HttpException {
    constructor();
}
export declare class ApiKeyInvalidException extends HttpException {
    constructor();
}
export declare class ProductInactiveException extends HttpException {
    constructor(productName: string);
}
export declare class ServiceUnavailableException extends HttpException {
    constructor(serviceName: string);
}
export declare class GatewayTimeoutException extends HttpException {
    constructor(serviceName: string);
}
