/**
 * Page Transition Animations
 * Smooth transitions between pages and routes
 * 
 * Physics: Uses gentleNormal, smoothNormal, and easings from physics layer
 */

import { Variants } from 'framer-motion';
import { gentleNormal, easings } from './physics';

/**
 * Standard page transition variants
 * 
 * Physics: easings.smooth (precise timing for page transitions)
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.4,
      ease: easings.sharp,
    },
  },
};

/**
 * Slide transition (for modal-like pages)
 * 
 * Physics: gentleNormal (luxurious 300-400ms feel)
 */
export const slideTransition: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: gentleNormal,
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: gentleNormal,
  },
};

/**
 * Depth-based forward transition (z-axis illusion)
 * Creates feeling of moving "into" content
 * 
 * Physics: gentleNormal for smooth depth perception
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={slideForward} initial="initial" animate="animate" exit="exit">
 *   Content moving forward
 * </motion.div>
 * ```
 */
export const slideForward: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: gentleNormal,
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

/**
 * Depth-based backward transition (z-axis illusion)
 * Creates feeling of moving "back" from content
 * 
 * Physics: gentleNormal for smooth depth perception
 */
export const slideBackward: Variants = {
  initial: {
    opacity: 0,
    scale: 1.1,
    y: -20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: gentleNormal,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

/**
 * Zoom in page transition (dramatic entrance)
 * 
 * Physics: gentleNormal with scale
 */
export const zoomIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: gentleNormal,
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

/**
 * Zoom out page transition (dramatic exit)
 * 
 * Physics: gentleNormal with scale
 */
export const zoomOut: Variants = {
  initial: {
    opacity: 0,
    scale: 1.2,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: gentleNormal,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};

/**
 * Fade-only transition (minimal, elegant)
 * Perfect for content that doesn't need movement
 * 
 * Physics: Smooth easing only
 */
export const fadeOnly: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
};
