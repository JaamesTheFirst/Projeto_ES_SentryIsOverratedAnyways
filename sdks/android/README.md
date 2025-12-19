# 📱 Error Tracker Android SDK

Android SDK for the Error Management Platform. Works with native Android apps (Java/Kotlin).

## Installation

### Gradle (Kotlin DSL)

Add to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.errortracker:sdk:1.0.0")
}
```

### Gradle (Groovy)

Add to your `build.gradle`:

```groovy
dependencies {
    implementation 'com.errortracker:sdk:1.0.0'
}
```

## Quick Start

### 1. Initialize in Application class

```kotlin
import com.errortracker.sdk.ErrorTracker

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        ErrorTracker.init(
            context = this,
            apiKey = "err_abc123...", // Get from your project settings
            apiUrl = "https://api.yourdomain.com/api",
            environment = "production",
            release = BuildConfig.VERSION_NAME,
        )
    }
}
```

### 2. Register in AndroidManifest.xml

```xml
<application
    android:name=".MyApplication"
    ...>
</application>
```

That's it! Uncaught exceptions are now automatically captured.

## Manual Error Capture

```kotlin
try {
    // your code
} catch (e: Exception) {
    ErrorTracker.captureError(e, ErrorSeverity.ERROR, mapOf(
        "feature" to "payment",
        "userId" to "user123"
    ))
    throw e // or handle it
}
```

## Capture Messages

```kotlin
ErrorTracker.captureMessage(
    "User completed checkout",
    ErrorSeverity.INFO,
    mapOf("orderId" to "order123")
)
```

## Set User Context

```kotlin
ErrorTracker.setUser(mapOf(
    "id" to "user123",
    "email" to "user@example.com",
    "username" to "johndoe"
))
```

## Set Tags

```kotlin
ErrorTracker.setTags(mapOf(
    "feature" to "checkout",
    "version" to "2.0"
))
```

## Set Metadata

```kotlin
ErrorTracker.setMetadata(mapOf(
    "server" to "api-1",
    "region" to "us-east-1"
))
```

## Enable/Disable

```kotlin
// Disable in debug builds
if (BuildConfig.DEBUG) {
    ErrorTracker.setEnabled(false)
}
```

## ProGuard Rules

Add to `proguard-rules.pro`:

```proguard
-keep class com.errortracker.sdk.** { *; }
-dontwarn com.errortracker.sdk.**
```

## Features

- ✅ Automatic uncaught exception capture
- ✅ Manual error reporting
- ✅ Context collection (device, OS, app version)
- ✅ User tracking
- ✅ Custom metadata
- ✅ Asynchronous error sending (non-blocking)

## License

MIT

