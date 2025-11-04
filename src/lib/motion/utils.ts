/**
 * Motion Utilities
 * Helper functions for motion patterns
 */

import { Variants } from 'framer-motion';

/**
 * Apply reduced motion preferences
 * Simplifies all animations to simple fades for accessibility
 */
export function withReducedMotion(variants: Variants, prefersReducedMotion: boolean): Variants {
  if (!prefersReducedMotion) return variants;

  // Simplify all animations to simple fades
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
}
