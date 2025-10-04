import {
  AppError,
  ConflictError,
  createObservabilityHook,
  DatabaseError,
  ForbiddenError,
  handleError,
  logger,
  LogLevel,
  NetworkError,
  NotFoundError,
  performanceMonitor,
  UnauthorizedError,
  ValidationError,
} from '@/lib/error-handler';

// Mock console methods to avoid output during tests
const originalConsole = { ...console };
const mockConsole = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

describe('Logger', () => {
  beforeEach(() => {
    // Clear all logs and reset console
    logger.clearLogs();
    Object.assign(console, mockConsole);
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console
    Object.assign(console, originalConsole);
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const logger1 = logger;
      const logger2 = logger;
      expect(logger1).toBe(logger2);
    });
  });

  describe('Log Levels', () => {
    it('should set and get log level', () => {
      logger.setLogLevel(LogLevel.WARN);
      // We can't directly access the private logLevel, but we can test behavior
      logger.debug('Debug message');
      expect(mockConsole.debug).not.toHaveBeenCalled();

      logger.warn('Warning message');
      expect(mockConsole.warn).toHaveBeenCalled();
    });

    it('should filter logs based on log level', () => {
      logger.setLogLevel(LogLevel.ERROR);

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });
  });

  describe('Log Methods', () => {
    it('should log debug messages', () => {
      logger.setLogLevel(LogLevel.DEBUG);
      logger.debug('Debug message', { key: 'value' });

      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] Debug message {"key":"value"}')
      );
    });

    it('should log info messages', () => {
      logger.info('Info message', { key: 'value' });

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Info message {"key":"value"}')
      );
    });

    it('should log warning messages', () => {
      logger.warn('Warning message', { key: 'value' });

      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message {"key":"value"}')
      );
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', { key: 'value' }, error);

      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Error message {"key":"value"} Error: Test error')
      );
    });

    it('should log fatal messages', () => {
      const error = new Error('Fatal error');
      logger.fatal('Fatal message', { key: 'value' }, error);

      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[FATAL] Fatal message {"key":"value"} Error: Fatal error')
      );
    });
  });

  describe('Log Management', () => {
    it('should limit the number of logs', () => {
      logger.setMaxLogs(5);

      // Add more logs than the limit
      for (let i = 0; i < 10; i++) {
        logger.info(`Message ${i}`);
      }

      const logs = logger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(5);
    });

    it('should clear logs', () => {
      logger.info('Test message');
      expect(logger.getLogs().length).toBe(1);

      logger.clearLogs();
      expect(logger.getLogs().length).toBe(0);
    });

    it('should export logs as JSON', () => {
      logger.info('Test message');
      const jsonLogs = logger.exportLogs();

      expect(() => JSON.parse(jsonLogs)).not.toThrow();
      expect(jsonLogs).toContain('Test message');
    });

    it('should count errors', () => {
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      logger.fatal('Fatal message');

      expect(logger.getErrorCount()).toBe(2);
    });

    it('should get recent errors', () => {
      logger.warn('Warning message');
      logger.error('Error 1');
      logger.error('Error 2');
      logger.fatal('Fatal message');

      const recentErrors = logger.getRecentErrors(2);
      expect(recentErrors.length).toBe(2);
      expect(recentErrors[0].message).toBe('Error 2');
      expect(recentErrors[1].message).toBe('Fatal message');
    });
  });

  describe('Observers', () => {
    it('should subscribe to log notifications', () => {
      const observer = jest.fn();
      const unsubscribe = logger.subscribe(observer);

      logger.info('Test message');

      expect(observer).toHaveBeenCalledWith(
        expect.objectContaining({
          level: LogLevel.INFO,
          message: 'Test message',
        })
      );

      unsubscribe();
    });

    it('should unsubscribe from log notifications', () => {
      const observer = jest.fn();
      const unsubscribe = logger.subscribe(observer);

      unsubscribe();
      logger.info('Test message');

      expect(observer).not.toHaveBeenCalled();
    });

    it('should handle observer errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const faultyObserver = jest.fn(() => {
        throw new Error('Observer error');
      });

      logger.subscribe(faultyObserver);
      logger.info('Test message');

      expect(consoleSpy).toHaveBeenCalledWith('Error in log observer:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});

describe('AppError', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.timestamp).toBeDefined();
  });

  it('should create an AppError with custom values', () => {
    const context = { userId: '123' };
    const error = new AppError('Test error', 'CUSTOM_ERROR', 400, context);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('CUSTOM_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.context).toEqual(context);
  });

  it('should serialize to JSON', () => {
    const error = new AppError('Test error', 'CUSTOM_ERROR', 400, { key: 'value' });
    const json = error.toJSON();

    expect(json.name).toBe('AppError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe('CUSTOM_ERROR');
    expect(json.statusCode).toBe(400);
    expect(json.context).toEqual({ key: 'value' });
  });
});

describe('Specific Error Types', () => {
  describe('ValidationError', () => {
    it('should create a ValidationError', () => {
      const error = new ValidationError('Invalid input', 'email', 'invalid-email');

      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.context).toEqual({ field: 'email', value: 'invalid-email' });
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError', () => {
      const error = new NotFoundError('User', '123');

      expect(error.name).toBe('NotFoundError');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User with ID 123 not found');
      expect(error.context).toEqual({ resource: 'User', id: '123' });
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an UnauthorizedError', () => {
      const error = new UnauthorizedError('Access denied');

      expect(error.name).toBe('UnauthorizedError');
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Access denied');
    });
  });

  describe('ForbiddenError', () => {
    it('should create a ForbiddenError', () => {
      const error = new ForbiddenError('Access forbidden');

      expect(error.name).toBe('ForbiddenError');
      expect(error.code).toBe('FORBIDDEN');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access forbidden');
    });
  });

  describe('ConflictError', () => {
    it('should create a ConflictError', () => {
      const conflictDetails = { existingValue: 'test' };
      const error = new ConflictError('Resource already exists', conflictDetails);

      expect(error.name).toBe('ConflictError');
      expect(error.code).toBe('CONFLICT');
      expect(error.statusCode).toBe(409);
      expect(error.context).toEqual({ conflictDetails });
    });
  });

  describe('DatabaseError', () => {
    it('should create a DatabaseError', () => {
      const error = new DatabaseError('Query failed', 'SELECT * FROM users', { limit: 10 });

      expect(error.name).toBe('DatabaseError');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.context).toEqual({ query: 'SELECT * FROM users', params: { limit: 10 } });
    });
  });

  describe('NetworkError', () => {
    it('should create a NetworkError', () => {
      const error = new NetworkError('Request failed', 'https://api.example.com', 500);

      expect(error.name).toBe('NetworkError');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.statusCode).toBe(503);
      expect(error.context).toEqual({ url: 'https://api.example.com', status: 500 });
    });
  });
});

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    logger.clearLogs();
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle AppError', () => {
      const appError = new AppError('Test error');
      const result = handleError(appError);

      expect(result).toBe(appError);
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('should convert generic Error to AppError', () => {
      const genericError = new Error('Generic error');
      const result = handleError(genericError);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('Generic error');
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.context?.originalError).toBe('Error');
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('should include context in converted error', () => {
      const context = { userId: '123' };
      const genericError = new Error('Generic error');
      const result = handleError(genericError, context);

      expect(result.context?.userId).toBe('123');
    });
  });
});

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics();
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const monitor1 = performanceMonitor;
      const monitor2 = performanceMonitor;
      expect(monitor1).toBe(monitor2);
    });
  });

  describe('Metrics', () => {
    it('should record and retrieve metrics', () => {
      performanceMonitor.recordMetric('test-metric', 100);

      expect(performanceMonitor.getMetric('test-metric')).toBe(100);
    });

    it('should get all metrics', () => {
      performanceMonitor.recordMetric('metric1', 100);
      performanceMonitor.recordMetric('metric2', 200);

      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics.metric1).toBe(100);
      expect(metrics.metric2).toBe(200);
    });

    it('should clear metrics', () => {
      performanceMonitor.recordMetric('test-metric', 100);
      expect(performanceMonitor.getMetric('test-metric')).toBe(100);

      performanceMonitor.clearMetrics();
      expect(performanceMonitor.getMetric('test-metric')).toBeUndefined();
    });
  });

  describe('Async Measurement', () => {
    it('should measure async function performance', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');

      const result = await performanceMonitor.measureAsync('test-operation', mockFn);

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();
      expect(performanceMonitor.getMetric('test-operation')).toBeGreaterThan(0);
    });

    it('should handle async function errors', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));

      await expect(performanceMonitor.measureAsync('test-operation', mockFn)).rejects.toThrow(
        'Test error'
      );
      expect(mockFn).toHaveBeenCalled();
      expect(performanceMonitor.getMetric('test-operation_error')).toBeGreaterThan(0);
      expect(performanceMonitor.getMetric('test-operation_failure')).toBe(1);
    });
  });

  describe('Observers', () => {
    it('should subscribe to metric notifications', () => {
      const observer = jest.fn();
      const unsubscribe = performanceMonitor.subscribe(observer);

      performanceMonitor.recordMetric('test-metric', 100);

      expect(observer).toHaveBeenCalledWith('test-metric', 100);

      unsubscribe();
    });

    it('should unsubscribe from metric notifications', () => {
      const observer = jest.fn();
      const unsubscribe = performanceMonitor.subscribe(observer);

      unsubscribe();
      performanceMonitor.recordMetric('test-metric', 100);

      expect(observer).not.toHaveBeenCalled();
    });

    it('should handle observer errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const faultyObserver = jest.fn(() => {
        throw new Error('Observer error');
      });

      performanceMonitor.subscribe(faultyObserver);
      performanceMonitor.recordMetric('test-metric', 100);

      expect(consoleSpy).toHaveBeenCalledWith('Error in performance observer:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});

describe('Observability Hooks', () => {
  beforeEach(() => {
    logger.clearLogs();
    jest.clearAllMocks();
  });

  describe('createObservabilityHook', () => {
    it('should create observability hook for component', () => {
      const hook = createObservabilityHook('TestComponent');

      expect(hook).toHaveProperty('logEvent');
      expect(hook).toHaveProperty('logError');
      expect(hook).toHaveProperty('measurePerformance');
      expect(hook).toHaveProperty('trackMetric');
    });

    it('should log events with component name', () => {
      const hook = createObservabilityHook('TestComponent');
      const data = { action: 'click' };

      hook.logEvent('User clicked button', data);

      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent] User clicked button')
      );
    });

    it('should log errors with component name', () => {
      const hook = createObservabilityHook('TestComponent');
      const error = new Error('Test error');
      const context = { userId: '123' };

      hook.logError(error, context);

      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent] Test error')
      );
    });

    it('should measure performance with component name', async () => {
      const hook = createObservabilityHook('TestComponent');
      const mockFn = jest.fn().mockResolvedValue('result');

      const result = await hook.measurePerformance('test-operation', mockFn);

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();
    });

    it('should track metrics with component name', () => {
      const hook = createObservabilityHook('TestComponent');

      hook.trackMetric('test-metric', 100);

      expect(performanceMonitor.getMetric('TestComponent_test-metric')).toBe(100);
    });
  });
});
