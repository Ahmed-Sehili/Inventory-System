import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Catch()
@Injectable()
export class HttpFilterFilter implements ExceptionFilter {
  private readonly logger: LoggingService;

  constructor(logger: LoggingService) {
    this.logger = logger;
    this.logger.setContext('ExceptionFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Determine HTTP status code
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Get exception details
    const message = exception.message || 'Internal server error';
    const stack = exception.stack;
    const path = request.url;
    const method = request.method;
    
    // Log the exception with appropriate severity
    if (status >= 500) {
      this.logger.error(
        `[${method}] ${path} - ${status} - ${message}`,
        stack,
        'ExceptionFilter'
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${method}] ${path} - ${status} - ${message}`,
        'ExceptionFilter'
      );
    }
    
    // Create response body
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: path,
      method: method,
      message: message,
    };
    
    // Send response
    response.status(status).json(responseBody);
  }
}
