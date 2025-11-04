/**
 * Reduce Motion Detection Hook
 * 
 * Detects OS-level "Reduce Motion" preference and provides
 * appropriate transition settings for accessibility.
 * 
 * Blueprint Part 0, Section 2: Accessibility Mandate
 * Enhanced for Prompt 5: Full animation safety
 */

import { useEffect, useState } from 'react';
import { Transition, Variants } from 'framer-motion';

/**
 * Hook to detect user's reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Get appropriate transition based on reduced motion preference
 * Returns simple fade for reduced motion, spring physics for normal
 */
export function useMotionTransition(
  springTransition: Transition,
  options?: {
    duration?: number;
    ease?: string | number[];
  }
): Transition {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      duration: options?.duration || 0.2,
      ease: options?.ease || 'easeOut',
    };
  }

  return springTransition;
}

/**
 * Create safe animation variants that respect reduced motion preference
 * Removes spatial movement (x, y) and uses simple opacity fades
 * 
 * @example
 * ```tsx
 * const variants = useSafeVariants({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   exit: { opacity: 0, y: -20 }
 * });
 * // With reduced motion: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
 * ```
 */
export function useSafeVariants(variants: Variants): Variants {
  const prefersReducedMotion = useReducedMotion();

  if (!prefersReducedMotion) {
    return variants;
  }

  // Strip out spatial movement properties (x, y, scale) for reduced motion
  const safeVariants: Variants = {};
  
  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (typeof variant === 'object') {
      const { x, y, scale, rotate, ...safeProps } = variant as any;
      safeVariants[key] = safeProps;
    } else {
      safeVariants[key] = variant;
    }
  });

  return safeVariants;
}

/**
 * Get safe initial/animate props for motion components
 * Removes spatial movement for reduced motion users
 * 
 * @example
 * ```tsx
 * <motion.div {...useSafeMotionProps({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })} />
 * ```
 */
export function useSafeMotionProps(
  initial: any,
  animate: any,
  exit?: any
): { initial: any; animate: any; exit?: any; transition?: Transition } {
  const prefersReducedMotion = useReducedMotion();

  if (!prefersReducedMotion) {
    return { initial, animate, exit };
  }

  // Remove spatial properties
  const stripSpatial = (props: any) => {
    if (typeof props !== 'object') return props;
    const { x, y, scale, rotate, ...safe } = props;
    return safe;
  };

  return {
    initial: stripSpatial(initial),
    animate: stripSpatial(animate),
    exit: exit ? stripSpatial(exit) : undefined,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  };
}

/**
 * Conditionally disable layout animations for reduced motion
 */
export function useSafeLayout(): boolean | 'position' | 'size' {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? false : true;
}

/**
 * Get safe drag props for gesture interactions
 */
export function useSafeDrag(
  enabled: boolean | 'x' | 'y' = true
): false | 'x' | 'y' | boolean {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return false; // Disable drag gestures for reduced motion
  }
  
  return enabled;
}
