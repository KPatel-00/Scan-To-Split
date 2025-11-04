import { sanitizeInput } from '../../../../lib/sanitize';

/**
 * Validates and sanitizes participant name input
 * @param name - Raw participant name input
 * @returns Sanitized name or null if invalid
 */
export function validateParticipantName(name: string): string | null {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return null;
  }
  
  if (sanitized.length > 50) {
    return null;
  }
  
  return sanitized;
}

/**
 * Validates group name input
 * @param name - Raw group name input
 * @returns Sanitized group name or null if invalid
 */
export function validateGroupName(name: string): string | null {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return null;
  }
  
  const sanitized = sanitizeInput(trimmed);
  
  if (!sanitized) {
    return null;
  }
  
  if (sanitized.length > 100) {
    return null;
  }
  
  return sanitized;
}
