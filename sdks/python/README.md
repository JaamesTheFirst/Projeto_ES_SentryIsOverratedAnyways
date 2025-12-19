# 🐍 Error Tracker Python SDK

Python SDK for the Error Management Platform. Works with Django, Flask, FastAPI, and standalone Python applications.

## Installation

```bash
pip install error-tracker
```

### Framework-specific extras

```bash
# For Django
pip install error-tracker[django]

# For Flask
pip install error-tracker[flask]

# For FastAPI
pip install error-tracker[fastapi]
```

## Quick Start

### Standalone Python

```python
from error_tracker import ErrorTracker

# Initialize
ErrorTracker.init(
    api_key='err_abc123...',  # Get from your project settings
    api_url='https://api.yourdomain.com/api',
    environment='production',
    release='1.0.0',
)

# Automatic error capture is enabled!
# Uncaught exceptions are automatically sent

# Manual error capture
try:
    # your code
    pass
except Exception as e:
    ErrorTracker.capture_error(e, severity='error')
```

### Django

#### 1. Install

```bash
pip install error-tracker[django]
```

#### 2. Add to settings.py

```python
# settings.py
ERROR_TRACKER_API_KEY = 'err_abc123...'
ERROR_TRACKER_API_URL = 'https://api.yourdomain.com/api'
ERROR_TRACKER_ENVIRONMENT = 'production'
ERROR_TRACKER_RELEASE = '1.0.0'
```

#### 3. Add middleware

```python
# settings.py
MIDDLEWARE = [
    # ... other middleware
    'error_tracker.django.ErrorTrackerMiddleware',
]
```

That's it! All exceptions in your Django views will be automatically captured.

### Flask

```python
from flask import Flask
from error_tracker import ErrorTracker

app = Flask(__name__)

# Initialize
ErrorTracker.init(
    api_key='err_abc123...',
    api_url='https://api.yourdomain.com/api',
)

# Add error handler
@app.errorhandler(Exception)
def handle_exception(e):
    ErrorTracker.capture_error(e, severity='error')
    # Re-raise or return error response
    raise

if __name__ == '__main__':
    app.run()
```

### FastAPI

```python
from fastapi import FastAPI
from error_tracker import ErrorTracker

app = FastAPI()

# Initialize
ErrorTracker.init(
    api_key='err_abc123...',
    api_url='https://api.yourdomain.com/api',
)

# Add exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    ErrorTracker.capture_error(exc, severity='error')
    raise

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

## API Reference

### `ErrorTracker.init(**kwargs)`

Initialize the SDK.

**Parameters:**
- `api_key` (required): Your project API key
- `api_url` (optional): Backend API URL (default: `http://localhost:3000/api`)
- `environment` (optional): Environment name
- `release` (optional): Release version
- `enabled` (optional): Enable/disable SDK (default: `True`)
- `ignore_errors` (optional): List of error patterns to ignore
- `sample_rate` (optional): Percentage of errors to send (0.0 to 1.0)
- `user` (optional): User context dict
- `tags` (optional): Key-value tags dict
- `metadata` (optional): Additional metadata dict
- `before_send` (optional): Callback to modify/filter errors

### `ErrorTracker.capture_error(error, severity='error', metadata=None)`

Manually capture an error.

**Example:**
```python
try:
    # your code
    pass
except ValueError as e:
    ErrorTracker.capture_error(e, severity='error', metadata={
        'feature': 'payment',
        'user_id': 'user123',
    })
```

### `ErrorTracker.capture_message(message, severity='info', metadata=None)`

Capture a message (non-error).

**Example:**
```python
ErrorTracker.capture_message('User completed checkout', 'info', {
    'order_id': 'order123',
})
```

### `ErrorTracker.set_user(user)`

Set user context.

**Example:**
```python
ErrorTracker.set_user({
    'id': 'user123',
    'email': 'user@example.com',
    'username': 'johndoe',
})
```

### `ErrorTracker.set_tags(tags)`

Set tags.

**Example:**
```python
ErrorTracker.set_tags({
    'feature': 'checkout',
    'version': '2.0',
})
```

### `ErrorTracker.set_metadata(metadata)`

Set metadata.

**Example:**
```python
ErrorTracker.set_metadata({
    'server': 'api-1',
    'region': 'us-east-1',
})
```

### `ErrorTracker.set_enabled(enabled)`

Enable/disable the SDK.

**Example:**
```python
# Disable in development
if os.getenv('ENV') == 'development':
    ErrorTracker.set_enabled(False)
```

## Configuration Examples

### With before_send hook

```python
def before_send(error_data):
    # Filter out sensitive errors
    if 'password' in error_data.message.lower():
        return None  # Don't send
    return error_data

ErrorTracker.init(
    api_key='err_abc123...',
    before_send=before_send,
)
```

### With ignore patterns

```python
import re

ErrorTracker.init(
    api_key='err_abc123...',
    ignore_errors=[
        'ConnectionError',
        re.compile(r'^404.*'),
    ],
)
```

### With sample rate

```python
# Only send 50% of errors (useful for high-traffic apps)
ErrorTracker.init(
    api_key='err_abc123...',
    sample_rate=0.5,
)
```

## Development

```bash
# Install in development mode
pip install -e .

# Run tests
python -m pytest

# Build package
python setup.py sdist bdist_wheel
```

## License

MIT

