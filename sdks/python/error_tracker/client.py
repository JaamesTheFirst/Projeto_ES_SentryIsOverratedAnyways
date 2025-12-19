"""Main Error Tracker client"""

import sys
import traceback
import platform
from typing import Optional, Dict, Any
import requests
from .types import SDKConfig, ErrorData, ErrorSeverity


class ErrorTracker:
    """Error Tracker client"""

    def __init__(self):
        self.config: Optional[SDKConfig] = None
        self._original_excepthook = None

    def init(
        self,
        api_key: str,
        api_url: str = "http://localhost:3000/api",
        environment: Optional[str] = None,
        release: Optional[str] = None,
        enabled: bool = True,
        ignore_errors: Optional[list] = None,
        sample_rate: float = 1.0,
        user: Optional[Dict[str, Any]] = None,
        tags: Optional[Dict[str, str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        before_send: Optional[callable] = None,
    ):
        """Initialize the SDK"""
        if self.config:
            print("[ErrorTracker] SDK already initialized")
            return

        if not api_key:
            raise ValueError("ErrorTracker: api_key is required")

        self.config = SDKConfig(
            api_key=api_key,
            api_url=api_url,
            environment=environment,
            release=release,
            enabled=enabled,
            ignore_errors=ignore_errors or [],
            sample_rate=sample_rate,
            user=user or {},
            tags=tags or {},
            metadata=metadata or {},
            before_send=before_send,
        )

        # Setup automatic error capture
        if self.config.enabled:
            self._setup_automatic_capture()

    def _setup_automatic_capture(self):
        """Setup automatic exception capture"""
        self._original_excepthook = sys.excepthook

        def custom_excepthook(exc_type, exc_value, exc_traceback):
            # Call original handler first
            if self._original_excepthook:
                self._original_excepthook(exc_type, exc_value, exc_traceback)

            # Capture the error
            if self.config and self.config.enabled:
                self.capture_error(exc_value, "error")

        sys.excepthook = custom_excepthook

    def _should_ignore_error(self, error: Exception) -> bool:
        """Check if error should be ignored"""
        if not self.config or not self.config.ignore_errors:
            return False

        error_message = str(error).lower()
        error_type = type(error).__name__.lower()

        for pattern in self.config.ignore_errors:
            if isinstance(pattern, str):
                if pattern.lower() in error_message or pattern.lower() in error_type:
                    return True
            elif hasattr(pattern, "search"):  # regex pattern
                if pattern.search(str(error)):
                    return True

        return False

    def _extract_error_info(self, error: Exception) -> Dict[str, Any]:
        """Extract error information"""
        error_type = type(error).__name__
        message = str(error)
        stack_trace = "".join(traceback.format_exception(type(error), error, error.__traceback__))

        # Try to extract file and line from traceback
        file: Optional[str] = None
        line: Optional[int] = None
        function_name: Optional[str] = None

        if error.__traceback__:
            tb = error.__traceback__
            # Get the first frame
            if tb.tb_frame:
                frame = tb.tb_frame
                file = frame.f_code.co_filename.split("/")[-1]  # Get filename only
                line = tb.tb_lineno
                function_name = frame.f_code.co_name

        return {
            "error_type": error_type,
            "message": message,
            "stack_trace": stack_trace,
            "file": file,
            "line": line,
            "function_name": function_name,
        }

    def _collect_context(self) -> Dict[str, Any]:
        """Collect system context"""
        context = {
            "os": platform.system(),
            "os_version": platform.release(),
            "python_version": platform.python_version(),
        }

        return context

    def capture_error(
        self,
        error: Exception,
        severity: ErrorSeverity = "error",
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """Capture an error"""
        if not self.config or not self.config.enabled:
            return

        # Check if should ignore
        if self._should_ignore_error(error):
            return

        # Sample rate check
        import random
        if random.random() > self.config.sample_rate:
            return

        # Extract error info
        error_info = self._extract_error_info(error)

        # Collect context
        context = self._collect_context()
        context.update({
            "environment": self.config.environment,
            "release": self.config.release,
            "framework": self._detect_framework(),
        })

        # Add user info
        if self.config.user:
            if "id" in self.config.user:
                context["userId"] = self.config.user["id"]
            if "username" in self.config.user:
                context["userName"] = self.config.user["username"]

        # Add tags
        if self.config.tags:
            context["tags"] = self.config.tags

        # Add metadata
        context.update(self.config.metadata)
        if metadata:
            context.update(metadata)

        # Build error data
        error_data = ErrorData(
            error_type=error_info["error_type"],
            message=error_info["message"],
            stack_trace=error_info["stack_trace"],
            severity=severity,
            file=error_info["file"],
            line=error_info["line"],
            function_name=error_info["function_name"],
            metadata=context,
        )

        # Apply before_send hook
        if self.config.before_send:
            result = self.config.before_send(error_data)
            if result is None:
                return  # Filtered out
            error_data = result

        # Send error
        self._send_error(error_data)

    def capture_message(
        self,
        message: str,
        severity: ErrorSeverity = "info",
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """Capture a message"""
        if not self.config or not self.config.enabled:
            return

        context = self._collect_context()
        context.update({
            "environment": self.config.environment,
            "release": self.config.release,
            "framework": self._detect_framework(),
        })

        if self.config.user:
            if "id" in self.config.user:
                context["userId"] = self.config.user["id"]
            if "username" in self.config.user:
                context["userName"] = self.config.user["username"]

        if self.config.tags:
            context["tags"] = self.config.tags

        context.update(self.config.metadata)
        if metadata:
            context.update(metadata)

        error_data = ErrorData(
            error_type="Message",
            message=message,
            stack_trace="".join(traceback.format_stack()),
            severity=severity,
            metadata=context,
        )

        if self.config.before_send:
            result = self.config.before_send(error_data)
            if result is None:
                return
            error_data = result

        self._send_error(error_data)

    def _detect_framework(self) -> Optional[str]:
        """Detect the framework being used"""
        try:
            import django
            return "django"
        except ImportError:
            pass

        try:
            import flask
            return "flask"
        except ImportError:
            pass

        try:
            import fastapi
            return "fastapi"
        except ImportError:
            pass

        return None

    def _send_error(self, error_data: ErrorData):
        """Send error to API"""
        if not self.config:
            return

        endpoint = f"{self.config.api_url}/errors/report"

        try:
            response = requests.post(
                endpoint,
                json=error_data.to_dict(),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.config.api_key}",
                },
                timeout=5,
            )

            if not response.ok:
                print(f"[ErrorTracker] Failed to send error: {response.status_code}")
        except Exception as e:
            # Silently fail - don't break the app
            print(f"[ErrorTracker] Failed to send error: {e}")

    def set_user(self, user: Dict[str, Any]):
        """Set user context"""
        if not self.config:
            print("[ErrorTracker] SDK not initialized. Call init() first.")
            return
        self.config.user = user

    def set_tags(self, tags: Dict[str, str]):
        """Set tags"""
        if not self.config:
            print("[ErrorTracker] SDK not initialized. Call init() first.")
            return
        self.config.tags = {**self.config.tags, **tags}

    def set_metadata(self, metadata: Dict[str, Any]):
        """Set metadata"""
        if not self.config:
            print("[ErrorTracker] SDK not initialized. Call init() first.")
            return
        self.config.metadata = {**self.config.metadata, **metadata}

    def set_enabled(self, enabled: bool):
        """Enable/disable the SDK"""
        if not self.config:
            print("[ErrorTracker] SDK not initialized. Call init() first.")
            return
        self.config.enabled = enabled

