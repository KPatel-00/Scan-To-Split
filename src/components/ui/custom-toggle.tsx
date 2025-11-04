/**
 * Custom Toggle Component
 * 
 * Premium toggle switch with smooth layout animations and haptic feedback.
 * The knob uses Framer Motion's layout prop for automatic slide animation.
 * 
 * Features:
 * - Layout animation for knob position (Magic Motion!)
 * - Background color transition for track
 * - Haptic feedback on toggle
 * - Full keyboard accessibility
 * - Spring physics for premium feel
 * - Respects prefers-reduced-motion
 */

import { motion } from 'framer-motion';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { smoothNormal, snappyFast } from '@/lib/motion/physics';
import { useReducedMotion, useSafeLayout, useMotionTransition } from '@/hooks/useReducedMotion';

interface CustomToggleProps {
  /**
   * Whether the toggle is in the "on" state
   */
  isOn: boolean;
  
  /**
   * Callback fired when toggle state changes
   */
  onToggle: (newValue: boolean) => void;
  
  /**
   * Optional label for accessibility
   */
  label?: string;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom class name for the container
   */
  className?: string;
  
  /**
   * Enable haptic feedback (default: true)
   */
  enableHaptics?: boolean;
}

const sizeClasses = {
  sm: {
    track: 'w-10 h-6',
    knob: 'w-4 h-4',
    padding: 1,
  },
  md: {
    track: 'w-12 h-7',
    knob: 'w-5 h-5',
    padding: 1,
  },
  lg: {
    track: 'w-14 h-8',
    knob: 'w-6 h-6',
    padding: 1,
  },
};

export function CustomToggle({
  isOn,
  onToggle,
  label,
  size = 'md',
  disabled = false,
  className,
  enableHaptics = true,
}: CustomToggleProps) {
  const sizeConfig = sizeClasses[size];
  const prefersReducedMotion = useReducedMotion();
  const safeLayout = useSafeLayout();
  const trackTransition = useMotionTransition(smoothNormal, { duration: 0.2 });
  
  const handleToggle = () => {
    if (disabled) return;
    
    // Trigger haptic feedback
    if (enableHaptics) {
      haptics.toggle();
    }
    
    // Update state
    onToggle(!isOn);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full transition-opacity',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Track */}
      <motion.div
        className={cn(
          'rounded-full transition-colors duration-200',
          sizeConfig.track
        )}
        animate={{
          backgroundColor: isOn
            ? 'hsl(var(--primary))'
            : 'hsl(var(--muted))',
        }}
        transition={trackTransition}
      >
        {/* Knob - uses layout prop for automatic slide animation */}
        <motion.div
          layout={safeLayout}
          className={cn(
            'rounded-full bg-white shadow-md',
            sizeConfig.knob
          )}
          style={{
            margin: sizeConfig.padding,
            marginLeft: isOn ? undefined : sizeConfig.padding,
            marginRight: isOn ? sizeConfig.padding : undefined,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : snappyFast
          }
        />
      </motion.div>
    </button>
  );
}

/**
 * Toggle with Label
 * 
 * Convenience component that includes label text
 */
interface CustomToggleWithLabelProps extends CustomToggleProps {
  /**
   * Label text to display
   */
  labelText: string;
  
  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Optional description text
   */
  description?: string;
}

export function CustomToggleWithLabel({
  labelText,
  labelPosition = 'left',
  description,
  ...toggleProps
}: CustomToggleWithLabelProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {labelPosition === 'left' && (
        <div className="flex-1">
          <label className="text-sm font-medium cursor-pointer">
            {labelText}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      
      <CustomToggle {...toggleProps} label={labelText} />
      
      {labelPosition === 'right' && (
        <div className="flex-1">
          <label className="text-sm font-medium cursor-pointer">
            {labelText}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

