import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Injectable()
export class LoggingService {
  private readonly logDir = 'logs';
  private readonly logFile: string;
  private readonly errorLogFile: string;
  private readonly accessLogFile: string;
  private context: string = 'Application';

  constructor() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.logFile = path.join(this.logDir, `app-${date}.log`);
    this.errorLogFile = path.join(this.logDir, `error-${date}.log`);
    this.accessLogFile = path.join(this.logDir, `access-${date}.log`);
  }

  /**
   * Format log message with timestamp, level, and context
   */
  private formatLogMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    return `${timestamp} ${level} ${contextStr}${message}`;
  }

  /**
   * Write log to file
   */
  private writeToFile(filePath: string, message: string): void {
    try {
      fs.appendFileSync(filePath, message + '\n');
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage(LogLevel.DEBUG, message, context);
    console.debug(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  /**
   * Log info message
   */
  log(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage(LogLevel.INFO, message, context);
    console.log(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string): void {
    const formattedMessage = this.formatLogMessage(LogLevel.WARN, message, context);
    console.warn(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  /**
   * Log error message
   */
  /**
   * Set the context for all subsequent log messages
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Get the current context
   */
  getContext(): string {
    return this.context;
  }

  error(message: string, trace?: string, context?: string): void {
    const formattedMessage = this.formatLogMessage(LogLevel.ERROR, message, context);
    const fullMessage = trace ? `${formattedMessage}\n${trace}` : formattedMessage;
    
    console.error(formattedMessage);
    if (trace) console.error(trace);
    
    this.writeToFile(this.logFile, fullMessage);
    this.writeToFile(this.errorLogFile, fullMessage);
  }

  /**
   * Log HTTP request
   */
  logRequest(req: any, res: any, responseTime: number): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const { statusCode } = res;
    
    const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${ip} - ${userAgent}`;
    const formattedMessage = this.formatLogMessage(LogLevel.INFO, message, 'HTTP');
    
    this.writeToFile(this.accessLogFile, formattedMessage);
    
    // Also log errors to error log
    if (statusCode >= 400) {
      this.writeToFile(this.errorLogFile, formattedMessage);
    }
  }
}
