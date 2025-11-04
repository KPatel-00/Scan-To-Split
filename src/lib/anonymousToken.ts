/**
 * Anonymous Token Management - Client-Side Security
 * Part 5, Section 4: APIs & Security
 * 
 * Features:
 * - UUID generation for anonymous users
 * - localStorage persistence
 * - Automatic token injection into API requests
 * - Privacy-first: No PII collected
 * 
 * Blueprint Quote:
 * "On first load, the app generates a unique, anonymous UUID and stores it
 * in `localStorage`. Our API will rate-limit based on *both* the source IP
 * address and this anonymous token."
 */

const ANONYMOUS_TOKEN_KEY = 'scantosplit-anonymous-token';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  // Use crypto API if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback to manual UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create anonymous token
 */
export function getAnonymousToken(): string {
  if (typeof window === 'undefined') {
    // SSR fallback (will be replaced on client)
    return 'ssr-token';
  }

  try {
    // Check if token exists
    const existingToken = localStorage.getItem(ANONYMOUS_TOKEN_KEY);
    if (existingToken) {
      return existingToken;
    }

    // Generate new token
    const newToken = generateUUID();
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, newToken);
    return newToken;
  } catch (e) {
    console.error('Failed to get anonymous token:', e);
    // Fallback to session-only token
    return `session-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }
}

/**
 * Reset anonymous token (for testing or privacy)
 */
export function resetAnonymousToken(): string {
  if (typeof window === 'undefined') return 'ssr-token';

  try {
    const newToken = generateUUID();
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, newToken);
    return newToken;
  } catch (e) {
    console.error('Failed to reset anonymous token:', e);
    return getAnonymousToken();
  }
}

/**
 * Check if anonymous token exists
 */
export function hasAnonymousToken(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(ANONYMOUS_TOKEN_KEY) !== null;
  } catch (e) {
    return false;
  }
}
