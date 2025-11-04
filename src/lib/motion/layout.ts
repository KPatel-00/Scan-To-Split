/**
 * Layout Animations
 * Magic Motion: Smooth position changes when items are added, removed, or reordered
 * 
 * Physics: Uses smoothNormal and snappyNormal from physics layer
 */

import { Transition } from 'framer-motion';
import { staggerItem } from './entry';
import { smoothNormal, snappyNormal } from './physics';

/**
 * Layout transition for smooth position changes
 * 
 * Physics: smoothNormal (balanced 200-300ms feel)
 */
export const layoutTransition: Transition = smoothNormal;

/**
 * List item with layout animation (add this to all list items)
 */
export const listItemLayout = {
  layout: true,
  transition: layoutTransition,
  variants: staggerItem,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
};

/**
 * Grid item with layout animation
 */
export const gridItemLayout = {
  layout: true,
  transition: layoutTransition,
};

/**
 * Active indicator animation (for tabs, nav bars)
 * 
 * Physics: snappyNormal (responsive 150-200ms feel)
 */
export const activeIndicator = {
  layoutId: 'active-indicator',
  transition: snappyNormal,
};

/**
 * Shared element transition
 */
export const sharedElement = (id: string) => ({
  layoutId: id,
  transition: layoutTransition,
});

/**
 * Draggable item (for sortable lists, reorderable items)
 * 
 * Physics: snappyNormal (responsive drag feel)
 * 
 * Usage:
 * ```tsx
 * <motion.div
 *   drag
 *   dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
 *   whileDrag={draggableItem.whileDrag}
 *   transition={draggableItem.transition}
 * >
 *   Draggable content
 * </motion.div>
 * ```
 */
export const draggableItem = {
  whileDrag: {
    scale: 1.05,
    zIndex: 1000,
    cursor: 'grabbing',
  },
  transition: snappyNormal,
};

/**
 * Drag handle (visual indicator for draggable areas)
 * 
 * Usage:
 * ```tsx
 * <motion.div whileHover={dragHandle.hover} whileTap={dragHandle.tap}>
 *   ⋮⋮ Drag handle
 * </motion.div>
 * ```
 */
export const dragHandle = {
  hover: {
    scale: 1.1,
    cursor: 'grab',
    transition: snappyNormal,
  },
  tap: {
    scale: 0.95,
    cursor: 'grabbing',
  },
};
