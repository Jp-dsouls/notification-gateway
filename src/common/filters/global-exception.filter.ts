import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';
import { LoggerService } from '../../logger/logger.service';

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
  correlationId: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request as Request & { correlationId?: string }).correlationId ||
      (request.headers[CORRELATION_ID_HEADER] as string) ||
      'N/A';

    let statusCode: number;
    let error: string;
    let message: string | string[];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      error = this.getErrorName(statusCode);

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string | string[]) || exception.message;
        error = (resp.error as string) || error;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      message = 'An unexpected error occurred';
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${statusCode}: ${JSON.stringify(message)}`,
      undefined,
      correlationId,
    );

    response.status(statusCode).json(errorResponse);
  }

  private getErrorName(statusCode: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };

    return errorNames[statusCode] || 'Error';
  }
}
