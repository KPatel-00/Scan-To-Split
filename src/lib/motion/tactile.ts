/**
 * Tactile Feedback Animations
 * Interactive feedback for buttons, cards, and clickable elements
 * 
 * All patterns respect prefers-reduced-motion when used with helper hooks.
 * For auto-accessibility, use `useTactile()` hook from '@/hooks/useReducedMotion'
 * 
 * Physics: Uses smoothNormal, snappyFast, and snappyNormal from physics layer
 */

import { smoothNormal, snappyFast, snappyNormal } from './physics';

/**
 * Button tactile feedback (whileHover + whileTap)
 * Standard button interaction - noticeable but not jarring
 * 
 * Physics: smoothNormal (350 stiffness, 200-300ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.button whileHover={buttonTactile.hover} whileTap={buttonTactile.tap}>
 *   Click me
 * </motion.button>
 * ```
 */
export const buttonTactile = {
  hover: {
    scale: 1.03,
    transition: smoothNormal,
  },
  tap: {
    scale: 0.95,
    transition: smoothNormal,
  },
};

/**
 * Card/List item tactile feedback (more subtle)
 * Gentle lift and scale for cards that need elegance
 * 
 * Physics: smoothNormal (balanced 200-300ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div whileHover={cardTactile.hover} whileTap={cardTactile.tap}>
 *   Card content
 * </motion.div>
 * ```
 */
export const cardTactile = {
  hover: {
    y: -2,
    scale: 1.015,
    transition: smoothNormal,
  },
  tap: {
    scale: 0.99,
    transition: { duration: 0.1 },
  },
};

/**
 * Subtle feedback for less prominent interactive elements
 * Most common pattern across landing pages (1.02 / 0.98 scale)
 * Use for icons, badges, secondary actions, and CTA buttons
 * 
 * Physics: snappyNormal (responsive 150-200ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div whileHover={subtleTactile.hover} whileTap={subtleTactile.tap}>
 *   Icon or badge
 * </motion.div>
 * ```
 */
export const subtleTactile = {
  hover: {
    scale: 1.02,
    transition: snappyNormal,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08 },
  },
};

/**
 * Icon-only button feedback (more dramatic for small targets)
 * Use for icon buttons, close buttons, action icons
 * 
 * Physics: snappyFast (ultra-responsive 100-150ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.button whileHover={iconTactile.hover} whileTap={iconTactile.tap}>
 *   <XIcon />
 * </motion.button>
 * ```
 */
export const iconTactile = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: snappyFast,
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: { duration: 0.1 },
  },
};

/**
 * Badge/Tag tactile feedback (minimal, professional)
 * Very subtle for small UI elements
 * 
 * Physics: snappyNormal (responsive feel)
 * 
 * Usage:
 * ```tsx
 * <motion.span whileHover={badgeTactile.hover}>
 *   Premium
 * </motion.span>
 * ```
 */
export const badgeTactile = {
  hover: {
    scale: 1.05,
    transition: snappyNormal,
  },
  // No tap feedback for badges (typically not clickable)
};

/**
 * Premium card lift (dramatic elevation for hero cards)
 * More pronounced than cardTactile - use for featured content
 * 
 * Physics: smoothNormal (balanced feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div whileHover={premiumCardLift.hover} whileTap={premiumCardLift.tap}>
 *   Featured card
 * </motion.div>
 * ```
 */
export const premiumCardLift = {
  hover: {
    y: -8,
    scale: 1.01,
    transition: smoothNormal,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Focus state for keyboard navigation (accessibility)
 * Visible focus ring that animates in
 * 
 * Physics: snappyFast (immediate feedback)
 * 
 * Usage:
 * ```tsx
 * <motion.button whileFocus={focusState}>
 *   Keyboard accessible
 * </motion.button>
 * ```
 */
export const focusState = {
  scale: 1.02,
  transition: snappyFast,
};

/**
 * Preset combinations for common patterns
 * Spread these directly on motion components
 */
export const interactiveButton = {
  whileHover: buttonTactile.hover,
  whileTap: buttonTactile.tap,
};

export const interactiveCard = {
  whileHover: cardTactile.hover,
  whileTap: cardTactile.tap,
};

export const interactiveSubtle = {
  whileHover: subtleTactile.hover,
  whileTap: subtleTactile.tap,
};

export const interactiveIcon = {
  whileHover: iconTactile.hover,
  whileTap: iconTactile.tap,
};

export const interactiveBadge = {
  whileHover: badgeTactile.hover,
};

export const interactivePremiumCard = {
  whileHover: premiumCardLift.hover,
  whileTap: premiumCardLift.tap,
};

/**
 * Accessibility-aware helper
 * Returns empty object if user prefers reduced motion
 * 
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.button {...safeTactile(interactiveButton, prefersReducedMotion)}>
 *   Accessible button
 * </motion.button>
 * ```
 */
export function safeTactile(
  tactile: typeof interactiveButton | typeof interactiveCard | typeof interactiveSubtle,
  prefersReducedMotion: boolean
) {
  return prefersReducedMotion ? {} : tactile;
}