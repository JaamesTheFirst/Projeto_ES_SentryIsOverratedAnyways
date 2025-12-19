/**
 * Extracts error information from Error object
 */
export function extractErrorInfo(error: Error | string): {
  errorType: string;
  message: string;
  stackTrace: string;
  file?: string;
  line?: number;
  functionName?: string;
} {
  if (typeof error === 'string') {
    return {
      errorType: 'Error',
      message: error,
      stackTrace: error,
    };
  }

  const errorType = error.name || 'Error';
  const message = error.message || 'Unknown error';
  const stackTrace = error.stack || message;

  // Try to parse stack trace for file, line, and function
  let file: string | undefined;
  let line: number | undefined;
  let functionName: string | undefined;

  if (error.stack) {
    const stackLines = error.stack.split('\n');
    // Look for the first line with file information
    for (const stackLine of stackLines) {
      // Pattern: at FunctionName (file.js:123:45) or at file.js:123:45
      const match = stackLine.match(/at\s+(\w+)?\s*\(?([^:]+):(\d+):(\d+)\)?/);
      if (match) {
        functionName = match[1] || undefined;
        file = match[2].split('/').pop() || match[2]; // Get filename only
        line = parseInt(match[3], 10);
        break;
      }

      // Fallback: simpler pattern
      const simpleMatch = stackLine.match(/([^:]+):(\d+)/);
      if (simpleMatch) {
        file = simpleMatch[1].split('/').pop() || simpleMatch[1];
        line = parseInt(simpleMatch[2], 10);
        break;
      }
    }
  }

  return {
    errorType,
    message,
    stackTrace,
    file,
    line,
    functionName,
  };
}

