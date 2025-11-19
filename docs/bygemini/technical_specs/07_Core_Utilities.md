# 07. Core Utilities & Hooks

This document provides the source code for the essential utility functions and hooks that power the application's logic and safety.

## 1. Sanitization (`src/lib/sanitize.ts`)
**Critical Security Layer:** Prevents XSS by stripping HTML from all user inputs.

```typescript
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Configure DOMPurify to strip ALL HTML
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],      // No HTML tags allowed
    ALLOWED_ATTR: [],      // No attributes allowed
    KEEP_CONTENT: true,    // Preserve text content inside tags
  }).trim();

  return sanitized;
}
```

## 2. Hydration Hook (`src/hooks/useHydration.ts`)
**Critical Stability Layer:** Prevents UI flicker and SSR mismatches by ensuring Zustand state is loaded from localStorage.

```typescript
import { useEffect, useState } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
```

## 3. Reduced Motion Hook (`src/hooks/useReducedMotion.ts`)
**Critical Accessibility Layer:** Detects OS-level motion preferences to disable heavy animations.

```typescript
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return prefersReducedMotion;
}
```

## 4. ClassName Utility (`src/lib/utils.ts`)
**Styling Helper:** Merges Tailwind classes intelligently.

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Category } from '../store/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate total from items array
export function calculateItemsTotal(
  items: Array<{ price: number; quantity?: number }>
): number {
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

// Aggregate items by category with full category data
export function aggregateItemsByCategory(
  items: Item[]
): Map<string, { categoryId: string; category: Category; total: number; count: number }> {
  const categoryMap = new Map<string, { categoryId: string; category: Category; total: number; count: number }>();

  items.forEach((item) => {
    const categoryId = item.category.code || 'MISC';
    
    if (categoryMap.has(categoryId)) {
      const existing = categoryMap.get(categoryId)!;
      existing.total += item.price * (item.quantity || 1);
      existing.count += 1;
    } else {
      categoryMap.set(categoryId, {
        categoryId,
        category: item.category,
        total: item.price * (item.quantity || 1),
        count: 1,
      });
    }
  });

  return categoryMap;
}
```
