// Error handling and logging utilities

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  stack?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private logLevel: LogLevel = LogLevel.INFO;
  private observers: ((log: LogEntry) => void)[] = [];

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public setMaxLogs(maxLogs: number): void {
    this.maxLogs = maxLogs;
    // Trim logs if necessary
    if (this.logs.length > maxLogs) {
      this.logs = this.logs.slice(-maxLogs);
    }
  }

  public subscribe(observer: (log: LogEntry) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(log: LogEntry): void {
    this.observers.forEach((observer) => {
      try {
        observer(log);
      } catch (error) {
        console.error('Error in log observer:', error);
      }
    });
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const timestamp = new Date().toISOString();
    const stack = error?.stack;

    return {
      timestamp,
      level,
      message,
      context,
      error,
      stack,
    };
  }

  private addLog(log: LogEntry): void {
    // Add log to array
    this.logs.push(log);

    // Trim logs if necessary
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify observers
    this.notifyObservers(log);

    // Output to console based on log level
    if (log.level >= this.logLevel) {
      this.outputToConsole(log);
    }
  }

  private outputToConsole(log: LogEntry): void {
    const { timestamp, level, message, context, error } = log;
    const logLevelName = LogLevel[level];
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` ${error.message}` : '';

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
        if (log.stack) {
          console.error(log.stack);
        }
        break;
      case LogLevel.FATAL:
        console.error(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
        if (log.stack) {
          console.error(log.stack);
        }
        break;
      default:
        console.log(`[${timestamp}] [${logLevelName}] ${message}${contextStr}${errorStr}`);
    }
  }

  public debug(message: string, context?: Record<string, any>): void {
    const log = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.addLog(log);
  }

  public info(message: string, context?: Record<string, any>): void {
    const log = this.createLogEntry(LogLevel.INFO, message, context);
    this.addLog(log);
  }

  public warn(message: string, context?: Record<string, any>, error?: Error): void {
    const log = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.addLog(log);
  }

  public error(message: string, context?: Record<string, any>, error?: Error): void {
    const log = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.addLog(log);
  }

  public fatal(message: string, context?: Record<string, any>, error?: Error): void {
    const log = this.createLogEntry(LogLevel.FATAL, message, context, error);
    this.addLog(log);
  }

  public getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;

    if (level !== undefined) {
      filteredLogs = this.logs.filter((log) => log.level >= level);
    }

    if (limit !== undefined) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public getErrorCount(): number {
    return this.logs.filter((log) => log.level >= LogLevel.ERROR).length;
  }

  public getRecentErrors(limit: number = 10): LogEntry[] {
    return this.logs.filter((log) => log.level >= LogLevel.ERROR).slice(-limit);
  }
}

// Singleton logger instance
export const logger = Logger.getInstance();

// Error handling utilities
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;
  public readonly timestamp: string;
  public readonly userId?: string;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, field?: string, value?: any) {
    super(message, 'VALIDATION_ERROR', 400, { field, value });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with ID ${id}` : ''} not found`, 'NOT_FOUND', 404, { resource, id });
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, conflictDetails?: Record<string, any>) {
    super(message, 'CONFLICT', 409, { conflictDetails });
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, query?: string, params?: any) {
    super(message, 'DATABASE_ERROR', 500, { query, params });
    this.name = 'DatabaseError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, url?: string, status?: number) {
    super(message, 'NETWORK_ERROR', 503, { url, status });
    this.name = 'NetworkError';
  }
}

// Error handling utilities
export const handleError = (error: Error, context?: Record<string, any>): AppError => {
  // If it's already an AppError, just log it
  if (error instanceof AppError) {
    logger.error(error.message, context, error);
    return error;
  }

  // Convert to AppError
  const appError = new AppError(error.message, 'UNKNOWN_ERROR', 500, {
    originalError: error.name,
    ...context,
  });

  logger.error(appError.message, appError.context, error);
  return appError;
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: ((metric: string, value: number) => void)[] = [];

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public subscribe(observer: (metric: string, value: number) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(metric: string, value: number): void {
    this.observers.forEach((observer) => {
      try {
        observer(metric, value);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  public recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);
    this.notifyObservers(name, value);

    // Log significant metrics
    if (name.includes('error') || name.includes('failure')) {
      logger.warn(`Performance metric: ${name} = ${value}`);
    } else if (value > 1000) {
      // Log slow operations
      logger.debug(`Performance metric: ${name} = ${value}ms`);
    }
  }

  public getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  public getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public clearMetrics(): void {
    this.metrics.clear();
  }

  public measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();

    return fn()
      .then((result) => {
        const duration = performance.now() - start;
        this.recordMetric(name, duration);
        return result;
      })
      .catch((error) => {
        const duration = performance.now() - start;
        this.recordMetric(`${name}_error`, duration);
        this.recordMetric(`${name}_failure`, 1);
        throw error;
      });
  }
}

// Singleton performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Observability utilities
export const createObservabilityHook = (componentName: string) => {
  return {
    logEvent: (event: string, data?: Record<string, any>) => {
      logger.info(`[${componentName}] ${event}`, {
        component: componentName,
        ...data,
      });
    },

    logError: (error: Error, context?: Record<string, any>) => {
      logger.error(
        `[${componentName}] ${error.message}`,
        {
          component: componentName,
          ...context,
        },
        error
      );
    },

    measurePerformance: async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
      return performanceMonitor.measureAsync(`${componentName}_${operation}`, fn);
    },

    trackMetric: (metric: string, value: number) => {
      performanceMonitor.recordMetric(`${componentName}_${metric}`, value);
    },
  };
};

// Initialize default log level based on environment
if (typeof window !== 'undefined') {
  // Browser environment
  if (process.env.NODE_ENV === 'development') {
    logger.setLogLevel(LogLevel.DEBUG);
  } else {
    logger.setLogLevel(LogLevel.INFO);
  }
} else {
  // Server environment
  logger.setLogLevel(LogLevel.INFO);
}
