/**
 * Centralized API Client for BigRock Backend
 */

// Replace this with the actual BigRock domain (or use an environment variable)
export const BIGROCK_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.adhvaithafoods.in';

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
  return text ? JSON.parse(text) : null;
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
