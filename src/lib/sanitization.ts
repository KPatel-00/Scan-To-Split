/**
 * Global XSS Sanitization Layer
 * Part 0, Section 9 - Security
 * 
 * Uses DOMPurify to sanitize all user-controlled strings before they enter the store.
 * This prevents XSS attacks while maintaining a seamless user experience.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a single string value
 * Strips all HTML tags and dangerous content
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') return '';
  
  // DOMPurify with strict configuration
  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });
  
  return sanitized.trim();
}

/**
 * Sanitizes all string properties in an object
 * Useful for sanitizing complex objects like items
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized;
}

/**
 * Validates and sanitizes numeric inputs
 * Ensures safe number parsing
 */
export function sanitizeNumber(value: number | string): number {
  if (typeof value === 'number') {
    return isFinite(value) ? value : 0;
  }
  
  const parsed = parseFloat(value);
  return isFinite(parsed) ? parsed : 0;
}

/**
 * Sanitizes category name specifically
 * Allows only alphanumeric, spaces, hyphens, and basic punctuation
 */
export function sanitizeCategoryName(name: string): string {
  const sanitized = sanitizeString(name);
  // Additional validation for category names
  return sanitized.replace(/[^a-zA-Z0-9\s\-&(),.']/g, '');
}
