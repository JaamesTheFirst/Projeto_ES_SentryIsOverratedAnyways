"""
Error Tracker Python SDK

A Python SDK for the Error Management Platform.
Supports Django, Flask, FastAPI, and standalone Python applications.
"""

from .client import ErrorTracker
from .types import ErrorSeverity

__version__ = "1.0.0"
__all__ = ["ErrorTracker", "ErrorSeverity", "init", "capture_error", "capture_message", "set_user", "set_tags", "set_metadata", "set_enabled"]

# Create singleton instance
_tracker = ErrorTracker()

# Export convenience functions
def init(**kwargs):
    """Initialize the SDK"""
    _tracker.init(**kwargs)

def capture_error(error, severity="error", metadata=None):
    """Capture an error"""
    _tracker.capture_error(error, severity, metadata)

def capture_message(message, severity="info", metadata=None):
    """Capture a message"""
    _tracker.capture_message(message, severity, metadata)

def set_user(user):
    """Set user context"""
    _tracker.set_user(user)

def set_tags(tags):
    """Set tags"""
    _tracker.set_tags(tags)

def set_metadata(metadata):
    """Set metadata"""
    _tracker.set_metadata(metadata)

def set_enabled(enabled):
    """Enable/disable the SDK"""
    _tracker.set_enabled(enabled)

