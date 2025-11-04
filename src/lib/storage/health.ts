/**
 * Storage Health Monitoring
 * Premium feature: Comprehensive health check with auto-repair
 */

import type { StorageHealth, StorageEvent } from './types';
import { HEALTH_KEY, EVENTS_KEY, STORAGE_VERSION } from './types';
import { getStorageQuota } from './quota';
import { validateDataIntegrity } from './corruption';

/**
 * Check storage health
 * Premium feature: Comprehensive health check with auto-repair
 */
export async function checkStorageHealth(): Promise<StorageHealth> {
  const quota = await getStorageQuota();
  const corruptedKeys: string[] = [];
  let itemCount = 0;

  if (typeof window !== 'undefined') {
    try {
      // Check all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          itemCount++;
          
          // Validate integrity
          if (!validateDataIntegrity(key)) {
            corruptedKeys.push(key);
          }
        }
      }

      // Auto-repair corrupted keys
      if (corruptedKeys.length > 0) {
        console.warn(`Found ${corruptedKeys.length} corrupted keys, attempting repair...`);
        
        corruptedKeys.forEach((key) => {
          try {
            // Clear corrupted data (better than keeping corrupt data)
            localStorage.removeItem(key);
            console.log(`Cleared corrupted key: ${key}`);
          } catch (e) {
            console.error(`Failed to clear corrupted key: ${key}`, e);
          }
        });

        logStorageEvent({
          type: 'corruption-detected',
          message: `Detected and cleared ${corruptedKeys.length} corrupted storage keys`,
          timestamp: Date.now(),
          data: { keys: corruptedKeys },
        });
      }
    } catch (e) {
      console.error('Failed to check storage health:', e);
    }
  }

  const { getDataVersion } = await import('./migration');
  const currentVersion = getDataVersion();
  const supportsIndexedDB = typeof window !== 'undefined' && 'indexedDB' in window;

  const health: StorageHealth = {
    quota,
    itemCount,
    corruptedKeys,
    lastCheck: Date.now(),
    version: currentVersion?.version || STORAGE_VERSION,
    supportsIndexedDB,
  };

  // Save health report
  try {
    localStorage.setItem(HEALTH_KEY, JSON.stringify(health));
  } catch (e) {
    console.error('Failed to save health report:', e);
  }

  return health;
}

/**
 * Get last health report
 */
export function getLastHealthReport(): StorageHealth | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(HEALTH_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as StorageHealth;
  } catch (e) {
    console.error('Failed to parse health report:', e);
    return null;
  }
}

/**
 * Log storage event
 */
export function logStorageEvent(event: StorageEvent): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    const events: StorageEvent[] = stored ? JSON.parse(stored) : [];
    
    // Keep last 50 events
    events.push(event);
    if (events.length > 50) {
      events.shift();
    }

    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to log storage event:', e);
  }
}

/**
 * Get storage events
 */
export function getStorageEvents(): StorageEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get storage events:', e);
    return [];
  }
}

// Export EVENTS_KEY for use in other modules
export { EVENTS_KEY };
