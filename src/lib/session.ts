/**
 * Session Management for Anonymous Users
 * 
 * Provides session tracking, analytics, and metadata for V1.0 anonymous auth.
 * Designed for future upgrade to NextAuth.js in V2.0.
 * 
 * Features:
 * - Unique session ID generation
 * - Visit tracking (first visit, last visit, session count)
 * - Usage analytics (bills completed, items processed)
 * - Device/browser fingerprinting
 * - Session persistence across browser restarts
 * - Privacy-first: all data stored locally
 */

export interface SessionMetadata {
  sessionId: string;
  firstVisit: number; // timestamp
  lastVisit: number; // timestamp
  sessionCount: number; // total number of sessions
  billsCompleted: number; // total bills finalized
  itemsProcessed: number; // total items across all bills
  receiptsScanned: number; // total AI scans
  device: {
    userAgent: string;
    platform: string;
    language: string;
  };
  preferences: {
    hasCompletedOnboarding: boolean;
    dismissedWelcome: boolean;
    tourProgress: string[]; // completed tour IDs
  };
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `sess_${timestamp}_${randomStr}`;
}

/**
 * Get or create session metadata
 */
export function getSessionMetadata(): SessionMetadata {
  if (typeof window === 'undefined') {
    // SSR fallback
    return createDefaultMetadata();
  }

  const stored = localStorage.getItem('session-metadata');
  
  if (stored) {
    try {
      const metadata = JSON.parse(stored) as SessionMetadata;
      // Update last visit on load
      metadata.lastVisit = Date.now();
      metadata.sessionCount += 1;
      saveSessionMetadata(metadata);
      return metadata;
    } catch (e) {
      console.error('Failed to parse session metadata:', e);
      return createDefaultMetadata();
    }
  }
  
  // First visit
  return createDefaultMetadata();
}

/**
 * Create default metadata for new session
 */
function createDefaultMetadata(): SessionMetadata {
  const now = Date.now();
  const metadata: SessionMetadata = {
    sessionId: generateSessionId(),
    firstVisit: now,
    lastVisit: now,
    sessionCount: 1,
    billsCompleted: 0,
    itemsProcessed: 0,
    receiptsScanned: 0,
    device: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
      language: typeof navigator !== 'undefined' ? navigator.language : 'en',
    },
    preferences: {
      hasCompletedOnboarding: false,
      dismissedWelcome: false,
      tourProgress: [],
    },
  };
  
  saveSessionMetadata(metadata);
  return metadata;
}

/**
 * Save session metadata to localStorage
 */
export function saveSessionMetadata(metadata: SessionMetadata): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('session-metadata', JSON.stringify(metadata));
  } catch (e) {
    console.error('Failed to save session metadata:', e);
  }
}

/**
 * Update session activity (call on page navigation)
 */
export function updateSessionActivity(): void {
  const metadata = getSessionMetadata();
  metadata.lastVisit = Date.now();
  saveSessionMetadata(metadata);
}

/**
 * Increment bills completed counter
 */
export function incrementBillsCompleted(itemCount: number): void {
  const metadata = getSessionMetadata();
  metadata.billsCompleted += 1;
  metadata.itemsProcessed += itemCount;
  saveSessionMetadata(metadata);
}

/**
 * Increment receipts scanned counter
 */
export function incrementReceiptsScanned(count: number = 1): void {
  const metadata = getSessionMetadata();
  metadata.receiptsScanned += count;
  saveSessionMetadata(metadata);
}

/**
 * Mark onboarding as completed
 */
export function completeOnboarding(): void {
  const metadata = getSessionMetadata();
  metadata.preferences.hasCompletedOnboarding = true;
  saveSessionMetadata(metadata);
}

/**
 * Mark welcome modal as dismissed
 */
export function dismissWelcome(): void {
  const metadata = getSessionMetadata();
  metadata.preferences.dismissedWelcome = true;
  saveSessionMetadata(metadata);
}

/**
 * Add completed tour to progress
 */
export function addTourProgress(tourId: string): void {
  const metadata = getSessionMetadata();
  if (!metadata.preferences.tourProgress.includes(tourId)) {
    metadata.preferences.tourProgress.push(tourId);
    saveSessionMetadata(metadata);
  }
}

/**
 * Check if user is a first-time visitor
 */
export function isFirstTimeUser(): boolean {
  const metadata = getSessionMetadata();
  return metadata.sessionCount === 1 && !metadata.preferences.hasCompletedOnboarding;
}

/**
 * Check if user is a returning user
 */
export function isReturningUser(): boolean {
  const metadata = getSessionMetadata();
  return metadata.sessionCount > 1 || metadata.billsCompleted > 0;
}

/**
 * Get user tenure (days since first visit)
 */
export function getUserTenure(): number {
  const metadata = getSessionMetadata();
  const now = Date.now();
  const diff = now - metadata.firstVisit;
  return Math.floor(diff / (1000 * 60 * 60 * 24)); // days
}

/**
 * Get session stats for insights
 */
export function getSessionStats() {
  const metadata = getSessionMetadata();
  const tenure = getUserTenure();
  
  return {
    sessionId: metadata.sessionId,
    firstVisit: new Date(metadata.firstVisit),
    lastVisit: new Date(metadata.lastVisit),
    sessionCount: metadata.sessionCount,
    billsCompleted: metadata.billsCompleted,
    itemsProcessed: metadata.itemsProcessed,
    receiptsScanned: metadata.receiptsScanned,
    tenureDays: tenure,
    avgItemsPerBill: metadata.billsCompleted > 0 
      ? Math.round(metadata.itemsProcessed / metadata.billsCompleted) 
      : 0,
  };
}

/**
 * Clear all session data (factory reset)
 */
export function clearSessionData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('session-metadata');
  } catch (e) {
    console.error('Failed to clear session data:', e);
  }
}

/**
 * Export session data for backup
 */
export function exportSessionData(): string {
  const metadata = getSessionMetadata();
  return JSON.stringify(metadata, null, 2);
}

/**
 * Import session data from backup
 */
export function importSessionData(jsonData: string): boolean {
  try {
    const metadata = JSON.parse(jsonData) as SessionMetadata;
    
    // Validate structure
    if (!metadata.sessionId || !metadata.firstVisit) {
      throw new Error('Invalid session data format');
    }
    
    saveSessionMetadata(metadata);
    return true;
  } catch (e) {
    console.error('Failed to import session data:', e);
    return false;
  }
}
