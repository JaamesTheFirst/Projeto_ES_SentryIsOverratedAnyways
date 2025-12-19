import Foundation
import UIKit

/**
 * Error Tracker SDK for iOS
 * 
 * Usage:
 * ```
 * ErrorTracker.shared.initialize(apiKey: "err_abc123...", apiUrl: "https://api.example.com/api")
 * ```
 */
public class ErrorTracker {
    public static let shared = ErrorTracker()
    
    private var config: Config?
    private var defaultExceptionHandler: NSUncaughtExceptionHandler?
    
    private init() {}
    
    /**
     * Initialize the SDK
     */
    public func initialize(
        apiKey: String,
        apiUrl: String = "http://localhost:3000/api",
        environment: String? = nil,
        release: String? = nil,
        enabled: Bool = true,
        user: [String: Any]? = nil,
        tags: [String: String]? = nil,
        metadata: [String: Any]? = nil
    ) {
        if config != nil {
            print("[ErrorTracker] SDK already initialized")
            return
        }
        
        if apiKey.isEmpty {
            fatalError("ErrorTracker: apiKey is required")
        }
        
        config = Config(
            apiKey: apiKey,
            apiUrl: apiUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/")),
            environment: environment,
            release: release ?? getAppVersion(),
            enabled: enabled,
            user: user ?? [:],
            tags: tags ?? [:],
            metadata: metadata ?? [:]
        )
        
        if enabled {
            setupAutomaticCapture()
        }
    }
    
    /**
     * Capture an error manually
     */
    public func captureError(
        _ error: Error,
        severity: ErrorSeverity = .error,
        metadata: [String: Any]? = nil
    ) {
        guard let config = self.config else {
            print("[ErrorTracker] SDK not initialized. Call initialize() first.")
            return
        }
        
        if !config.enabled {
            return
        }
        
        let errorData = buildErrorData(error: error, severity: severity, metadata: metadata, config: config)
        sendError(errorData, config: config)
    }
    
    /**
     * Capture a message (non-error)
     */
    public func captureMessage(
        _ message: String,
        severity: ErrorSeverity = .info,
        metadata: [String: Any]? = nil
    ) {
        guard let config = self.config else {
            print("[ErrorTracker] SDK not initialized. Call initialize() first.")
            return
        }
        
        if !config.enabled {
            return
        }
        
        let stackTrace = Thread.callStackSymbols.joined(separator: "\n")
        let errorData = ErrorData(
            errorType: "Message",
            message: message,
            stackTrace: stackTrace,
            severity: severity,
            metadata: buildMetadata(config: config, additionalMetadata: metadata)
        )
        
        sendError(errorData, config: config)
    }
    
    /**
     * Set user context
     */
    public func setUser(_ user: [String: Any]) {
        config?.user = user
    }
    
    /**
     * Set tags
     */
    public func setTags(_ tags: [String: String]) {
        guard var config = self.config else {
            print("[ErrorTracker] SDK not initialized. Call initialize() first.")
            return
        }
        config.tags.merge(tags) { (_, new) in new }
        self.config = config
    }
    
    /**
     * Set metadata
     */
    public func setMetadata(_ metadata: [String: Any]) {
        guard var config = self.config else {
            print("[ErrorTracker] SDK not initialized. Call initialize() first.")
            return
        }
        config.metadata.merge(metadata) { (_, new) in new }
        self.config = config
    }
    
    /**
     * Enable/disable the SDK
     */
    public func setEnabled(_ enabled: Bool) {
        config?.enabled = enabled
    }
    
    // MARK: - Private Methods
    
    private func setupAutomaticCapture() {
        // Capture uncaught exceptions
        NSSetUncaughtExceptionHandler { exception in
            ErrorTracker.shared.captureError(
                NSError(domain: exception.name.rawValue, code: 0, userInfo: [
                    NSLocalizedDescriptionKey: exception.reason ?? "Unknown exception"
                ]),
                severity: .critical
            )
        }
        
        // Capture Swift errors (via global error handler if available)
        // Note: Swift errors are harder to catch globally, so manual capture is recommended
    }
    
    private func buildErrorData(
        error: Error,
        severity: ErrorSeverity,
        metadata: [String: Any]?,
        config: Config
    ) -> ErrorData {
        let nsError = error as NSError
        let stackTrace = Thread.callStackSymbols.joined(separator: "\n")
        let errorInfo = extractErrorInfo(error: error, stackTrace: stackTrace)
        
        return ErrorData(
            errorType: errorInfo.errorType,
            message: errorInfo.message,
            stackTrace: stackTrace,
            severity: severity,
            file: errorInfo.file,
            line: errorInfo.line,
            functionName: errorInfo.functionName,
            metadata: buildMetadata(config: config, additionalMetadata: metadata)
        )
    }
    
    private func extractErrorInfo(error: Error, stackTrace: String) -> ErrorInfo {
        let nsError = error as NSError
        let errorType = String(describing: type(of: error))
        let message = nsError.localizedDescription
        
        // Try to extract file, line, and function from stack trace
        let stackLines = stackTrace.components(separatedBy: "\n")
        var file: String? = nil
        var line: Int? = nil
        var functionName: String? = nil
        
        if !stackLines.isEmpty {
            // Pattern: AppName 0x123456 functionName + 123
            let firstLine = stackLines[0]
            if let match = firstLine.range(of: #"(\w+)\s+\+\s+(\d+)"#, options: .regularExpression) {
                functionName = String(firstLine[..<match.lowerBound]).trimmingCharacters(in: .whitespaces)
                if let lineStr = firstLine[match].components(separatedBy: "+").last?.trimmingCharacters(in: .whitespaces),
                   let lineNum = Int(lineStr) {
                    line = lineNum
                }
            }
        }
        
        return ErrorInfo(
            errorType: errorType,
            message: message,
            file: file,
            line: line,
            functionName: functionName
        )
    }
    
    private func buildMetadata(config: Config, additionalMetadata: [String: Any]?) -> [String: Any] {
        var metadata: [String: Any] = [
            "os": "iOS",
            "osVersion": UIDevice.current.systemVersion,
            "deviceModel": UIDevice.current.model,
            "deviceName": UIDevice.current.name,
            "framework": "ios"
        ]
        
        if let environment = config.environment {
            metadata["environment"] = environment
        }
        
        if let release = config.release {
            metadata["release"] = release
        }
        
        if let userId = config.user["id"] {
            metadata["userId"] = userId
        }
        
        if let userName = config.user["username"] {
            metadata["userName"] = userName
        }
        
        if !config.tags.isEmpty {
            metadata["tags"] = config.tags
        }
        
        metadata.merge(config.metadata) { (_, new) in new }
        if let additional = additionalMetadata {
            metadata.merge(additional) { (_, new) in new }
        }
        
        return metadata
    }
    
    private func getAppVersion() -> String? {
        return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
    }
    
    private func sendError(_ errorData: ErrorData, config: Config) {
        let endpoint = "\(config.apiUrl)/errors/report"
        
        guard let url = URL(string: endpoint) else {
            print("[ErrorTracker] Invalid API URL: \(endpoint)")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(config.apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: errorData.toDictionary())
        } catch {
            print("[ErrorTracker] Failed to serialize error data: \(error)")
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("[ErrorTracker] Failed to send error: \(error.localizedDescription)")
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                print("[ErrorTracker] Failed to send error: HTTP \(httpResponse.statusCode)")
            }
        }.resume()
    }
    
    // MARK: - Data Structures
    
    private struct Config {
        let apiKey: String
        let apiUrl: String
        let environment: String?
        let release: String?
        var enabled: Bool
        var user: [String: Any]
        var tags: [String: String]
        var metadata: [String: Any]
    }
    
    private struct ErrorInfo {
        let errorType: String
        let message: String
        let file: String?
        let line: Int?
        let functionName: String?
    }
    
    private struct ErrorData {
        let errorType: String
        let message: String
        let stackTrace: String
        let severity: ErrorSeverity
        let file: String?
        let line: Int?
        let functionName: String?
        let metadata: [String: Any]
        
        func toDictionary() -> [String: Any] {
            var dict: [String: Any] = [
                "errorType": errorType,
                "message": message,
                "stackTrace": stackTrace,
                "severity": severity.rawValue
            ]
            
            if let file = file {
                dict["file"] = file
            }
            
            if let line = line {
                dict["line"] = line
            }
            
            if let functionName = functionName {
                dict["functionName"] = functionName
            }
            
            if !metadata.isEmpty {
                dict["metadata"] = metadata
            }
            
            return dict
        }
    }
    
    public enum ErrorSeverity: String {
        case critical = "critical"
        case error = "error"
        case warning = "warning"
        case info = "info"
    }
}

