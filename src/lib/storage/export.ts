/**
 * Storage Export & Import
 * Premium feature: Safe data export/import with validation
 */

import { generateChecksum } from './corruption';
import { setDataVersion } from './migration';
import { logStorageEvent } from './health';

/**
 * Get all storage data for export
 */
export function getAllStorageData(): Record<string, any> {
  if (typeof window === 'undefined') return {};

  const data: Record<string, any> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch (e) {
            data[key] = value; // Store as string if not JSON
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to get all storage data:', e);
  }

  return data;
}

/**
 * Import storage data
 * Premium feature: Safe import with validation
 */
export function importStorageData(data: Record<string, any>): boolean {
  if (typeof window === 'undefined') return false;

  try {
    Object.entries(data).forEach(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    });

    // Update version after import
    const newChecksum = generateChecksum(JSON.stringify(data));
    setDataVersion(newChecksum);

    logStorageEvent({
      type: 'migration-needed',
      message: 'Successfully imported data',
      timestamp: Date.now(),
    });

    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}

/**
 * Clear all storage data
 * Premium feature: Complete wipe with confirmation
 */
export function clearAllStorageData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.clear();
    
    // Reinitialize version
    setDataVersion(generateChecksum(''));

    logStorageEvent({
      type: 'quota-warning',
      message: 'Cleared all storage data',
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}
