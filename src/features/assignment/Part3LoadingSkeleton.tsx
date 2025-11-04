/**
 * Part 3 Loading Skeleton
 * 
 * Premium skeleton that mimics the exact layout of Part 3 (Item Assignment Page).
 * Prevents blank white screen during code-split loading.
 */

import { Skeleton } from '../../components/ui/skeleton';
import { Card } from '../../components/ui/card';

export function Part3LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Page Title */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Participant Palette (Sticky on Mobile) */}
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </Card>

      {/* Bill Info Card (Merged Mode) */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Item Cards */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Item Details */}
              <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Right: Participant Toggles + Actions */}
              <div className="flex items-center gap-2">
                {/* Participant Avatars */}
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-8 w-8 rounded-full" />
                ))}
                {/* Action Buttons */}
                {[...Array(4)].map((_, k) => (
                  <Skeleton key={k} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
