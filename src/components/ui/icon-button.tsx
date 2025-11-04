/**
 * IconButton - Premium UI Component
 * 
 * A reusable icon button with premium animations and interactions.
 * Based on the Gemini-inspired minimalist design system.
 * 
 * Features:
 * - Ghost variant styling (no border, subtle hover)
 * - Scale animations (1.05 hover, 0.95 tap)
 * - Smooth transitions (200ms)
 * - Accessible focus states
 * - Consistent with theme toggle design
 * 
 * @example
 * ```tsx
 * import { IconButton } from '@/components/ui/icon-button';
 * import { Settings } from 'lucide-react';
 * 
 * <IconButton onClick={handleClick} aria-label="Settings">
 *   <Settings className="h-5 w-5" />
 * </IconButton>
 * ```
 */

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { iconTactile } from '@/lib/motion';

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  'aria-label': string; // Required for accessibility
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-foreground/20",
          "hover:bg-accent hover:text-accent-foreground hover:border-foreground/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // ✨ Override default transitions for hover/active states only
          "[transition:transform_150ms_cubic-bezier(0.4,0,0.2,1)]",
          className
        )}
        whileHover={iconTactile.hover}
        whileTap={iconTactile.tap}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
