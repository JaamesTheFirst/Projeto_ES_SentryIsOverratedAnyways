export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

export interface SDKConfig {
  apiKey: string;
  apiUrl?: string;
  environment?: string;
  release?: string;
  enabled?: boolean;
  beforeSend?: (error: ErrorData) => ErrorData | null;
  ignoreErrors?: Array<string | RegExp>;
  maxBreadcrumbs?: number;
  sampleRate?: number; // 0.0 to 1.0, percentage of errors to send
  user?: {
    id?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  };
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface ErrorData {
  errorType: string;
  message: string;
  stackTrace: string;
  severity?: ErrorSeverity;
  file?: string;
  line?: number;
  functionName?: string;
  metadata?: {
    url?: string;
    userAgent?: string;
    environment?: string;
    framework?: string;
    browser?: string;
    os?: string;
    screen?: string;
    userId?: string;
    userName?: string;
    release?: string;
    tags?: Record<string, string>;
    [key: string]: any;
  };
}

export interface BrowserContext {
  url: string;
  userAgent: string;
  browser?: string;
  os?: string;
  screen?: string;
}

