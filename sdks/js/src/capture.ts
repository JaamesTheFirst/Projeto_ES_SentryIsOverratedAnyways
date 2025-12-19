import { SDKConfig, ErrorData, ErrorSeverity } from './types';
import { extractErrorInfo } from './stacktrace';
import { collectBrowserContext } from './context';
import { sendError } from './transport';

/**
 * Checks if error should be ignored based on ignoreErrors config
 */
function shouldIgnoreError(config: SDKConfig, error: Error | string): boolean {
  if (!config.ignoreErrors || config.ignoreErrors.length === 0) {
    return false;
  }

  const message = typeof error === 'string' ? error : error.message;
  const errorString = message.toLowerCase();

  return config.ignoreErrors.some((pattern) => {
    if (typeof pattern === 'string') {
      return errorString.includes(pattern.toLowerCase());
    }
    return pattern.test(message);
  });
}

/**
 * Captures an error and sends it to the API
 */
export async function captureError(
  config: SDKConfig,
  error: Error | string,
  severity: ErrorSeverity = 'error',
  additionalMetadata?: Record<string, any>,
): Promise<void> {
  if (!config.enabled) {
    return;
  }

  // Check if error should be ignored
  if (shouldIgnoreError(config, error)) {
    return;
  }

  // Extract error information
  const errorInfo = extractErrorInfo(error);

  // Collect browser context
  const browserContext = collectBrowserContext();

  // Build error data
  const errorData: ErrorData = {
    errorType: errorInfo.errorType,
    message: errorInfo.message,
    stackTrace: errorInfo.stackTrace,
    severity,
    file: errorInfo.file,
    line: errorInfo.line,
    functionName: errorInfo.functionName,
    metadata: {
      ...browserContext,
      environment: config.environment,
      release: config.release,
      ...(config.user?.id && { userId: config.user.id }),
      ...(config.user?.username && { userName: config.user.username }),
      ...(config.tags && { tags: config.tags }),
      ...config.metadata,
      ...additionalMetadata,
    },
  };

  // Apply beforeSend hook
  let finalErrorData = errorData;
  if (config.beforeSend) {
    const result = config.beforeSend(errorData);
    if (result === null) {
      // Error was filtered out
      return;
    }
    finalErrorData = result;
  }

  // Send error
  await sendError(config, finalErrorData);
}

/**
 * Captures a message (non-error)
 */
export async function captureMessage(
  config: SDKConfig,
  message: string,
  severity: ErrorSeverity = 'info',
  additionalMetadata?: Record<string, any>,
): Promise<void> {
  if (!config.enabled) {
    return;
  }

  const browserContext = collectBrowserContext();

  const errorData: ErrorData = {
    errorType: 'Message',
    message,
    stackTrace: new Error().stack || message,
    severity,
    metadata: {
      ...browserContext,
      environment: config.environment,
      release: config.release,
      ...(config.user?.id && { userId: config.user.id }),
      ...(config.user?.username && { userName: config.user.username }),
      ...(config.tags && { tags: config.tags }),
      ...config.metadata,
      ...additionalMetadata,
    },
  };

  // Apply beforeSend hook
  let finalErrorData = errorData;
  if (config.beforeSend) {
    const result = config.beforeSend(errorData);
    if (result === null) {
      return;
    }
    finalErrorData = result;
  }

  await sendError(config, finalErrorData);
}

