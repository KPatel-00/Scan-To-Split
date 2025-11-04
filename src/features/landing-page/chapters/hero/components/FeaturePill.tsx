/**
 * FeaturePill - Enhanced feature highlight badge
 * 
 * Features:
 * - Desktop hover states with subtle lift
 * - Optional description tooltip
 * - Responsive sizing
 * - Reduced motion support
 * - Interactive focus states
 * 
 * Usage:
 * <FeaturePill 
 *   icon={Zap} 
 *   text="Under 10 seconds"
 *   description="Scan to split in lightning speed" 
 * />
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { scaleEntry, subtleTactile, cardTactile } from '@/lib/motion';

export interface FeaturePillProps {
  icon: LucideIcon;
  text: string;
  description?: string;
  compact?: boolean;
  delay?: number;
  className?: string;
}

export function FeaturePill({ 
  icon: Icon, 
  text, 
  description,
  compact = false, 
  delay = 0,
  className 
}: FeaturePillProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={cn(
        'relative group cursor-default',
        'inline-flex items-center gap-2 rounded-full',
        'bg-muted/80 backdrop-blur-sm border border-border',
        'hover:bg-muted hover:border-primary/50',
        'transition-colors duration-300',
        compact ? 'px-3 py-1.5' : 'px-4 py-2.5',
        className
      )}
      variants={scaleEntry}
      initial={prefersReducedMotion ? false : "initial"}
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ 
        delay,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? undefined : cardTactile.hover}
      whileTap={prefersReducedMotion ? undefined : cardTactile.tap}
    >
      {/* Icon with animation */}
      <motion.div
        {...(isHovered && !prefersReducedMotion ? subtleTactile : {})}
      >
        <Icon className={cn(
          'text-primary',
          compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
        )} />
      </motion.div>

      {/* Text */}
      <span className={cn(
        'font-medium whitespace-nowrap',
        compact ? 'text-xs' : 'text-sm'
      )}>
        {text}
      </span>

      {/* Tooltip (desktop only) */}
      {description && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={isHovered ? { 
            opacity: 1, 
            y: 0, 
            scale: 1 
          } : { 
            opacity: 0, 
            y: 10, 
            scale: 0.95 
          }}
          className={cn(
            'hidden lg:block',
            'absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50',
            'px-3 py-2 rounded-lg shadow-lg',
            'bg-popover border border-border',
            'text-xs text-popover-foreground',
            'whitespace-nowrap pointer-events-none'
          )}
        >
          {description}
          {/* Arrow */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-border" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
