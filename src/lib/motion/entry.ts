/**
 * Content Entry Animations
 * Purposeful, graceful entrance animations for content and pages
 * 
 * Physics: Uses smoothSlow, smoothNormal, and easings from physics layer
 */

import { Variants, Transition } from 'framer-motion';
import { smoothSlow, smoothNormal, easings } from './physics';

/**
 * Page/Section entry animation (fade in + subtle slide up)
 * 
 * Physics: smoothSlow (gentle 250-350ms feel)
 */
export const contentEntry: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

/**
 * Premium easing curve for content entry
 * 
 * Physics: easings.smooth (ease-out quart)
 */
export const contentEntryTransition: Transition = {
  duration: 0.6,
  ease: easings.smooth,
};

/**
 * Staggered children animation (for lists and grids)
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12, // 120ms delay between each child
      delayChildren: 0.1, // 100ms delay - starts immediately
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1, // Reverse order on exit
    },
  },
};

/**
 * Child item for staggered lists
 * 
 * Physics: smoothSlow (gentle 250-350ms feel)
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

/**
 * Fade in + slide up animation (alias for contentEntry pattern)
 * Common pattern for sections, cards, and content blocks
 * 
 * Physics: gentleNormal (smooth 200-300ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div variants={fadeInUp}>
 * ```
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothNormal,
  },
};

/**
 * Scale + fade entry (for badges, pills, cards)
 * Used in: FeaturePill, ChapterBadge, small interactive elements
 * 
 * Physics: smoothNormal (balanced 200-300ms feel)
 */
export const scaleEntry: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Fast stagger for dense lists (e.g., 10+ items)
 */
export const fastStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04, // 40ms delay (faster)
      delayChildren: 0.05,
    },
  },
};

/**
 * Word-by-word reveal for hero headlines
 * Premium stagger for dramatic text reveals
 * 
 * Usage:
 * ```tsx
 * const words = "Split bills instantly".split(" ");
 * 
 * <motion.h1 variants={wordByWordContainer} initial="hidden" animate="visible">
 *   {words.map((word, i) => (
 *     <motion.span key={i} variants={wordByWordItem}>
 *       {word}
 *     </motion.span>
 *   ))}
 * </motion.h1>
 * ```
 */
export const wordByWordContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.08, // 80ms between words for dramatic effect
    },
  },
};

/**
 * Individual word reveal animation
 * 
 * Physics: smoothSlow (gentle 250-350ms feel)
 */
export const wordByWordItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

/**
 * Horizontal stagger (left to right)
 * 
 * Physics: smoothNormal (balanced 200-300ms feel)
 */
export const horizontalStaggerItem: Variants = {
  initial: {
    opacity: 0,
    x: -15,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: smoothNormal,
  },
  exit: {
    opacity: 0,
    x: 10,
  },
};

/**
 * Animated list item setup (convenience preset)
 */
export const animatedListItem = {
  variants: staggerItem,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
};

/**
 * Scroll-triggered viewport animations (whileInView)
 * Fade in + slide up when element enters viewport
 * 
 * Physics: smoothSlow (gentle 250-350ms feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div
 *   initial={scrollEntry.initial}
 *   whileInView={scrollEntry.animate}
 *   viewport={{ once: true, amount: 0.3 }}
 * >
 *   Content appears on scroll
 * </motion.div>
 * ```
 */
export const scrollEntry = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

/**
 * Scroll-triggered scale animation
 * Gentle zoom effect on scroll
 * 
 * Usage:
 * ```tsx
 * <motion.div
 *   initial={scrollScale.initial}
 *   whileInView={scrollScale.animate}
 *   viewport={{ once: true }}
 * >
 *   Scales up on scroll
 * </motion.div>
 * ```
 */
export const scrollScale = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

/**
 * Scroll-triggered fade only (no movement)
 * Subtle appearance without spatial motion
 * 
 * Usage:
 * ```tsx
 * <motion.div
 *   initial={scrollFade.initial}
 *   whileInView={scrollFade.animate}
 *   viewport={{ once: true }}
 * >
 *   Fades in on scroll
 * </motion.div>
 * ```
 */
export const scrollFade = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

/**
 * Common viewport settings for scroll animations
 */
export const viewportDefaults = {
  once: true, // Only animate once
  amount: 0.3, // Trigger when 30% visible
};

export const viewportHalf = {
  once: true,
  amount: 0.5, // Trigger when 50% visible
};
