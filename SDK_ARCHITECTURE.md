# 📦 Multi-SDK Architecture Guide

## Overview

This project provides SDKs for multiple technology stacks. All SDKs communicate with the same backend API endpoint `/api/errors/report` using API key authentication.

## SDK Structure

We use a **separate directory per SDK** approach for clarity and independence:

```
sdks/
├── js/              # JavaScript/TypeScript SDK (Browser + Node.js)
│   ├── src/
│   ├── package.json
│   └── README.md
├── python/          # Python SDK (Django, Flask, FastAPI, etc.)
│   ├── error_tracker/
│   ├── setup.py
│   └── README.md
├── nestjs/          # NestJS-specific SDK (middleware, decorators)
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md        # Overview of all SDKs
```

## Available SDKs

### 1. JavaScript/TypeScript SDK (`sdks/js/`)
**Target**: Browser, Node.js, React, Vue, Angular, etc.

**Installation**:
```bash
npm install @error-tracker/js
```

**Usage**:
```javascript
import { ErrorTracker } from '@error-tracker/js';

ErrorTracker.init({
  apiKey: 'err_abc123...',
  apiUrl: 'https://api.yourdomain.com/api'
});
```

### 2. Python SDK (`sdks/python/`)
**Target**: Django, Flask, FastAPI, FastAPI, etc.

**Installation**:
```bash
pip install error-tracker
```

**Usage**:
```python
from error_tracker import ErrorTracker

ErrorTracker.init(
    api_key='err_abc123...',
    api_url='https://api.yourdomain.com/api'
)

try:
    # your code
except Exception as e:
    ErrorTracker.capture_error(e)
```

**Django Integration**:
```python
# settings.py
ERROR_TRACKER_API_KEY = 'err_abc123...'
ERROR_TRACKER_API_URL = 'https://api.yourdomain.com/api'

# middleware.py
from error_tracker.django import ErrorTrackerMiddleware

MIDDLEWARE = [
    'error_tracker.django.ErrorTrackerMiddleware',
    # ... other middleware
]
```

### 3. NestJS SDK (`sdks/nestjs/`)
**Target**: NestJS applications (your own stack)

**Installation**:
```bash
npm install @error-tracker/nestjs
```

**Usage**:
```typescript
// app.module.ts
import { ErrorTrackerModule } from '@error-tracker/nestjs';

@Module({
  imports: [
    ErrorTrackerModule.forRoot({
      apiKey: process.env.ERROR_TRACKER_API_KEY,
      apiUrl: process.env.ERROR_TRACKER_API_URL,
    }),
  ],
})
export class AppModule {}
```

**Automatic Error Capture**:
```typescript
// Automatically captures all unhandled exceptions
// Can also use decorator:
@ErrorTracker()
async someMethod() {
  // errors automatically captured
}
```

## Common API Contract

All SDKs must send data to `/api/errors/report` in this format:

```typescript
POST /api/errors/report
Headers:
  Authorization: Bearer <API_KEY>
  Content-Type: application/json

Body:
{
  errorType: string;        // "TypeError", "ValueError", "HttpException", etc.
  message: string;          // Error message
  stackTrace: string;       // Full stack trace
  severity?: 'critical' | 'error' | 'warning' | 'info';
  file?: string;
  line?: number;
  functionName?: string;
  metadata?: {
    url?: string;
    userAgent?: string;
    environment?: string;
    framework?: string;      // "django", "nestjs", "express", etc.
    browser?: string;
    os?: string;
    screen?: string;
    userId?: string;
    userName?: string;
    [key: string]: any;
  };
}
```

## SDK Requirements

Each SDK should provide:

1. **Initialization**: Simple config-based setup
2. **Automatic Capture**: Framework-specific error handlers
3. **Manual Capture**: `captureError()` / `capture_error()` method
4. **Context Collection**: Framework/environment-specific context
5. **Configuration**: API key, endpoint, environment, etc.

## Distribution

- **JavaScript**: npm (`@error-tracker/js`)
- **Python**: PyPI (`error-tracker`)
- **NestJS**: npm (`@error-tracker/nestjs`)

## Future SDKs

Potential additions:
- **Go SDK**: For Go applications
- **Ruby SDK**: For Rails, Sinatra
- **Java SDK**: For Spring Boot
- **PHP SDK**: For Laravel, Symfony
- **.NET SDK**: For ASP.NET

## Development

Each SDK is independent:
- Own dependencies
- Own build process
- Own tests
- Own documentation

But they share:
- Same backend API
- Same data format
- Same authentication (API key)
