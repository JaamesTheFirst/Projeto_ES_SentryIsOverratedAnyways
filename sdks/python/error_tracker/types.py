"""Type definitions for the Error Tracker SDK"""

from typing import Optional, Dict, Any, Literal
from enum import Enum

ErrorSeverity = Literal["critical", "error", "warning", "info"]


class SDKConfig:
    """SDK configuration"""

    def __init__(
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
        self.api_key = api_key
        self.api_url = api_url.rstrip("/")
        self.environment = environment
        self.release = release
        self.enabled = enabled
        self.ignore_errors = ignore_errors or []
        self.sample_rate = sample_rate
        self.user = user or {}
        self.tags = tags or {}
        self.metadata = metadata or {}
        self.before_send = before_send


class ErrorData:
    """Error data structure"""

    def __init__(
        self,
        error_type: str,
        message: str,
        stack_trace: str,
        severity: ErrorSeverity = "error",
        file: Optional[str] = None,
        line: Optional[int] = None,
        function_name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        self.error_type = error_type
        self.message = message
        self.stack_trace = stack_trace
        self.severity = severity
        self.file = file
        self.line = line
        self.function_name = function_name
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API"""
        return {
            "errorType": self.error_type,
            "message": self.message,
            "stackTrace": self.stack_trace,
            "severity": self.severity,
            **({"file": self.file} if self.file else {}),
            **({"line": self.line} if self.line else {}),
            **({"functionName": self.function_name} if self.function_name else {}),
            **({"metadata": self.metadata} if self.metadata else {}),
        }

