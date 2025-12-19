import { useEffect, useCallback } from 'react';
import { ErrorTracker, SDKConfig } from '@error-tracker/js';
import { ErrorSeverity } from '@error-tracker/js';

/**
 * Hook to initialize Error Tracker
 * 
 * @example
 * ```tsx
 * function App() {
 *   useErrorTracker({
 *     apiKey: 'err_abc123...',
 *     apiUrl: 'https://api.example.com/api'
 *   });
 *   
 *   return <YourApp />;
 * }
 * ```
 */
export function useErrorTracker(config: SDKConfig) {
  useEffect(() => {
    ErrorTracker.init(config);
  }, []);
}

/**
 * Hook to capture errors in React components
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const captureError = useCaptureError();
 *   
 *   const handleClick = async () => {
 *     try {
 *       await riskyOperation();
 *     } catch (error) {
 *       captureError(error, 'error', { feature: 'checkout' });
 *     }
 *   };
 * }
 * ```
 */
export function useCaptureError() {
  return useCallback((
    error: Error | string,
    severity?: ErrorSeverity,
    metadata?: Record<string, any>
  ) => {
    ErrorTracker.captureError(error, severity, metadata);
  }, []);
}

/**
 * Hook to capture messages
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const captureMessage = useCaptureMessage();
 *   
 *   useEffect(() => {
 *     captureMessage('Component mounted', 'info');
 *   }, []);
 * }
 * ```
 */
export function useCaptureMessage() {
  return useCallback((
    message: string,
    severity?: ErrorSeverity,
    metadata?: Record<string, any>
  ) => {
    ErrorTracker.captureMessage(message, severity, metadata);
  }, []);
}

/**
 * Hook to set user context
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { user } = useAuth();
 *   
 *   useSetUser(user ? {
 *     id: user.id,
 *     email: user.email,
 *     username: user.username
 *   } : null);
 * }
 * ```
 */
export function useSetUser(user: SDKConfig['user'] | null) {
  useEffect(() => {
    if (user) {
      ErrorTracker.setUser(user);
    }
  }, [user]);
}

/**
 * Hook to set tags
 * 
 * @example
 * ```tsx
 * function CheckoutPage() {
 *   useSetTags({ feature: 'checkout', page: 'payment' });
 * }
 * ```
 */
export function useSetTags(tags: Record<string, string>) {
  useEffect(() => {
    ErrorTracker.setTags(tags);
  }, [JSON.stringify(tags)]);
}

/**
 * Hook to set metadata
 * 
 * @example
 * ```tsx
 * function App() {
 *   useSetMetadata({ 
 *     appVersion: '1.0.0',
 *     buildNumber: '123'
 *   });
 * }
 * ```
 */
export function useSetMetadata(metadata: Record<string, any>) {
  useEffect(() => {
    ErrorTracker.setMetadata(metadata);
  }, [JSON.stringify(metadata)]);
}

