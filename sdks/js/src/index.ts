import { ErrorTrackerClient } from './client';
import { SDKConfig, ErrorSeverity } from './types';

// Create singleton instance
const client = new ErrorTrackerClient();

// Export the main API
const ErrorTracker = {
  /**
   * Initialize the SDK
   */
  init: (config: SDKConfig) => client.init(config),

  /**
   * Capture an error
   */
  captureError: (
    error: Error | string,
    severity?: ErrorSeverity,
    metadata?: Record<string, any>,
  ) => client.captureError(error, severity, metadata),

  /**
   * Capture a message
   */
  captureMessage: (
    message: string,
    severity?: ErrorSeverity,
    metadata?: Record<string, any>,
  ) => client.captureMessage(message, severity, metadata),

  /**
   * Set user context
   */
  setUser: (user: SDKConfig['user']) => client.setUser(user),

  /**
   * Set tags
   */
  setTags: (tags: Record<string, string>) => client.setTags(tags),

  /**
   * Set metadata
   */
  setMetadata: (metadata: Record<string, any>) => client.setMetadata(metadata),

  /**
   * Enable/disable the SDK
   */
  setEnabled: (enabled: boolean) => client.setEnabled(enabled),

  /**
   * Get current configuration
   */
  getConfig: () => client.getConfig(),
};

// Export as both named and default for flexibility
export { ErrorTracker };
export default ErrorTracker;

// Export types
export type { SDKConfig, ErrorData, ErrorSeverity } from './types';

