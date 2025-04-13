import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    
    // Log request start
    this.loggingService.log(`Request started: ${method} ${originalUrl} - ${ip}`, 'HTTP');
    
    // Add response listener to log when the request is complete
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      this.loggingService.logRequest(req, res, responseTime);
    });

    next();
  }
}
