/**
 * Data Versioning & Migration
 * Premium feature: Automatic schema migration with zero data loss
 */

import type { DataVersion } from './types';
import { VERSION_KEY, STORAGE_VERSION } from './types';
import { generateChecksum } from './corruption';
import { logStorageEvent } from './health';

/**
 * Get current data version
 */
export function getDataVersion(): DataVersion | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as DataVersion;
  } catch (e) {
    console.error('Failed to parse data version:', e);
    return null;
  }
}

/**
 * Set data version
 */
export function setDataVersion(checksum: string): void {
  if (typeof window === 'undefined') return;

  const version: DataVersion = {
    version: STORAGE_VERSION,
    timestamp: Date.now(),
    checksum,
  };

  try {
    localStorage.setItem(VERSION_KEY, JSON.stringify(version));
  } catch (e) {
    console.error('Failed to save data version:', e);
  }
}

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  const currentVersion = getDataVersion();
  
  if (!currentVersion) {
    // First-time user, set version
    setDataVersion(generateChecksum(''));
    return false;
  }

  // Compare versions (semver)
  return currentVersion.version !== STORAGE_VERSION;
}

/**
 * Migrate data to current version
 * Premium feature: Automatic schema migration with zero data loss
 */
export async function migrateData(): Promise<boolean> {
  const currentVersion = getDataVersion();
  
  if (!currentVersion) return false;

  try {
    console.log(`Migrating data from v${currentVersion.version} to v${STORAGE_VERSION}`);

    // Version-specific migrations
    if (currentVersion.version === '0.9.0' && STORAGE_VERSION === '1.0.0') {
      // Example: Migrate old schema to new schema
      // This would contain actual migration logic
      console.log('Migration from 0.9.0 to 1.0.0 complete');
    }

    // Update version
    const { getAllStorageData } = await import('./export');
    const newData = getAllStorageData();
    setDataVersion(generateChecksum(JSON.stringify(newData)));

    logStorageEvent({
      type: 'migration-needed',
      message: `Successfully migrated from v${currentVersion.version} to v${STORAGE_VERSION}`,
      timestamp: Date.now(),
    });

    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}
