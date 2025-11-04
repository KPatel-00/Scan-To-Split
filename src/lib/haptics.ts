/**
 * Haptic Feedback Utility
 * 
 * Provides tactile feedback for user interactions using the Vibration API.
 * Creates a physical connection between visual animations and user actions.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPattern {
  duration: number;
  intensity?: 'light' | 'heavy';
}

/**
 * Haptic feedback patterns for different interaction types
 */
const HAPTIC_PATTERNS: Record<HapticStyle, HapticPattern> = {
  // Subtle feedback for minor interactions (toggle switches, checkboxes)
  light: { duration: 10, intensity: 'light' },
  
  // Medium feedback for standard interactions (button presses)
  medium: { duration: 15, intensity: 'light' },
  
  // Strong feedback for major interactions (modal open/close, confirmations)
  heavy: { duration: 25, intensity: 'heavy' },
  
  // Success feedback (operations completed successfully)
  success: { duration: 20, intensity: 'light' },
  
  // Warning feedback (attention needed)
  warning: { duration: 30, intensity: 'heavy' },
  
  // Error feedback (something went wrong)
  error: { duration: 40, intensity: 'heavy' },
};

/**
 * Trigger haptic feedback with specified style
 * 
 * @param style - The type of haptic feedback to trigger
 * @returns Whether haptics were triggered successfully
 * 
 * @example
 * ```tsx
 * // Light tap feedback
 * triggerHaptic('light');
 * 
 * // Heavy feedback for modal dismiss
 * triggerHaptic('heavy');
 * 
 * // Success feedback after save
 * triggerHaptic('success');
 * ```
 */
export const triggerHaptic = (style: HapticStyle = 'light'): boolean => {
  // Check if Vibration API is supported
  if (!window.navigator.vibrate) {
    return false;
  }

  // Check if user prefers reduced motion (respect accessibility preferences)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return false;
  }

  const pattern = HAPTIC_PATTERNS[style];
  
  try {
    // Trigger vibration
    window.navigator.vibrate(pattern.duration);
    return true;
  } catch (error) {
    // Silently fail if vibration is blocked or fails
    console.warn('Haptic feedback failed:', error);
    return false;
  }
};

/**
 * Trigger a custom haptic pattern
 * 
 * @param pattern - Array of vibration durations and pauses [vibrate, pause, vibrate, ...]
 * 
 * @example
 * ```tsx
 * // Double tap pattern
 * triggerCustomHaptic([10, 50, 10]);
 * 
 * // Success pattern (short-long-short)
 * triggerCustomHaptic([10, 20, 30, 20, 10]);
 * ```
 */
export const triggerCustomHaptic = (pattern: number[]): boolean => {
  if (!window.navigator.vibrate) {
    return false;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return false;
  }

  try {
    window.navigator.vibrate(pattern);
    return true;
  } catch (error) {
    console.warn('Custom haptic pattern failed:', error);
    return false;
  }
};

/**
 * Cancel any ongoing haptic feedback
 */
export const cancelHaptic = (): void => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(0);
  }
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in window.navigator;
};

/**
 * Haptic feedback hooks for common interactions
 */
export const haptics = {
  // UI interactions
  tap: () => triggerHaptic('light'),
  press: () => triggerHaptic('medium'),
  toggle: () => triggerHaptic('light'),
  
  // Navigation
  modalOpen: () => triggerHaptic('heavy'),
  modalClose: () => triggerHaptic('medium'),
  
  // Feedback
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  
  // Selection
  select: () => triggerHaptic('light'),
  deselect: () => triggerHaptic('light'),
  
  // Gestures
  swipeStart: () => triggerHaptic('light'),
  swipeEnd: () => triggerHaptic('medium'),
} as const;
