/**
 * Storage Type Definitions
 * Shared types for storage management system
 */

export interface StorageQuota {
  used: number; // bytes
  available: number; // bytes
  total: number; // bytes
  percentage: number; // 0-100
  status: 'healthy' | 'warning' | 'critical' | 'full';
}

export interface StorageHealth {
  quota: StorageQuota;
  itemCount: number;
  corruptedKeys: string[];
  lastCheck: number;
  version: string;
  supportsIndexedDB: boolean;
}

export interface DataVersion {
  version: string;
  timestamp: number;
  checksum: string;
}

export interface StorageEvent {
  type: 'quota-warning' | 'quota-critical' | 'corruption-detected' | 'migration-needed';
  message: string;
  timestamp: number;
  data?: any;
}

// Current schema version (increment on breaking changes)
export const STORAGE_VERSION = '1.0.0';

// Storage thresholds
export const QUOTA_WARNING_THRESHOLD = 0.8; // 80%
export const QUOTA_CRITICAL_THRESHOLD = 0.95; // 95%

// Storage keys
export const VERSION_KEY = 'scantosplit-version';
export const HEALTH_KEY = 'scantosplit-health';
export const EVENTS_KEY = 'scantosplit-events';
