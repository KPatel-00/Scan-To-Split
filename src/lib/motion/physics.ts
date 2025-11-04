/**
 * Core Spring Physics Configuration
 * 
 * Raw spring values without semantic meaning.
 * Use these to build use-case-specific presets.
 * 
 * Naming convention: <feel><speed>
 * - Feel: snappy, smooth, bouncy, gentle
 * - Speed: fast, normal, slow
 * 
 * Usage:
 * ```tsx
 * // Don't use these directly in components
 * import { smoothNormal } from '@/lib/motion/physics';
 * 
 * // Instead, use in use-case preset files
 * export const buttonTactile = {
 *   whileTap: { scale: 0.95 },
 *   transition: smoothNormal,  // ← Composition
 * };
 * ```
 * 
 * @module motion/physics
 * @see src/lib/motion/tactile.ts - Example of physics composition
 */

import { Transition } from 'framer-motion';

// ============================================================================
// SNAPPY SPRINGS (High responsiveness)
// ============================================================================

/**
 * Ultra-responsive spring for immediate feedback
 * 
 * Feel: 100-150ms perceived duration
 * Use for: Icon buttons, toggles, immediate UI responses
 * 
 * @example
 * const iconHover = {
 *   whileHover: { scale: 1.1 },
 *   transition: snappyFast,
 * };
 */
export const snappyFast: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

/**
 * Responsive spring for toggles and switches
 * 
 * Feel: 150-200ms perceived duration
 * Use for: Checkboxes, radio buttons, small interactive elements
 * 
 * @example
 * const toggleAnimation = {
 *   transition: snappyNormal,
 * };
 */
export const snappyNormal: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
  mass: 0.6,
};

// ============================================================================
// SMOOTH SPRINGS (Balanced feel - MOST COMMON)
// ============================================================================

/**
 * Premium default spring for most UI elements
 * 
 * Feel: 200-300ms perceived duration
 * Use for: Buttons, tabs, most interactive elements
 * 
 * @example
 * const buttonPress = {
 *   whileTap: { scale: 0.95 },
 *   transition: smoothNormal,
 * };
 */
export const smoothNormal: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 0.8,
};

/**
 * Slower smooth spring for heavier elements
 * 
 * Feel: 250-350ms perceived duration
 * Use for: Cards, panels, modals
 * 
 * @example
 * const cardHover = {
 *   whileHover: { y: -4, scale: 1.02 },
 *   transition: smoothSlow,
 * };
 */
export const smoothSlow: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 25,
  mass: 0.8,
};

// ============================================================================
// BOUNCY SPRINGS (Playful, attention-grabbing)
// ============================================================================

/**
 * Bouncy spring with overshoot for emphasis
 * 
 * Feel: 200-300ms with playful bounce
 * Use for: Success states, celebrations, attention-grabbing elements
 * 
 * @example
 * const successBadge = {
 *   animate: { scale: 1 },
 *   transition: bouncyNormal,
 * };
 */
export const bouncyNormal: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 20,  // Lower damping = more bounce
  mass: 0.6,
};

/**
 * Soft bounce for subtle playfulness
 * 
 * Feel: 250-350ms with gentle overshoot
 * Use for: Confirmations, positive feedback
 * 
 * @example
 * const confirmButton = {
 *   whileTap: { scale: 0.95 },
 *   transition: bouncySlow,
 * };
 */
export const bouncySlow: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 22,
  mass: 0.7,
};

// ============================================================================
// GENTLE SPRINGS (Luxurious, slow)
// ============================================================================

/**
 * Gentle spring for large movements
 * 
 * Feel: 300-400ms luxurious feel
 * Use for: Page transitions, hero sections, large panel slides
 * 
 * @example
 * const pageEnter = {
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   transition: gentleNormal,
 * };
 */
export const gentleNormal: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 30,
  mass: 1,
};

// ============================================================================
// EASING CURVES (For tween animations)
// ============================================================================

/**
 * Predefined easing curves for non-spring animations
 * 
 * Use when you need precise control over timing without physics.
 * Prefer springs for most animations - they feel more natural.
 * 
 * @example
 * const fadeOut = {
 *   opacity: 0,
 *   transition: {
 *     duration: 0.3,
 *     ease: easings.smooth,
 *   },
 * };
 */
export const easings = {
  /** Smooth ease-out quart - Most versatile, use for exits and entrances */
  smooth: [0.22, 1, 0.36, 1] as const,
  
  /** Apple's signature easing - Premium feel for UI transitions */
  apple: [0.25, 0.1, 0.25, 1] as const,
  
  /** Sharp, decisive - Use for quick, snappy transitions */
  sharp: [0.4, 0.0, 0.6, 1] as const,
} as const;

// ============================================================================
// LEGACY ALIASES (For backward compatibility during migration)
// TODO: Remove after Phase 4 (inline violations fixed)
// ============================================================================

/** @deprecated Use smoothNormal instead */
export const premiumSpring = smoothNormal;

/** @deprecated Use smoothSlow instead */
export const gentleLand = smoothSlow;

/** @deprecated Use snappyFast instead */
export const quickTap = snappyFast;

/** @deprecated Use bouncyNormal instead */
export const popIn = bouncyNormal;

/** @deprecated Use easings.smooth instead */
export const smoothEasing = easings.smooth;
