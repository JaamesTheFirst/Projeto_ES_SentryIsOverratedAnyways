"""Django integration for Error Tracker"""

from django.conf import settings
from django.core.exceptions import MiddlewareMixin
from .client import ErrorTracker

_tracker = ErrorTracker()


class ErrorTrackerMiddleware(MiddlewareMixin):
    """Django middleware for automatic error tracking"""

    def __init__(self, get_response):
        self.get_response = get_response
        # Initialize if not already done
        if not _tracker.config:
            api_key = getattr(settings, "ERROR_TRACKER_API_KEY", None)
            api_url = getattr(settings, "ERROR_TRACKER_API_URL", "http://localhost:3000/api")
            environment = getattr(settings, "ERROR_TRACKER_ENVIRONMENT", None)
            release = getattr(settings, "ERROR_TRACKER_RELEASE", None)

            if api_key:
                _tracker.init(
                    api_key=api_key,
                    api_url=api_url,
                    environment=environment,
                    release=release,
                )

    def process_exception(self, request, exception):
        """Capture exceptions in Django views"""
        if _tracker.config and _tracker.config.enabled:
            _tracker.capture_error(
                exception,
                severity="error",
                metadata={
                    "url": request.build_absolute_uri(),
                    "method": request.method,
                    "user_id": str(request.user.id) if request.user.is_authenticated else None,
                    "username": request.user.username if request.user.is_authenticated else None,
                },
            )
        # Return None to let Django handle the exception normally
        return None

