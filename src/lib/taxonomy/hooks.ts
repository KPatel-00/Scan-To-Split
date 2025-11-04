/**
 * Performance-optimized React hooks for taxonomy operations
 */

import { useMemo } from 'react';
import { searchCategory, getAllCategories, getMerchandiseCategories, getSpecialLineCategories } from './index';
import type { Category } from '../../store/types';

/**
 * Memoized category search hook
 */
export function useCategorySearch(query: string, locale: 'en' | 'de' = 'de'): Category | undefined {
  return useMemo(() => {
    if (!query.trim()) return undefined;
    return searchCategory(query, locale);
  }, [query, locale]);
}

/**
 * Memoized all categories hook
 */
export function useAllCategories(): Category[] {
  return useMemo(() => getAllCategories(), []);
}

/**
 * Memoized merchandise categories hook
 */
export function useMerchandiseCategories(): Category[] {
  return useMemo(() => getMerchandiseCategories(), []);
}

/**
 * Memoized special line categories hook
 */
export function useSpecialLineCategories(): Category[] {
  return useMemo(() => getSpecialLineCategories(), []);
}

/**
 * Memoized filtered categories hook
 */
export function useFilteredCategories(
  filter: (category: Category) => boolean
): Category[] {
  const allCategories = useAllCategories();
  
  return useMemo(() => {
    return allCategories.filter(filter);
  }, [allCategories, filter]);
}
