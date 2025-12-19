import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorTracker } from '@error-tracker/js';
import { ErrorSeverity } from '@error-tracker/js';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  severity?: ErrorSeverity;
  metadata?: Record<string, any>;
  showError?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary component
 * 
 * Wraps your app/components to catch React errors and send them to Error Tracker
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture error
    ErrorTracker.captureError(
      error,
      this.props.severity || 'error',
      {
        ...this.props.metadata,
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      }
    );

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.state.errorInfo!);
        }
        return this.props.fallback;
      }

      // Default fallback
      if (this.props.showError !== false) {
        return (
          <div style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            fontFamily: 'system-ui, sans-serif',
          }}>
            <h2 style={{ color: '#d32f2f', marginTop: 0 }}>Something went wrong</h2>
            <p>An error occurred in this component.</p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        );
      }

      return null;
    }

    return this.props.children;
  }
}

