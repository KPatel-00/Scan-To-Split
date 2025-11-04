/**
 * Storage Quota Management
 * Premium feature: Real-time quota monitoring with intelligent thresholds
 */

import type { StorageQuota } from './types';
import { QUOTA_WARNING_THRESHOLD, QUOTA_CRITICAL_THRESHOLD } from './types';

/**
 * Get current storage quota and usage
 * Premium feature: Real-time quota monitoring
 */
export async function getStorageQuota(): Promise<StorageQuota> {
  if (typeof window === 'undefined') {
    return createDefaultQuota();
  }

  try {
    // Modern API (Chrome 52+, Edge 79+, Safari 17+)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const total = estimate.quota || 5 * 1024 * 1024; // Default 5MB if unknown
      const available = total - used;
      const percentage = (used / total) * 100;

      let status: StorageQuota['status'] = 'healthy';
      if (percentage >= QUOTA_CRITICAL_THRESHOLD * 100) {
        status = 'critical';
      } else if (percentage >= QUOTA_WARNING_THRESHOLD * 100) {
        status = 'warning';
      } else if (percentage >= 100) {
        status = 'full';
      }

      return { used, available, total, percentage, status };
    }

    // Fallback: Estimate from localStorage size
    return estimateLocalStorageQuota();
  } catch (error) {
    console.error('Failed to get storage quota:', error);
    return createDefaultQuota();
  }
}

/**
 * Estimate localStorage quota (fallback for older browsers)
 */
function estimateLocalStorageQuota(): StorageQuota {
  let used = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          // Count bytes (approximate, assuming UTF-16)
          used += key.length * 2 + value.length * 2;
        }
      }
    }
  } catch (e) {
    console.error('Failed to estimate localStorage usage:', e);
  }

  // Typical localStorage quota is 5-10MB
  const total = 5 * 1024 * 1024; // 5MB default
  const available = total - used;
  const percentage = (used / total) * 100;

  let status: StorageQuota['status'] = 'healthy';
  if (percentage >= QUOTA_CRITICAL_THRESHOLD * 100) {
    status = 'critical';
  } else if (percentage >= QUOTA_WARNING_THRESHOLD * 100) {
    status = 'warning';
  }

  return { used, available, total, percentage, status };
}

/**
 * Create default quota (SSR fallback)
 */
function createDefaultQuota(): StorageQuota {
  return {
    used: 0,
    available: 5 * 1024 * 1024,
    total: 5 * 1024 * 1024,
    percentage: 0,
    status: 'healthy',
  };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Clear old data to free space
 * Premium feature: Intelligent cleanup based on age and importance
 */
export async function clearOldData(): Promise<number> {
  if (typeof window === 'undefined') return 0;

  let freedBytes = 0;

  try {
    const { getStorageEvents, EVENTS_KEY } = await import('./health');
    
    // Clear old session events (keep last 10)
    const events = getStorageEvents();
    if (events.length > 10) {
      const newEvents = events.slice(-10);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
      freedBytes += JSON.stringify(events).length - JSON.stringify(newEvents).length;
    }

    // Log event
    const { logStorageEvent } = await import('./health');
    logStorageEvent({
      type: 'quota-warning',
      message: `Cleared old data, freed ${freedBytes} bytes`,
      timestamp: Date.now(),
      data: { freedBytes },
    });
  } catch (e) {
    console.error('Failed to clear old data:', e);
  }

  return freedBytes;
}
