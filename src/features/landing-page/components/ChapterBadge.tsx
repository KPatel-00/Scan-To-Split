/**
 * ChapterBadge Component
 * 
 * Reusable badge component for landing page chapters and animations.
 * Displays an icon with text in a rounded pill with various style variants.
 * 
 * Usage:
 * ```tsx
 * <ChapterBadge 
 *   icon={Sparkles} 
 *   text="AI-Powered" 
 *   variant="primary"
 *   size="md"
 * />
 * ```
 * 
 * Variants:
 * - primary: Light background with primary color (default)
 * - inverse: Light background with contrasting color (for dark backgrounds)
 * - solid: Solid primary background with inverted text
 * 
 * Sizes:
 * - sm: Compact badge (12px padding, xs text)
 * - md: Standard badge (16px padding, sm text)
 * - lg: Large badge (20px padding, base text)
 */

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { smoothNormal } from '@/lib/motion';

interface ChapterBadgeProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Text content to display */
  text: string;
  /** Visual style variant */
  variant?: 'primary' | 'inverse' | 'solid';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function ChapterBadge({
  icon: Icon,
  text,
  variant = 'primary',
  size = 'md',
  className,
}: ChapterBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  // Base styles applied to all variants
  const baseStyles = 'inline-flex items-center gap-2 rounded-full backdrop-blur-sm';
  
  // Variant-specific color schemes
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    inverse: 'bg-background/10 text-background',
    solid: 'bg-primary text-primary-foreground shadow-lg',
  };
  
  // Size-specific spacing and typography
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Icon sizes mapped to badge sizes
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={smoothNormal}
    >
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{text}</span>
    </motion.div>
  );
}
