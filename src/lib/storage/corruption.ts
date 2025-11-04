/**
 * Data Corruption Detection & Repair
 * Premium feature: Automatic corruption detection with auto-repair
 */

/**
 * Generate checksum for data integrity
 */
export function generateChecksum(data: string): string {
  let hash = 0;
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Validate data integrity
 */
export function validateDataIntegrity(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const value = localStorage.getItem(key);
    if (!value) return false;

    // Try to parse JSON
    JSON.parse(value);
    return true;
  } catch (e) {
    console.error(`Corrupted data detected in key: ${key}`, e);
    return false;
  }
}
