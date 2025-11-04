/**
 * Premium CTA Button Component
 * 
 * Ultra-premium call-to-action button with:
 * - Scale physics (1.03 hover, 0.95 tap)
 * - Shimmer effect (gradient sweep on hover)
 * - Icon pulse animation (1.2s infinite)
 * - Accessibility (prefers-reduced-motion support)
 * 
 * Extracted from Hero CTA - production-proven premium interaction.
 * 
 * @example
 * ```tsx
 * <PremiumCTA href="/setup" icon={UploadCloud}>
 *   Scan Your First Bill
 * </PremiumCTA>
 * 
 * <PremiumCTA 
 *   href="/upgrade" 
 *   icon={Crown}
 *   variant="secondary"
 *   size="default"
 *   shimmerSpeed="fast"
 * >
 *   Upgrade Now
 * </PremiumCTA>
 * ```
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { interactiveButton, safeTactile } from '@/lib/motion';
import { typography } from '@/lib/typography';
import { cn } from '@/lib/utils';

export interface PremiumCTAProps {
  /**
   * The URL to navigate to when clicked
   */
  href: string;
  
  /**
   * Button text content
   */
  children: React.ReactNode;
  
  /**
   * Lucide icon component (e.g., UploadCloud, Crown, Sparkles)
   * Rendered with pulse animation
   */
  icon?: LucideIcon;
  
  /**
   * Icon position
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'default' | 'secondary' | 'outline';
  
  /**
   * Button size
   * @default 'lg'
   */
  size?: 'default' | 'sm' | 'lg';
  
  /**
   * Shimmer effect speed
   * - 'slow': 1000ms (elegant, luxurious)
   * - 'normal': 700ms (balanced)
   * - 'fast': 500ms (snappy, action)
   * @default 'slow'
   */
  shimmerSpeed?: 'slow' | 'normal' | 'fast';
  
  /**
   * Disable icon pulse animation
   * @default false
   */
  disableIconPulse?: boolean;
  
  /**
   * Disable shimmer effect
   * @default false
   */
  disableShimmer?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Click handler (optional, href navigation still works)
   */
  onClick?: () => void;
  
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

const shimmerDurations = {
  slow: 'duration-1000',
  normal: 'duration-700',
  fast: 'duration-500',
} as const;

export const PremiumCTA = React.forwardRef<HTMLAnchorElement, PremiumCTAProps>(
  (
    {
      href,
      children,
      icon: Icon,
      iconPosition = 'left',
      variant = 'default',
      size = 'lg',
      shimmerSpeed = 'slow',
      disableIconPulse = false,
      disableShimmer = false,
      className,
      onClick,
      ariaLabel,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    return (
      <Button
        size={size}
        variant={variant}
        className={cn(
          typography.interactive.ctaLg,
          'relative overflow-hidden group',
          className
        )}
        asChild
      >
        <motion.a
          ref={ref}
          href={href}
          onClick={handleClick}
          aria-label={ariaLabel}
          {...safeTactile(interactiveButton, prefersReducedMotion)}
        >
          {/* Icon - Left Position */}
          {Icon && iconPosition === 'left' && (
            <span
              className={cn(
                'mr-2 inline-block',
                !disableIconPulse && 'animate-icon-pulse'
              )}
              style={{ display: 'inline-block' }}
              aria-hidden="true"
            >
              <Icon className="w-5 h-5" />
            </span>
          )}

          {/* Button Text */}
          {children}

          {/* Icon - Right Position */}
          {Icon && iconPosition === 'right' && (
            <span
              className={cn(
                'ml-2 inline-block',
                !disableIconPulse && 'animate-icon-pulse'
              )}
              style={{ display: 'inline-block' }}
              aria-hidden="true"
            >
              <Icon className="w-5 h-5" />
            </span>
          )}

          {/* Shimmer Effect - Gradient sweep on hover (theme-aware) */}
          {!disableShimmer && (
            <span
              className={cn(
                'absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform',
                shimmerDurations[shimmerSpeed],
                'bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent'
              )}
              aria-hidden="true"
            />
          )}
        </motion.a>
      </Button>
    );
  }
);

PremiumCTA.displayName = 'PremiumCTA';
