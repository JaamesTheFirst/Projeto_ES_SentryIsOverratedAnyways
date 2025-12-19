# 📦 Error Tracker SDK

JavaScript SDK for the Error Management Platform. Easy integration for error tracking in any JavaScript application.

## Installation

### npm

```bash
npm install @error-tracker/sdk
```

### CDN (Browser)

```html
<script src="https://cdn.yourdomain.com/sdk.js"></script>
```

## Quick Start

### Browser

```javascript
import { ErrorTracker } from '@error-tracker/sdk';

// Initialize
ErrorTracker.init({
  apiKey: 'err_abc123...', // Get this from your project settings
  apiUrl: 'https://api.yourdomain.com/api', // Optional, defaults to localhost:3000
  environment: 'production',
  release: '1.0.0',
});

// Automatic error capture is now enabled!
// Errors will be automatically sent to your backend
```

### Node.js

```javascript
const { ErrorTracker } = require('@error-tracker/sdk');

ErrorTracker.init({
  apiKey: 'err_abc123...',
  apiUrl: 'https://api.yourdomain.com/api',
});

// Capture uncaught exceptions
process.on('uncaughtException', (error) => {
  ErrorTracker.captureError(error, 'critical');
});

// Capture unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  ErrorTracker.captureError(
    reason instanceof Error ? reason : new Error(String(reason)),
    'error'
  );
});
```

## API Reference

### `ErrorTracker.init(config)`

Initialize the SDK with your configuration.

**Parameters:**
- `config.apiKey` (required): Your project API key
- `config.apiUrl` (optional): Backend API URL (default: `http://localhost:3000/api`)
- `config.environment` (optional): Environment name (e.g., 'production', 'development')
- `config.release` (optional): Release version (e.g., '1.0.0')
- `config.enabled` (optional): Enable/disable SDK (default: `true`)
- `config.beforeSend` (optional): Hook to modify/filter errors before sending
- `config.ignoreErrors` (optional): Array of error patterns to ignore
- `config.sampleRate` (optional): Percentage of errors to send (0.0 to 1.0)
- `config.user` (optional): User context object
- `config.tags` (optional): Key-value tags
- `config.metadata` (optional): Additional metadata

**Example:**
```javascript
ErrorTracker.init({
  apiKey: 'err_abc123...',
  apiUrl: 'https://api.yourdomain.com/api',
  environment: 'production',
  release: '1.0.0',
  beforeSend: (error) => {
    // Filter out sensitive data
    if (error.message.includes('password')) {
      return null; // Don't send this error
    }
    return error;
  },
  ignoreErrors: ['Script error', /NetworkError/i],
  sampleRate: 1.0, // Send 100% of errors
  user: {
    id: 'user123',
    email: 'user@example.com',
  },
  tags: {
    feature: 'checkout',
  },
});
```

### `ErrorTracker.captureError(error, severity?, metadata?)`

Manually capture an error.

**Parameters:**
- `error`: Error object or error message string
- `severity` (optional): 'critical' | 'error' | 'warning' | 'info' (default: 'error')
- `metadata` (optional): Additional metadata object

**Example:**
```javascript
try {
  // your code
} catch (error) {
  ErrorTracker.captureError(error, 'error', {
    feature: 'payment',
    userId: 'user123',
  });
}
```

### `ErrorTracker.captureMessage(message, severity?, metadata?)`

Capture a message (non-error).

**Example:**
```javascript
ErrorTracker.captureMessage('User completed checkout', 'info', {
  orderId: 'order123',
});
```

### `ErrorTracker.setUser(user)`

Set user context for all subsequent errors.

**Example:**
```javascript
ErrorTracker.setUser({
  id: 'user123',
  email: 'user@example.com',
  username: 'johndoe',
});
```

### `ErrorTracker.setTags(tags)`

Set tags for all subsequent errors.

**Example:**
```javascript
ErrorTracker.setTags({
  feature: 'checkout',
  version: '2.0',
});
```

### `ErrorTracker.setMetadata(metadata)`

Set metadata for all subsequent errors.

**Example:**
```javascript
ErrorTracker.setMetadata({
  server: 'api-1',
  region: 'us-east-1',
});
```

### `ErrorTracker.setEnabled(enabled)`

Enable or disable the SDK.

**Example:**
```javascript
// Disable in development
if (process.env.NODE_ENV === 'development') {
  ErrorTracker.setEnabled(false);
}
```

## Framework Integration

### React

```jsx
import { useEffect } from 'react';
import { ErrorTracker } from '@error-tracker/sdk';

function App() {
  useEffect(() => {
    ErrorTracker.init({
      apiKey: process.env.REACT_APP_ERROR_TRACKER_API_KEY,
      apiUrl: process.env.REACT_APP_ERROR_TRACKER_API_URL,
      environment: process.env.NODE_ENV,
    });
  }, []);

  return <YourApp />;
}
```

### Vue

```javascript
import { createApp } from 'vue';
import { ErrorTracker } from '@error-tracker/sdk';

const app = createApp(App);

ErrorTracker.init({
  apiKey: import.meta.env.VITE_ERROR_TRACKER_API_KEY,
  apiUrl: import.meta.env.VITE_ERROR_TRACKER_API_URL,
});

app.config.errorHandler = (error, instance, info) => {
  ErrorTracker.captureError(error, 'error', {
    componentInfo: info,
  });
};

app.mount('#app');
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check
```

## License

MIT

