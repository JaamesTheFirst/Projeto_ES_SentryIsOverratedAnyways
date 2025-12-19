// Re-export everything from the JS SDK
export { ErrorTracker } from '@error-tracker/js';
export type { ErrorSeverity, SDKConfig, ErrorData } from '@error-tracker/js';

// Export React-specific components and hooks
export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps } from './ErrorBoundary';

export {
  useErrorTracker,
  useCaptureError,
  useCaptureMessage,
  useSetUser,
  useSetTags,
  useSetMetadata,
} from './hooks';

// Default export for convenience
import { ErrorTracker } from '@error-tracker/js';
export default ErrorTracker;

