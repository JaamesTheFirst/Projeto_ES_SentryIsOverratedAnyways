# ⚛️ Error Tracker React SDK

React SDK for the Error Management Platform. Built on top of the JavaScript SDK with React-specific features like Error Boundaries and hooks.

## Installation

```bash
npm install @error-tracker/react @error-tracker/js
```

## Quick Start

### 1. Wrap your app with ErrorBoundary

```tsx
import { ErrorBoundary } from '@error-tracker/react';
import { useErrorTracker } from '@error-tracker/react';

function App() {
  // Initialize SDK
  useErrorTracker({
    apiKey: 'err_abc123...', // Get from your project settings
    apiUrl: 'https://api.yourdomain.com/api',
    environment: process.env.NODE_ENV,
    release: process.env.REACT_APP_VERSION,
  });

  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 2. That's it!

All React errors are now automatically captured and sent to your backend.

## Error Boundary

The `ErrorBoundary` component catches React errors in the component tree:

```tsx
<ErrorBoundary
  fallback={<div>Something went wrong!</div>}
  onError={(error, errorInfo) => {
    console.log('Error caught:', error);
  }}
  severity="error"
  metadata={{ feature: 'checkout' }}
>
  <YourComponent />
</ErrorBoundary>
```

### Custom Fallback

```tsx
<ErrorBoundary
  fallback={(error, errorInfo) => (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>{error.message}</p>
      {process.env.NODE_ENV === 'development' && (
        <pre>{errorInfo.componentStack}</pre>
      )}
    </div>
  )}
>
  <App />
</ErrorBoundary>
```

## React Hooks

### `useErrorTracker(config)`

Initialize the SDK:

```tsx
function App() {
  useErrorTracker({
    apiKey: process.env.REACT_APP_ERROR_TRACKER_API_KEY,
    apiUrl: process.env.REACT_APP_ERROR_TRACKER_API_URL,
  });

  return <YourApp />;
}
```

### `useCaptureError()`

Capture errors manually:

```tsx
function PaymentForm() {
  const captureError = useCaptureError();

  const handleSubmit = async () => {
    try {
      await processPayment();
    } catch (error) {
      captureError(error, 'error', {
        feature: 'payment',
        userId: user.id,
      });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### `useCaptureMessage()`

Capture messages (non-errors):

```tsx
function CheckoutPage() {
  const captureMessage = useCaptureMessage();

  useEffect(() => {
    captureMessage('User entered checkout', 'info', {
      cartValue: cart.total,
    });
  }, []);

  return <CheckoutForm />;
}
```

### `useSetUser(user)`

Set user context:

```tsx
function App() {
  const { user } = useAuth();

  useSetUser(user ? {
    id: user.id,
    email: user.email,
    username: user.username,
  } : null);

  return <YourApp />;
}
```

### `useSetTags(tags)`

Set tags for the current component/page:

```tsx
function CheckoutPage() {
  useSetTags({
    feature: 'checkout',
    page: 'payment',
  });

  return <CheckoutForm />;
}
```

### `useSetMetadata(metadata)`

Set metadata:

```tsx
function App() {
  useSetMetadata({
    appVersion: '1.0.0',
    buildNumber: process.env.REACT_APP_BUILD_NUMBER,
  });

  return <YourApp />;
}
```

## Complete Example

```tsx
import React from 'react';
import {
  ErrorBoundary,
  useErrorTracker,
  useSetUser,
  useCaptureError,
} from '@error-tracker/react';

function AppContent() {
  const { user } = useAuth();
  const captureError = useCaptureError();

  // Initialize SDK
  useErrorTracker({
    apiKey: process.env.REACT_APP_ERROR_TRACKER_API_KEY!,
    apiUrl: process.env.REACT_APP_ERROR_TRACKER_API_URL!,
    environment: process.env.NODE_ENV,
  });

  // Set user context
  useSetUser(user ? {
    id: user.id,
    email: user.email,
  } : null);

  // Manual error capture
  const handleRiskyOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error, 'error', { feature: 'risky-operation' });
    }
  };

  return (
    <div>
      <YourApp />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please refresh the page.</div>}
    >
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
```

## Features

- ✅ **Error Boundary** - Automatic React error capture
- ✅ **React Hooks** - Easy integration with hooks
- ✅ **TypeScript** - Full TypeScript support
- ✅ **Manual Capture** - Capture errors and messages manually
- ✅ **User Context** - Track users across your app
- ✅ **Tags & Metadata** - Add context to errors

## Differences from JS SDK

The React SDK:
- Adds `ErrorBoundary` component for React errors
- Provides React hooks for easier integration
- Automatically captures React component errors
- Includes component stack traces

The underlying JS SDK still handles:
- Browser errors (`window.onerror`)
- Promise rejections (`unhandledrejection`)
- Manual error reporting

## Testing

### Quick Test (HTML)

1. Build the SDKs:
   ```bash
   cd sdks/js && npm install && npm run build
   cd ../react && npm install && npm run build
   ```

2. Open `test.html` in a browser:
   ```bash
   # From sdks/react directory
   python3 -m http.server 8080
   # Then open http://localhost:8080/test.html
   ```

3. Enter your API key and test the features!

### Node.js Test

```bash
# Set your API key
export ERROR_TRACKER_API_KEY="err_abc123..."
export ERROR_TRACKER_API_URL="http://localhost:3000/api"

# Build and test
npm run build
node test-node.js
```

### Integration Test

Create a test React app:

```bash
npx create-react-app test-app
cd test-app
npm install ../../react ../../js
# Then use the SDK in your app
```

## License

MIT

