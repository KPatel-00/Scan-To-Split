/**
 * Skeleton Loader Component System
 * 
 * Reusable skeleton loaders with smooth AnimatePresence transitions
 * for eliminating jarring "pop-ins" when data loads.
 * 
 * Usage:
 * <DataLoader
 *   isLoading={isLoading}
 *   skeleton={<SkeletonCard />}
 *   content={<ActualContent data={data} />}
 * />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';

/**
 * DataLoader Component
 * 
 * Handles seamless skeleton → content transitions
 */
interface DataLoaderProps {
  isLoading: boolean;
  skeleton: ReactNode;
  content: ReactNode;
  className?: string;
}

export function DataLoader({ isLoading, skeleton, content, className }: DataLoaderProps) {
  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Standardized Skeleton Components
 */

// Base shimmer animation
const shimmerVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Skeleton line (for text)
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className={cn('h-4 bg-muted rounded', className)}
    />
  );
}

// Skeleton circle (for avatars)
export function SkeletonCircle({ className }: { className?: string }) {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className={cn('rounded-full bg-muted', className)}
    />
  );
}

// Skeleton rectangle (for images/cards)
export function SkeletonRectangle({ className }: { className?: string }) {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className={cn('bg-muted rounded-lg', className)}
    />
  );
}

/**
 * Preset Skeleton Layouts
 */

// Card skeleton
export function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonCircle className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-1/3" />
          <SkeletonLine className="w-1/2" />
        </div>
      </div>
      <SkeletonRectangle className="h-32 w-full" />
      <div className="space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-3/4" />
      </div>
    </div>
  );
}

// List item skeleton
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <SkeletonCircle className="h-10 w-10" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-1/4" />
        <SkeletonLine className="w-1/3" />
      </div>
      <SkeletonRectangle className="h-8 w-20" />
    </div>
  );
}

// Profile skeleton
export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <SkeletonCircle className="h-24 w-24" />
        <div className="flex-1 space-y-3">
          <SkeletonLine className="w-1/3 h-6" />
          <SkeletonLine className="w-1/2" />
          <SkeletonLine className="w-2/3" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <SkeletonRectangle className="h-20" />
        <SkeletonRectangle className="h-20" />
        <SkeletonRectangle className="h-20" />
      </div>
    </div>
  );
}

// Grid skeleton
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Table row skeleton
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <SkeletonLine className="w-1/6" />
      <SkeletonLine className="w-1/4" />
      <SkeletonLine className="w-1/5" />
      <SkeletonLine className="w-1/6" />
      <SkeletonRectangle className="h-8 w-16 ml-auto" />
    </div>
  );
}

// Table skeleton
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-card">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  );
}
