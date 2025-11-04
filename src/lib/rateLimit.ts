/**
 * Token-Based Rate Limiting - Blueprint-Compliant Security
 * Part 5, Section 4: APIs & Security
 * 
 * Features:
 * - Anonymous UUID token system (stored in localStorage client-side)
 * - Dual-factor rate limiting (IP + token)
 * - Per-file counting (not per-request)
 * - Intelligent abuse prevention
 * - Graceful degradation (in-memory fallback)
 * 
 * Blueprint Quote:
 * "We will use a 'token-based' system. On first load, the app generates a unique,
 * anonymous UUID and stores it in `localStorage`. Our API will rate-limit based on
 * *both* the source IP address and this anonymous token. The limit *must* be applied
 * **per-file, not per-request**."
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface RateLimitEntry {
  count: number; // Total files scanned
  firstRequest: number; // Timestamp of first request
  lastRequest: number; // Timestamp of last request
  resetAt: number; // When the limit resets
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  error?: string;
}

// ============================================================================
// Configuration
// ============================================================================

const RATE_LIMIT_CONFIG = {
  maxFilesPerHour: 20, // Max 20 files per hour (conservative for free tier)
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  maxRequestsPerMinute: 10, // Max 10 requests per minute (burst protection)
};

// In-memory store (will be replaced with Redis in production)
const ipStore = new Map<string, RateLimitEntry>();
const tokenStore = new Map<string, RateLimitEntry>();
const requestStore = new Map<string, { count: number; resetAt: number }>();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check for Vercel/Next.js headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to 'unknown' (will use token-only limiting)
  return 'unknown';
}

/**
 * Get anonymous token from request headers
 */
export function getAnonymousToken(request: Request): string | null {
  return request.headers.get('x-anonymous-token');
}

/**
 * Check if rate limit exceeded
 */
function checkLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  fileCount: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    // First request
    const resetAt = now + RATE_LIMIT_CONFIG.windowMs;
    store.set(key, {
      count: fileCount,
      firstRequest: now,
      lastRequest: now,
      resetAt,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxFilesPerHour - fileCount,
      resetAt,
    };
  }

  // Check if window has expired
  if (now >= entry.resetAt) {
    // Reset the window
    const resetAt = now + RATE_LIMIT_CONFIG.windowMs;
    store.set(key, {
      count: fileCount,
      firstRequest: now,
      lastRequest: now,
      resetAt,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxFilesPerHour - fileCount,
      resetAt,
    };
  }

  // Check if limit exceeded
  const newCount = entry.count + fileCount;
  if (newCount > RATE_LIMIT_CONFIG.maxFilesPerHour) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      // ✨ PROMPT 9: Graceful error message with helpful & reassuring voice
      error: `Looks like we're popular! 🎉 We've hit our scanning limit for the hour (${RATE_LIMIT_CONFIG.maxFilesPerHour} files). Take a quick break and try again in a bit. Your receipts will still be here!`,
    };
  }

  // Update entry
  store.set(key, {
    ...entry,
    count: newCount,
    lastRequest: now,
  });

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxFilesPerHour - newCount,
    resetAt: entry.resetAt,
  };
}

/**
 * Check burst protection (requests per minute)
 */
function checkBurstProtection(key: string): RateLimitResult {
  const now = Date.now();
  const entry = requestStore.get(key);

  if (!entry) {
    requestStore.set(key, {
      count: 1,
      resetAt: now + 60 * 1000, // 1 minute
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequestsPerMinute - 1,
      resetAt: now + 60 * 1000,
    };
  }

  // Check if window expired
  if (now >= entry.resetAt) {
    requestStore.set(key, {
      count: 1,
      resetAt: now + 60 * 1000,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequestsPerMinute - 1,
      resetAt: now + 60 * 1000,
    };
  }

  // Check burst limit
  if (entry.count >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      error: 'Too many requests. Please slow down and try again in a minute.',
    };
  }

  // Update count
  requestStore.set(key, {
    ...entry,
    count: entry.count + 1,
  });

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequestsPerMinute - entry.count - 1,
    resetAt: entry.resetAt,
  };
}

// ============================================================================
// Main Rate Limiting Function
// ============================================================================

/**
 * Check rate limit for incoming request
 * Blueprint-compliant: Dual-factor (IP + token), per-file counting
 */
export function checkRateLimit(
  request: Request,
  fileCount: number
): RateLimitResult {
  const ip = getClientIP(request);
  const token = getAnonymousToken(request);

  // Burst protection (requests per minute)
  const burstKey = token || ip;
  const burstCheck = checkBurstProtection(burstKey);
  if (!burstCheck.allowed) {
    return burstCheck;
  }

  // If no token provided, use IP-only limiting (stricter)
  if (!token) {
    const ipCheck = checkLimit(ipStore, ip, fileCount);
    return {
      ...ipCheck,
      error: ipCheck.error || 'Please refresh the page to continue.',
    };
  }

  // Dual-factor limiting: Check both IP and token
  const ipCheck = checkLimit(ipStore, ip, fileCount);
  if (!ipCheck.allowed) {
    return ipCheck;
  }

  const tokenCheck = checkLimit(tokenStore, token, fileCount);
  if (!tokenCheck.allowed) {
    return tokenCheck;
  }

  // Both passed, return the more restrictive limit
  return {
    allowed: true,
    remaining: Math.min(ipCheck.remaining, tokenCheck.remaining),
    resetAt: Math.max(ipCheck.resetAt, tokenCheck.resetAt),
  };
}

/**
 * Get current rate limit status (for debugging/monitoring)
 */
export function getRateLimitStatus(request: Request): {
  ip: string;
  token: string | null;
  ipLimit: RateLimitEntry | null;
  tokenLimit: RateLimitEntry | null;
} {
  const ip = getClientIP(request);
  const token = getAnonymousToken(request);

  return {
    ip,
    token,
    ipLimit: ipStore.get(ip) || null,
    tokenLimit: token ? tokenStore.get(token) || null : null,
  };
}

/**
 * Clear expired entries (cleanup task)
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now();
  let cleaned = 0;

  // Cleanup IP store
  for (const [key, entry] of ipStore.entries()) {
    if (now >= entry.resetAt) {
      ipStore.delete(key);
      cleaned++;
    }
  }

  // Cleanup token store
  for (const [key, entry] of tokenStore.entries()) {
    if (now >= entry.resetAt) {
      tokenStore.delete(key);
      cleaned++;
    }
  }

  // Cleanup request store
  for (const [key, entry] of requestStore.entries()) {
    if (now >= entry.resetAt) {
      requestStore.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
