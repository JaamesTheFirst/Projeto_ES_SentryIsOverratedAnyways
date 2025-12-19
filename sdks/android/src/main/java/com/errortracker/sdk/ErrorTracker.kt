package com.errortracker.sdk

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import com.google.gson.Gson
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Error Tracker SDK for Android
 * 
 * Usage:
 * ```
 * ErrorTracker.init(context, apiKey = "err_abc123...", apiUrl = "https://api.example.com/api")
 * ```
 */
object ErrorTracker {
    private var config: Config? = null
    private var defaultUncaughtExceptionHandler: Thread.UncaughtExceptionHandler? = null
    private val gson = Gson()
    private val client = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .writeTimeout(5, TimeUnit.SECONDS)
        .readTimeout(5, TimeUnit.SECONDS)
        .build()

    /**
     * Initialize the SDK
     */
    fun init(
        context: Context,
        apiKey: String,
        apiUrl: String = "http://localhost:3000/api",
        environment: String? = null,
        release: String? = null,
        enabled: Boolean = true,
        user: Map<String, Any>? = null,
        tags: Map<String, String>? = null,
        metadata: Map<String, Any>? = null,
    ) {
        if (config != null) {
            android.util.Log.w("ErrorTracker", "SDK already initialized")
            return
        }

        if (apiKey.isEmpty()) {
            throw IllegalArgumentException("ErrorTracker: apiKey is required")
        }

        config = Config(
            context = context,
            apiKey = apiKey,
            apiUrl = apiUrl.trimEnd('/'),
            environment = environment,
            release = release ?: getAppVersion(context),
            enabled = enabled,
            user = user ?: emptyMap(),
            tags = tags ?: emptyMap(),
            metadata = metadata ?: emptyMap(),
        )

        if (enabled) {
            setupAutomaticCapture()
        }
    }

    /**
     * Capture an error manually
     */
    fun captureError(
        error: Throwable,
        severity: ErrorSeverity = ErrorSeverity.ERROR,
        metadata: Map<String, Any>? = null,
    ) {
        val config = this.config ?: run {
            android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
            return
        }

        if (!config.enabled) {
            return
        }

        val errorData = buildErrorData(error, severity, metadata, config)
        sendError(errorData, config)
    }

    /**
     * Capture a message (non-error)
     */
    fun captureMessage(
        message: String,
        severity: ErrorSeverity = ErrorSeverity.INFO,
        metadata: Map<String, Any>? = null,
    ) {
        val config = this.config ?: run {
            android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
            return
        }

        if (!config.enabled) {
            return
        }

        val errorData = ErrorData(
            errorType = "Message",
            message = message,
            stackTrace = Thread.currentThread().stackTrace.joinToString("\n") { it.toString() },
            severity = severity,
            metadata = buildMetadata(config, metadata),
        )

        sendError(errorData, config)
    }

    /**
     * Set user context
     */
    fun setUser(user: Map<String, Any>) {
        config?.let {
            it.user = user
        } ?: android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
    }

    /**
     * Set tags
     */
    fun setTags(tags: Map<String, String>) {
        config?.let {
            it.tags = it.tags + tags
        } ?: android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
    }

    /**
     * Set metadata
     */
    fun setMetadata(metadata: Map<String, Any>) {
        config?.let {
            it.metadata = it.metadata + metadata
        } ?: android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
    }

    /**
     * Enable/disable the SDK
     */
    fun setEnabled(enabled: Boolean) {
        config?.let {
            it.enabled = enabled
        } ?: android.util.Log.w("ErrorTracker", "SDK not initialized. Call init() first.")
    }

    private fun setupAutomaticCapture() {
        defaultUncaughtExceptionHandler = Thread.getDefaultUncaughtExceptionHandler()

        Thread.setDefaultUncaughtExceptionHandler { thread, exception ->
            // Capture the error
            config?.let {
                captureError(exception, ErrorSeverity.CRITICAL)
            }

            // Call original handler
            defaultUncaughtExceptionHandler?.uncaughtException(thread, exception)
        }
    }

    private fun buildErrorData(
        error: Throwable,
        severity: ErrorSeverity,
        additionalMetadata: Map<String, Any>?,
        config: Config,
    ): ErrorData {
        val stackTrace = error.stackTraceToString()
        val errorInfo = extractErrorInfo(error, stackTrace)

        return ErrorData(
            errorType = errorInfo.errorType,
            message = errorInfo.message,
            stackTrace = stackTrace,
            severity = severity,
            file = errorInfo.file,
            line = errorInfo.line,
            functionName = errorInfo.functionName,
            metadata = buildMetadata(config, additionalMetadata),
        )
    }

    private fun extractErrorInfo(error: Throwable, stackTrace: String): ErrorInfo {
        val errorType = error.javaClass.simpleName
        val message = error.message ?: "Unknown error"

        // Try to extract file, line, and function from stack trace
        val stackLines = stackTrace.split("\n")
        var file: String? = null
        var line: Int? = null
        var functionName: String? = null

        if (stackLines.isNotEmpty()) {
            // Pattern: at com.package.Class.method(File.kt:123)
            val match = Regex("at\\s+[\\w.]+\\.[\\w]+\\(([^:]+):(\\d+)\\)").find(stackLines[0])
            if (match != null) {
                file = match.groupValues[1].split("/").last()
                line = match.groupValues[2].toIntOrNull()
                functionName = stackLines[0].substringBefore("(").substringAfterLast(".")
            }
        }

        return ErrorInfo(errorType, message, file, line, functionName)
    }

    private fun buildMetadata(
        config: Config,
        additionalMetadata: Map<String, Any>?,
    ): Map<String, Any> {
        val metadata = mutableMapOf<String, Any>(
            "os" to "Android",
            "osVersion" to Build.VERSION.RELEASE,
            "sdkVersion" to Build.VERSION.SDK_INT,
            "deviceModel" to Build.MODEL,
            "deviceManufacturer" to Build.MANUFACTURER,
            "framework" to "android",
        )

        config.environment?.let { metadata["environment"] = it }
        config.release?.let { metadata["release"] = it }

        config.user["id"]?.let { metadata["userId"] = it }
        config.user["username"]?.let { metadata["userName"] = it }

        if (config.tags.isNotEmpty()) {
            metadata["tags"] = config.tags
        }

        metadata.putAll(config.metadata)
        additionalMetadata?.let { metadata.putAll(it) }

        return metadata
    }

    private fun getAppVersion(context: Context): String? {
        return try {
            val packageInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            packageInfo.versionName
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    private fun sendError(errorData: ErrorData, config: Config) {
        val endpoint = "${config.apiUrl}/errors/report"
        val json = gson.toJson(errorData)

        val request = Request.Builder()
            .url(endpoint)
            .post(json.toRequestBody("application/json".toMediaType()))
            .addHeader("Authorization", "Bearer ${config.apiKey}")
            .addHeader("Content-Type", "application/json")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                android.util.Log.w("ErrorTracker", "Failed to send error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    android.util.Log.w("ErrorTracker", "Failed to send error: ${response.code}")
                }
                response.close()
            }
        })
    }

    private data class Config(
        val context: Context,
        val apiKey: String,
        val apiUrl: String,
        val environment: String?,
        val release: String?,
        var enabled: Boolean,
        var user: Map<String, Any>,
        var tags: Map<String, String>,
        var metadata: Map<String, Any>,
    )

    private data class ErrorInfo(
        val errorType: String,
        val message: String,
        val file: String?,
        val line: Int?,
        val functionName: String?,
    )

    private data class ErrorData(
        val errorType: String,
        val message: String,
        val stackTrace: String,
        val severity: ErrorSeverity,
        val file: String? = null,
        val line: Int? = null,
        val functionName: String? = null,
        val metadata: Map<String, Any>,
    )

    enum class ErrorSeverity {
        CRITICAL, ERROR, WARNING, INFO
    }
}

