import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiKeyMissingException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'X-Product-Key header is required',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ApiKeyInvalidException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Invalid API Key',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ProductInactiveException extends HttpException {
  constructor(productName: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
        message: `Product "${productName}" is inactive`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(serviceName: string) {
    super(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Unavailable',
        message: `Service "${serviceName}" is unavailable`,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(serviceName: string) {
    super(
      {
        statusCode: HttpStatus.GATEWAY_TIMEOUT,
        error: 'Gateway Timeout',
        message: `Service "${serviceName}" timed out`,
      },
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}
