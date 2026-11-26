/**
 * Centralized API Client for BigRock Backend
 */

// Temporarily hardcoded to HTTP to bypass the broken SSL certificate on BigRock
export const BIGROCK_API_URL = 'http://api.adhvaithafoods.in';

/**
 * Emoji / non-English text safety.
 * The BigRock database turns emojis (and sometimes ₹ or Telugu letters) into "?".
 * So every non-ASCII character is stored as an ASCII code like "&#x1F336;" and turned back when read.
 */
export function encodeText(v: any): any {
  if (typeof v === 'string') {
    let out = ''
    for (const ch of v) {
      const cp = ch.codePointAt(0) || 0
      out += cp > 0x7e ? `&#x${cp.toString(16).toUpperCase()};` : ch
    }
    return out
  }
  if (Array.isArray(v)) return v.map(encodeText)
  if (v && typeof v === 'object') {
    const o: Record<string, any> = {}
    for (const [k, x] of Object.entries(v)) o[k] = encodeText(x)
    return o
  }
  return v
}

export function decodeText(v: any): any {
  if (typeof v === 'string') {
    return v.indexOf('&#x') < 0 ? v : v.replace(/&#x([0-9A-Fa-f]{1,6});/g, (m, h) => {
      const cp = parseInt(h, 16)
      try { return String.fromCodePoint(cp) } catch { return m }
    })
  }
  if (Array.isArray(v)) return v.map(decodeText)
  if (v && typeof v === 'object') {
    const o: Record<string, any> = {}
    for (const [k, x] of Object.entries(v)) o[k] = decodeText(x)
    return o
  }
  return v
}

/**
 * Generic GET request
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BIGROCK_API_URL}${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      // lets the BigRock server know this request comes from the admin (see app_settings.php)
      ...(typeof window === 'undefined' && process.env.BIGROCK_API_KEY ? { 'X-AJ-Key': process.env.BIGROCK_API_KEY } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  // Some endpoints might return empty body on success (e.g. 200 OK without JSON)
  const text = await response.text();
  const parsed = text ? decodeText(JSON.parse(text)) : null;
  
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
    body: JSON.stringify(encodeText(body)),
  });
}
