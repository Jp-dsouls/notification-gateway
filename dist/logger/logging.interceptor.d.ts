import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly loggerService;
    constructor(loggerService: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
