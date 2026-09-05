/**
 * Centralized API Client for BigRock Backend
 */

// Temporarily hardcoded to HTTP to bypass the broken SSL certificate on BigRock
export const BIGROCK_API_URL = 'https://api.adhvaithafoods.in';

/**
 * Generic GET request
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BIGROCK_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  // Some endpoints might return empty body on success (e.g. 200 OK without JSON)
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;
  
  if (parsed && typeof parsed === 'object' && 'success' in parsed && 'data' in parsed) {
    if (!parsed.success) {
      throw new Error(parsed.error || 'Backend API returned an error');
    }
    return parsed.data;
  }
  
  return parsed;
}

/**
 * Generic POST request
 */
export async function postApi(endpoint: string, body: any) {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
