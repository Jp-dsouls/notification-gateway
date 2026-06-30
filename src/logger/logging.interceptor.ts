import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = request.headers[CORRELATION_ID_HEADER] as string;
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    this.loggerService.setContext(`${className}.${methodName}`);

    this.loggerService.log(
      `${request.method} ${request.url}`,
      correlationId,
    );

    return next.handle();
  }
}
