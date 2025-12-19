# 📦 Error Tracker SDKs

Multi-language SDKs for the Error Management Platform.

## Available SDKs

- **[JavaScript/TypeScript](./js/)** - Browser & Node.js
- **[React](./react/)** - React apps with Error Boundaries & hooks
- **[Python](./python/)** - Django, Flask, FastAPI
- **[Android](./android/)** - Native Android (Kotlin/Java)
- **[iOS](./ios/)** - Native iOS (Swift/Objective-C)

## Quick Links

- [JavaScript SDK Documentation](./js/README.md)
- [React SDK Documentation](./react/README.md)
- [Python SDK Documentation](./python/README.md)
- [NestJS SDK Documentation](./nestjs/README.md)

## Getting Started

Choose the SDK for your stack:

### JavaScript/TypeScript
```bash
npm install @error-tracker/js
```

### React
```bash
npm install @error-tracker/react @error-tracker/js
```

### Python
```bash
pip install error-tracker
```

### Android
Add to your `build.gradle.kts`:
```kotlin
dependencies {
    implementation("com.errortracker:sdk:1.0.0")
}
```

### iOS
Add via Swift Package Manager or CocoaPods (see [iOS README](./ios/README.md))

## Common Features

All SDKs provide:
- ✅ Automatic error capture
- ✅ Manual error reporting
- ✅ Context collection
- ✅ Environment configuration
- ✅ User tracking
- ✅ Custom metadata

## API Endpoint

All SDKs send errors to:
```
POST /api/errors/report
Authorization: Bearer <API_KEY>
```

Get your API key from your project settings in the dashboard.

