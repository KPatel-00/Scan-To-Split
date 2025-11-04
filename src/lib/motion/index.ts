/**
 * Motion Library - Barrel Export
 * Central hub for all Framer Motion animation patterns
 * 
 * Purpose: Consistent, reusable animations across the entire app
 * Philosophy: Apple iOS / Revolut-level buttery-smooth motion
 * 
 * Usage:
 * ```tsx
 * import { buttonTactile, modalPanel, layoutTransition } from '@/lib/motion';
 * 
 * <motion.button {...buttonTactile}>Click me</motion.button>
 * ```
 * 
 * @see /docs/DESIGN_SYSTEM_QUICK_REFERENCE.md for usage examples
 */

// ===========================
// PHYSICS LAYER (Core spring configurations)
// ===========================
export {
  snappyFast,
  snappyNormal,
  smoothNormal,
  smoothSlow,
  bouncyNormal,
  bouncySlow,
  gentleNormal,
  easings,
  // Legacy aliases (deprecated)
  premiumSpring,
  gentleLand,
  quickTap,
  popIn,
  smoothEasing,
} from './physics';

// ===========================
// TACTILE FEEDBACK (Interactive)
// ===========================
export {
  buttonTactile,
  cardTactile,
  subtleTactile,
  iconTactile,
  badgeTactile,
  interactiveButton,
  interactiveCard,
  interactiveSubtle,
  interactiveIcon,
  interactiveBadge,
  safeTactile,
  // NEW: Premium patterns (Phase 3 Gap Fill)
  premiumCardLift,
  focusState,
  interactivePremiumCard,
} from './tactile';

// ===========================
// CONTENT ENTRY (Entrance animations)
// ===========================
export {
  contentEntry,
  contentEntryTransition,
  staggerContainer,
  staggerItem,
  fastStaggerContainer,
  // Word-by-word reveal patterns
  wordByWordContainer,
  wordByWordItem,
  // NEW: Scale entry for badges/pills
  scaleEntry,
  // NEW: Scroll-triggered animations (Phase 3 Gap Fill)
  scrollEntry,
  scrollScale,
  scrollFade,
  viewportDefaults,
  viewportHalf,
} from './entry';

// ===========================
// LAYOUT ANIMATIONS (Reordering, FLIP)
// ===========================
export {
  layoutTransition,
  listItemLayout,
  gridItemLayout,
  activeIndicator,
  sharedElement,
  // NEW: Drag patterns (Phase 3 Gap Fill)
  draggableItem,
  dragHandle,
} from './layout';

// ===========================
// SPECIALIZED (Modals, overlays, sheets)
// ===========================
export {
  scaleIn,
  backdropFade,
  modalPanel,
  slideUp,
  slideDown,
  // NEW: State transitions & directional slides (Phase 3 Gap Fill)
  successState,
  errorState,
  pulseAttention,
  pulseOpacity, // NEW: For scroll hints and loading indicators
  bounceY, // NEW: For scroll hints and down arrows
  magneticHover,
  slideLeft,
  slideRight,
  shimmer,
  bannerSlide,
  expandCollapse,
  parallaxLayer,
} from './specialized';

// ===========================
// PAGE TRANSITIONS (Route-level)
// ===========================
export {
  pageTransition,
  slideTransition,
  // NEW: Directional & depth transitions (Phase 3 Gap Fill)
  slideForward,
  slideBackward,
  zoomIn,
  zoomOut,
  fadeOnly,
} from './page';

// ===========================
// UTILITIES (Helpers)
// ===========================
export {
  withReducedMotion,
} from './utils';
