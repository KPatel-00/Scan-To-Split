/**
 * Custom Checkbox Component
 * 
 * Premium checkbox with animated checkmark that "draws" itself.
 * Uses SVG pathLength animation for elite-level microinteraction.
 * 
 * Features:
 * - AnimatePresence for checkmark enter/exit
 * - SVG path drawing animation (pathLength: 0 → 1)
 * - Haptic feedback on check/uncheck
 * - Spring physics for box scale
 * - Full keyboard accessibility
 * - Respects prefers-reduced-motion
 */

import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { snappyFast, smoothNormal, snappyNormal } from '@/lib/motion/physics';
import { useReducedMotion, useMotionTransition } from '@/hooks/useReducedMotion';

interface CustomCheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  isChecked: boolean;
  
  /**
   * Callback fired when checkbox state changes
   */
  onChange: (newValue: boolean) => void;
  
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
   * Indeterminate state (for partial selections)
   */
  indeterminate?: boolean;
  
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
    box: 'w-4 h-4',
    check: 'w-3 h-3',
  },
  md: {
    box: 'w-5 h-5',
    check: 'w-4 h-4',
  },
  lg: {
    box: 'w-6 h-6',
    check: 'w-5 h-5',
  },
};

export function CustomCheckbox({
  isChecked,
  onChange,
  label,
  size = 'md',
  disabled = false,
  indeterminate = false,
  className,
  enableHaptics = true,
}: CustomCheckboxProps) {
  const sizeConfig = sizeClasses[size];
  
  // ACCESSIBILITY: Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  
  // ACCESSIBILITY: Simplified transitions for reduced motion
  const scaleTransition = useMotionTransition(snappyFast, { duration: 0.05 });
  const svgTransition = useMotionTransition(smoothNormal, { duration: 0.15 });
  const pathTransition = prefersReducedMotion
    ? { duration: 0.1 }
    : snappyNormal;
  
  const handleToggle = () => {
    if (disabled) return;
    
    // Trigger haptic feedback
    if (enableHaptics) {
      haptics.toggle();
    }
    
    // Update state
    onChange(!isChecked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : isChecked}
      aria-label={label}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-opacity',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Checkbox Box */}
      <motion.div
        className={cn(
          'flex items-center justify-center rounded border-2 transition-colors',
          sizeConfig.box,
          isChecked || indeterminate
            ? 'bg-primary border-primary'
            : 'bg-background border-muted-foreground/30 hover:border-muted-foreground/50'
        )}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={scaleTransition}
      >
        {/* Checkmark - AnimatePresence for enter/exit */}
        <AnimatePresence mode="wait">
          {isChecked && !indeterminate && (
            <motion.svg
              key="checkmark"
              className={cn('text-primary-foreground', sizeConfig.check)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.5 }}
              transition={svgTransition}
            >
              {/* Checkmark path with drawing animation */}
              <motion.path
                d="M5 12l5 5L20 7"
                initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                transition={pathTransition}
              />
            </motion.svg>
          )}
          
          {/* Indeterminate state (horizontal line) */}
          {indeterminate && (
            <motion.svg
              key="indeterminate"
              className={cn('text-primary-foreground', sizeConfig.check)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0, scaleX: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: prefersReducedMotion ? 1 : 0 }}
              transition={svgTransition}
            >
              <motion.path
                d="M6 12h12"
                initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                transition={pathTransition}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}

/**
 * Checkbox with Label
 * 
 * Convenience component that includes label text
 */
interface CustomCheckboxWithLabelProps extends CustomCheckboxProps {
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

export function CustomCheckboxWithLabel({
  labelText,
  labelPosition = 'right',
  description,
  ...checkboxProps
}: CustomCheckboxWithLabelProps) {
  const { disabled } = checkboxProps;
  
  return (
    <label
      className={cn(
        'flex items-start gap-4 cursor-pointer',
        disabled && 'cursor-not-allowed'
      )}
    >
      {labelPosition === 'left' && (
        <div className="flex-1 pt-0.5">
          <span className="text-sm font-medium">{labelText}</span>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div onClick={(e) => e.preventDefault()}>
        <CustomCheckbox {...checkboxProps} label={labelText} />
      </div>
      
      {labelPosition === 'right' && (
        <div className="flex-1 pt-0.5">
          <span className="text-sm font-medium">{labelText}</span>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
}

/**
 * Checkbox Group
 * 
 * Manages multiple checkboxes with optional "select all" functionality
 */
interface CheckboxGroupProps {
  /**
   * Array of checkbox options
   */
  options: Array<{
    id: string;
    label: string;
    description?: string;
    checked: boolean;
  }>;
  
  /**
   * Callback fired when any checkbox changes
   */
  onChange: (id: string, checked: boolean) => void;
  
  /**
   * Show "select all" checkbox
   */
  showSelectAll?: boolean;
  
  /**
   * Select all label
   */
  selectAllLabel?: string;
  
  /**
   * Callback for select all
   */
  onSelectAll?: (checked: boolean) => void;
}

export function CheckboxGroup({
  options,
  onChange,
  showSelectAll = false,
  selectAllLabel = 'Select All',
  onSelectAll,
}: CheckboxGroupProps) {
  const allChecked = options.every((opt) => opt.checked);
  const someChecked = options.some((opt) => opt.checked) && !allChecked;

  return (
    <div className="space-y-3">
      {showSelectAll && onSelectAll && (
        <>
          <CustomCheckboxWithLabel
            isChecked={allChecked}
            indeterminate={someChecked}
            onChange={onSelectAll}
            labelText={selectAllLabel}
          />
          <div className="h-px bg-border my-2" />
        </>
      )}
      
      {options.map((option) => (
        <CustomCheckboxWithLabel
          key={option.id}
          isChecked={option.checked}
          onChange={(checked) => onChange(option.id, checked)}
          labelText={option.label}
          description={option.description}
        />
      ))}
    </div>
  );
}

