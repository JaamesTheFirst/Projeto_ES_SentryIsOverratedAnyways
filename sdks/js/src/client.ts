import { SDKConfig, ErrorSeverity } from './types';
import { captureError, captureMessage } from './capture';

export class ErrorTrackerClient {
  private config: SDKConfig | null = null;
  private originalErrorHandler: typeof window.onerror | null = null;
  private originalUnhandledRejectionHandler:
    | ((event: PromiseRejectionEvent) => void)
    | null = null;

  /**
   * Initialize the SDK
   */
  init(config: SDKConfig): void {
    if (this.config) {
      console.warn('[ErrorTracker] SDK already initialized');
      return;
    }

    // Validate required config
    if (!config.apiKey) {
      throw new Error('ErrorTracker: apiKey is required');
    }

    // Set defaults
    this.config = {
      enabled: true,
      apiUrl: 'http://localhost:3000/api',
      ...config,
    };

    // Setup automatic error capture
    if (this.config.enabled) {
      this.setupAutomaticCapture();
    }
  }

  /**
   * Setup automatic error capture handlers
   */
  private setupAutomaticCapture(): void {
    if (typeof window === 'undefined') {
      return; // Not in browser environment
    }

    // Capture window.onerror
    this.originalErrorHandler = window.onerror;
    window.onerror = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error,
    ) => {
      if (this.config) {
        const errorObj =
          error ||
          new Error(typeof message === 'string' ? message : 'Unknown error');
        captureError(this.config, errorObj, 'error', {
          url: source,
          line: lineno,
          column: colno,
        });
      }

      // Call original handler if it exists
      if (this.originalErrorHandler) {
        return this.originalErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    };

    // Capture unhandled promise rejections
    this.originalUnhandledRejectionHandler = window.onunhandledrejection;
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      if (this.config) {
        const error =
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));
        captureError(this.config, error, 'error', {
          promiseRejection: true,
        });
      }

      // Call original handler if it exists
      if (this.originalUnhandledRejectionHandler) {
        this.originalUnhandledRejectionHandler(event);
      }
    });
  }

  /**
   * Manually capture an error
   */
  captureError(
    error: Error | string,
    severity: ErrorSeverity = 'error',
    metadata?: Record<string, any>,
  ): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    captureError(this.config, error, severity, metadata);
  }

  /**
   * Capture a message (non-error)
   */
  captureMessage(
    message: string,
    severity: ErrorSeverity = 'info',
    metadata?: Record<string, any>,
  ): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    captureMessage(this.config, message, severity, metadata);
  }

  /**
   * Set user context
   */
  setUser(user: SDKConfig['user']): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    this.config.user = user;
  }

  /**
   * Set tags
   */
  setTags(tags: Record<string, string>): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    this.config.tags = { ...this.config.tags, ...tags };
  }

  /**
   * Set metadata
   */
  setMetadata(metadata: Record<string, any>): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    this.config.metadata = { ...this.config.metadata, ...metadata };
  }

  /**
   * Enable/disable the SDK
   */
  setEnabled(enabled: boolean): void {
    if (!this.config) {
      console.warn('[ErrorTracker] SDK not initialized. Call init() first.');
      return;
    }
    this.config.enabled = enabled;
  }

  /**
   * Get current configuration
   */
  getConfig(): SDKConfig | null {
    return this.config ? { ...this.config } : null;
  }
}

