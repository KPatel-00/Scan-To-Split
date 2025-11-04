/**
 * Part 4 Loading Skeleton
 * 
 * Premium skeleton that mimics the exact layout of Part 4 (Summary Page).
 * Prevents blank white screen during code-split loading.
 */

import { Skeleton } from '../../components/ui/skeleton';
import { Card } from '../../components/ui/card';

export function Part4LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Page Title */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Celebration Card */}
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <div className="flex gap-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </Card>

      {/* Grand Total Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>

      {/* Settlement Summary Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Participant Summary Cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Right: Amount + Badge */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}
