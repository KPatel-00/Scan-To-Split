/**
 * Storage Management Module - Ultimate Premium Client-Side Persistence
 * Part 5, Section 3: Database (V1.0 - localStorage + IndexedDB fallback)
 * 
 * Features:
 * - Storage quota monitoring & management
 * - Data versioning & automatic migration
 * - Corruption detection & auto-repair
 * - Graceful degradation (localStorage → IndexedDB → memory)
 * - Export/import with compression
 * - Storage health dashboard
 * - Privacy-first: 100% client-side
 * 
 * Blueprint Compliance:
 * - V1.0: No database, all data in Zustand + localStorage
 * - V2.0 Ready: Easy migration path to PostgreSQL/MongoDB
 */

// Type definitions
export type {
  StorageQuota,
  StorageHealth,
  DataVersion,
  StorageEvent,
} from './types';

export {
  STORAGE_VERSION,
  QUOTA_WARNING_THRESHOLD,
  QUOTA_CRITICAL_THRESHOLD,
  VERSION_KEY,
  HEALTH_KEY,
  EVENTS_KEY,
} from './types';

// Quota management
export {
  getStorageQuota,
  formatBytes,
  formatPercentage,
  clearOldData,
} from './quota';

// Health monitoring
export {
  checkStorageHealth,
  getLastHealthReport,
  logStorageEvent,
  getStorageEvents,
} from './health';

// Corruption detection
export {
  generateChecksum,
  validateDataIntegrity,
} from './corruption';

// Migration
export {
  getDataVersion,
  setDataVersion,
  needsMigration,
  migrateData,
} from './migration';

// Export/Import
export {
  getAllStorageData,
  importStorageData,
  clearAllStorageData,
} from './export';
