/**
 * Loading States - Unified Loading Components
 * 
 * Consolidates all loading UX variants in a single file.
 * Provides 4 distinct loading patterns for different use cases.
 * 
 * Variants:
 * 1. RouteLoadingScreen - Premium full-screen for route transitions (branded experience)
 * 2. RouteLoadingBar - Minimal top progress bar for route transitions (non-intrusive)
 * 3. ContentSkeleton - Placeholder for content loading
 * 4. LoadingSpinner - Inline spinner for async operations
 * 
 * All animations respect prefers-reduced-motion for accessibility.
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { typography } from '../lib/typography';
import { cn } from '../lib/utils';
import { APP_NAME } from '@/lib/constants/app';

/**
 * Route Loading Screen - Ultra-Premium full-screen experience
 * 
 * Use for: Initial app load, heavy page transitions, analytics page
 * Features: Luxury logo animation, orbital glow rings, sophisticated shimmer effects
 * UX: Maximum impact, Apple-inspired premium feel, completely hides layout shifts
 * 
 * Design Philosophy: Inspired by iOS app launches and Revolut's premium animations
 */
export function RouteLoadingScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Animated gradient background with radial blur */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        
        {/* Subtle noise texture overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/[0.02] to-transparent opacity-50" />
      </div>

      {/* Floating orbital rings */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full border border-primary/10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full border border-primary/15"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      )}
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Premium logo with multi-layer glow effects */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer glow (pulsing) */}
          <motion.div
            className="absolute inset-0 -m-16 rounded-full bg-primary/20 blur-3xl"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Middle glow (rotating) */}
          <motion.div
            className="absolute inset-0 -m-12 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.15), transparent)',
            }}
            animate={prefersReducedMotion ? {} : {
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner shimmer ring */}
          <motion.div
            className="absolute inset-0 -m-8 rounded-full border-2 border-primary/20"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Logo container with glass morphism effect */}
          <motion.div
            className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-2xl shadow-primary/30 backdrop-blur-xl border border-primary/20"
            animate={prefersReducedMotion ? {} : {
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Shine effect overlay */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={prefersReducedMotion ? {} : {
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'easeInOut',
              }}
            />

            {/* Logo text with subtle shadow */}
            <span className="text-6xl font-bold text-primary-foreground drop-shadow-lg">S</span>
          </motion.div>
        </motion.div>

        {/* App name with elegant fade-in */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={cn(
            typography.display.lg,
            "bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
          )}>
            {APP_NAME}
          </h1>
          <motion.p
            className={typography.label.sm}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Crafting your experience...
          </motion.p>
        </motion.div>

        {/* Sophisticated loading indicator - morphing dots */}
        {!prefersReducedMotion && (
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="h-2.5 w-2.5 rounded-full bg-primary shadow-lg shadow-primary/50"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.4, 1, 0.4],
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom accent - elegant progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 shadow-lg shadow-primary/20"
          initial={{ width: '0%', opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{
            width: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3 },
          }}
        />
      </div>

      {/* Corner accent lines (optional premium detail) */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20 rounded-tl-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20 rounded-br-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Route Loading Bar - Minimal top progress bar
 * 
 * Use for: Standard route transitions, lightweight pages
 * Features: Top-of-screen progress bar, subtle gradient
 * UX: Non-intrusive, modern, feels faster than full-screen
 * 
 * RECOMMENDED as default for most route loading scenarios.
 */
export function RouteLoadingBar() {
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-left"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    />
  );
}

/**
 * Content Skeleton - Placeholder for loading content
 * 
 * Use for: Data fetching, content loading states
 * Features: Pulsing skeleton boxes matching content layout
 * UX: Shows expected layout structure while loading
 */
export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-muted rounded-lg w-3/4" />
      <div className="h-8 bg-muted rounded-lg w-1/2" />
      <div className="h-32 bg-muted rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="h-24 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Loading Spinner - Inline spinner for async operations
 * 
 * Use for: Button loading states, inline async operations
 * Features: Rotating border spinner, 3 size variants
 * UX: Indicates active processing without blocking UI
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-4 border-primary border-t-transparent`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

/**
 * Progress Bar - Determinate progress indicator
 * 
 * Use for: File uploads, multi-step processes, known-duration operations
 * Features: Smooth animated bar, 0-100 value range
 * UX: Shows concrete progress for trackable operations
 */
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <motion.div
        className="h-full bg-primary origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: value / 100 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
}
