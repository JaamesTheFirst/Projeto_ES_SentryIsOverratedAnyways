# 📱 Error Tracker iOS SDK

iOS SDK for the Error Management Platform. Works with native iOS apps (Swift/Objective-C).

## Installation

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/yourorg/error-tracker-ios.git", from: "1.0.0")
]
```

Or in Xcode:
1. File → Add Packages
2. Enter: `https://github.com/yourorg/error-tracker-ios.git`
3. Select version: `1.0.0`

### CocoaPods

Add to your `Podfile`:

```ruby
pod 'ErrorTracker', '~> 1.0.0'
```

Then run:
```bash
pod install
```

## Quick Start

### 1. Initialize in AppDelegate

```swift
import ErrorTracker

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        
        ErrorTracker.shared.initialize(
            apiKey: "err_abc123...", // Get from your project settings
            apiUrl: "https://api.yourdomain.com/api",
            environment: "production",
            release: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        )
        
        return true
    }
}
```

### 2. For SwiftUI Apps

```swift
import SwiftUI
import ErrorTracker

@main
struct MyApp: App {
    init() {
        ErrorTracker.shared.initialize(
            apiKey: "err_abc123...",
            apiUrl: "https://api.yourdomain.com/api"
        )
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

That's it! Uncaught exceptions are now automatically captured.

## Manual Error Capture

```swift
do {
    // your code
} catch {
    ErrorTracker.shared.captureError(
        error,
        severity: .error,
        metadata: [
            "feature": "payment",
            "userId": "user123"
        ]
    )
    // handle or rethrow
}
```

## Capture Messages

```swift
ErrorTracker.shared.captureMessage(
    "User completed checkout",
    severity: .info,
    metadata: ["orderId": "order123"]
)
```

## Set User Context

```swift
ErrorTracker.shared.setUser([
    "id": "user123",
    "email": "user@example.com",
    "username": "johndoe"
])
```

## Set Tags

```swift
ErrorTracker.shared.setTags([
    "feature": "checkout",
    "version": "2.0"
])
```

## Set Metadata

```swift
ErrorTracker.shared.setMetadata([
    "server": "api-1",
    "region": "us-east-1"
])
```

## Enable/Disable

```swift
#if DEBUG
ErrorTracker.shared.setEnabled(false)
#endif
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

