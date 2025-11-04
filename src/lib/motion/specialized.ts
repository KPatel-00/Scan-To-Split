/**
 * Specialized Motion Patterns
 * Modals, overlays, sheets, and special UI elements
 * 
 * Physics: Uses bouncyNormal, smoothNormal, and easings from physics layer
 */

import { Variants } from 'framer-motion';
import { bouncyNormal, smoothNormal, easings } from './physics';

/**
 * Scale-in animation (for modals, popovers)
 * 
 * Physics: bouncyNormal (playful 200-300ms with overshoot)
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: bouncyNormal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Modal backdrop animation
 * 
 * Physics: easings.smooth (precise timing for backdrop)
 */
export const backdropFade: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: easings.smooth },
  },
};

/**
 * Modal panel animation (scale + fade)
 * 
 * Physics: smoothNormal (balanced 200-300ms feel)
 */
export const modalPanel: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

/**
 * Slide up animation (for bottom sheets, drawers)
 * 
 * Physics: smoothNormal (smooth glide)
 */
export const slideUp: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { duration: 0.3, ease: easings.smooth },
  },
};

/**
 * Slide down animation (for dropdowns, menus)
 * 
 * Physics: smoothNormal (balanced feel)
 */
export const slideDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

/**
 * Banner/Alert animation (slide from top)
 * 
 * Physics: smoothNormal (balanced feel)
 */
export const bannerSlide: Variants = {
  initial: {
    opacity: 0,
    y: -100,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.98,
    transition: { duration: 0.3, ease: easings.smooth },
  },
};

/**
 * Expand/collapse (for accordions, dropdowns)
 * 
 * Physics: easings.smooth (precise timing for height animations)
 */
export const expandCollapse: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

/**
 * Shimmer/loading state
 */
export const shimmer: Variants = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * Success state animation (checkmark, positive feedback)
 * 
 * Physics: bouncyNormal (playful celebration)
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={successState} initial="initial" animate="animate">
 *   ✓ Success!
 * </motion.div>
 * ```
 */
export const successState: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: bouncyNormal,
  },
};

/**
 * Error state animation (shake + fade in)
 * 
 * Physics: Shake animation with smooth easing
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={errorState} initial="initial" animate="animate">
 *   ✗ Error message
 * </motion.div>
 * ```
 */
export const errorState: Variants = {
  initial: {
    opacity: 0,
    x: 0,
  },
  animate: {
    opacity: 1,
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      opacity: { duration: 0.2 },
      x: { duration: 0.5, ease: easings.smooth },
    },
  },
};

/**
 * Pulse attention animation (for CTAs, notifications)
 * Subtle pulsing to draw attention
 * 
 * Usage:
 * ```tsx
 * <motion.button variants={pulseAttention} initial="initial" animate="animate">
 *   Important action
 * </motion.button>
 * ```
 */
export const pulseAttention: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

/**
 * Pulse opacity animation (for scroll hints, loading indicators)
 * Infinite opacity pulse to indicate interactivity or loading
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={pulseOpacity} animate="animate">
 *   Scroll to explore
 * </motion.div>
 * ```
 */
export const pulseOpacity: Variants = {
  animate: {
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Bounce Y animation (for scroll hints, down arrows)
 * Gentle vertical bounce to indicate scroll direction
 * Bounces DOWN (positive Y) to point user downward
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={bounceY} animate="animate">
 *   <ChevronDown />
 * </motion.div>
 * ```
 */
export const bounceY: Variants = {
  animate: {
    y: [0, 4, 0], // Bounce down (positive Y)
    transition: {
      duration: 1.5, // Match original ScrollHint timing
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Magnetic hover effect (premium button interaction)
 * Button subtly "pulls" toward cursor
 * 
 * Note: Requires custom implementation with mouse position
 * This is the base animation, combine with onMouseMove handler
 * 
 * Usage:
 * ```tsx
 * <motion.button
 *   whileHover={{ scale: 1.05 }}
 *   transition={smoothNormal}
 *   style={{ x: mouseX, y: mouseY }} // Track mouse position
 * >
 *   Magnetic button
 * </motion.button>
 * ```
 */
export const magneticHover = {
  maxDistance: 20, // Maximum pull distance in pixels
  strength: 0.3, // Pull strength (0-1)
  transition: smoothNormal,
};

/**
 * Slide left/right page transitions
 */
export const slideLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: { duration: 0.25, ease: easings.smooth },
  },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.25, ease: easings.smooth },
  },
};

/**
 * Parallax layer effect (depth-based scroll)
 * 
 * Creates subtle parallax scrolling for depth perception
 * Use with different multipliers for each layer
 * 
 * Note: Requires scroll position tracking
 * 
 * Usage:
 * ```tsx
 * const { scrollY } = useScroll();
 * const y = useTransform(scrollY, [0, 1000], [0, -200]);
 * 
 * <motion.div style={{ y }}>
 *   Background layer (moves slower)
 * </motion.div>
 * ```
 */
export const parallaxLayer = {
  background: 0.5,  // Moves at 50% of scroll speed
  midground: 0.75,  // Moves at 75% of scroll speed
  foreground: 1.0,  // Moves at 100% of scroll speed (normal)
  accent: 1.2,      // Moves faster than scroll (1.2x)
};
