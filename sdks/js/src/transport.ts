import { ErrorData, SDKConfig } from './types';

/**
 * Sends error data to the API
 */
export async function sendError(
  config: SDKConfig,
  errorData: ErrorData,
): Promise<void> {
  if (!config.enabled) {
    return;
  }

  // Sample rate check
  if (config.sampleRate !== undefined && Math.random() > config.sampleRate) {
    return;
  }

  const apiUrl = config.apiUrl || 'http://localhost:3000/api';
  const endpoint = `${apiUrl}/errors/report`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      console.warn('[ErrorTracker] Failed to send error:', response.statusText);
    }
  } catch (error) {
    // Silently fail - we don't want error tracking to break the app
    console.warn('[ErrorTracker] Failed to send error:', error);
  }
}

