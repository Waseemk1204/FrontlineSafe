import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: any, context?: string, correlationId?: string) {
    const logEntry: any = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context: context || this.context,
    };

    if (correlationId) {
      logEntry.correlationId = correlationId;
    }

    if (typeof message === 'object' && message !== null) {
      Object.assign(logEntry, message);
    }

    return JSON.stringify(logEntry);
  }

  log(message: any, context?: string, correlationId?: string) {
    console.log(this.formatMessage('LOG', message, context, correlationId));
  }

  error(message: any, trace?: string, context?: string, correlationId?: string) {
    const errorLog = this.formatMessage('ERROR', message, context, correlationId);
    if (trace) {
      console.error(errorLog, trace);
    } else {
      console.error(errorLog);
    }
  }

  warn(message: any, context?: string, correlationId?: string) {
    console.warn(this.formatMessage('WARN', message, context, correlationId));
  }

  debug(message: any, context?: string, correlationId?: string) {
    console.debug(this.formatMessage('DEBUG', message, context, correlationId));
  }

  verbose(message: any, context?: string, correlationId?: string) {
    console.log(this.formatMessage('VERBOSE', message, context, correlationId));
  }

  generateCorrelationId(): string {
    return uuidv4();
  }
}

