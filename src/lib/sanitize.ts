/**
 * XSS Prevention Utility
 * 
 * Uses DOMPurify to sanitize all user-controlled input before storing in Zustand.
 * This prevents malicious scripts from being stored in localStorage and executed.
 * 
 * Attack Vectors:
 * 1. AI-scanned item names: "Pizza<script>alert(1)</script>"
 * 2. AI-scanned category names: "Food<img src=x onerror='...'>"
 * 3. AI-scanned store names: "ALDI<iframe>..."
 * 4. Manual participant names: "Alice<script>..."
 * 5. Manual item names (future): "Coffee<svg onload='...'>"
 * 
 * Configuration:
 * - ALLOWED_TAGS: [] (strip ALL HTML tags)
 * - ALLOWED_ATTR: [] (strip ALL attributes)
 * - KEEP_CONTENT: true (preserve text inside tags)
 * 
 * Example:
 *   Input:  "Item<script>alert('XSS')</script>"
 *   Output: "Itemalert('XSS')"  (script removed, text preserved)
 * 
 *   Input:  "<img src=x onerror='steal()'>Pizza"
 *   Output: "Pizza"
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize user input by stripping all HTML tags and attributes.
 * 
 * This function is used before saving ANY user-controlled text to Zustand state:
 * - Item names (AI scan or manual)
 * - Category names (AI scan)
 * - Store names (AI scan)
 * - Participant names (manual input)
 * 
 * @param input - The untrusted user input string
 * @returns Safe string with all HTML removed
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Configure DOMPurify to strip ALL HTML
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],      // No HTML tags allowed
    ALLOWED_ATTR: [],      // No attributes allowed
    KEEP_CONTENT: true,    // Preserve text content inside tags
  }).trim();

  return sanitized;
}

/**
 * Batch sanitize multiple strings (e.g., for AI scan results).
 * 
 * @param inputs - Array of untrusted strings
 * @returns Array of sanitized strings
 */
export function sanitizeBatch(inputs: string[]): string[] {
  return inputs.map(sanitizeInput);
}

/**
 * Sanitize object fields recursively.
 * Useful for sanitizing entire AI scan response objects.
 * 
 * @param obj - Object with potentially malicious string fields
 * @param fields - Array of field names to sanitize (e.g., ['name', 'storeName'])
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };

  fields.forEach((field) => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field]) as any;
    }
  });

  return sanitized;
}
