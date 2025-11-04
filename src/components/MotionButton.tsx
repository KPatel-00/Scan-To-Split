/**
 * Enhanced Button Hover Effects
 * CSS-based smooth hover animations for premium feel
 */

import { Button, ButtonProps } from './ui/button';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-200 ease-out',
          'hover:scale-[1.02] active:scale-[0.98]',
          'hover:shadow-md active:shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
