import { BrowserContext } from './types';

/**
 * Collects browser context information
 */
export function collectBrowserContext(): BrowserContext {
  const context: BrowserContext = {
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  // Parse browser from user agent
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('chrome') && !ua.includes('edg')) {
      context.browser = 'Chrome';
    } else if (ua.includes('firefox')) {
      context.browser = 'Firefox';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      context.browser = 'Safari';
    } else if (ua.includes('edg')) {
      context.browser = 'Edge';
    }

    // Parse OS
    if (ua.includes('windows')) {
      context.os = 'Windows';
    } else if (ua.includes('mac')) {
      context.os = 'macOS';
    } else if (ua.includes('linux')) {
      context.os = 'Linux';
    } else if (ua.includes('android')) {
      context.os = 'Android';
    } else if (ua.includes('ios')) {
      context.os = 'iOS';
    }
  }

  // Screen resolution
  if (typeof window !== 'undefined' && window.screen) {
    context.screen = `${window.screen.width}x${window.screen.height}`;
  }

  return context;
}

