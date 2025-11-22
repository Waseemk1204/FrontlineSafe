import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const correlationId = request.headers['x-correlation-id'] || uuidv4();

    // Attach correlation ID to request for use in controllers/services
    request.correlationId = correlationId;

    const startTime = Date.now();

    this.logger.log(
      {
        method,
        url,
        body: this.sanitizeBody(body),
        query,
        params,
      },
      'HTTP Request',
      correlationId,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            {
              method,
              url,
              statusCode: context.switchToHttp().getResponse().statusCode,
              duration: `${duration}ms`,
            },
            'HTTP Response',
            correlationId,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            {
              method,
              url,
              error: error.message,
              stack: error.stack,
              duration: `${duration}ms`,
            },
            error.stack,
            'HTTP Error',
            correlationId,
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    if (sanitized.password) sanitized.password = '[REDACTED]';
    if (sanitized.token) sanitized.token = '[REDACTED]';
    return sanitized;
  }
}

