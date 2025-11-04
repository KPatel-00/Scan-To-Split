import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Category } from '../store/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export commonly used functions and types
export { formatCurrency } from './pdf/utils/pdfHelpers';
export { getCategoryName } from './taxonomy/migration';
export type { Currency } from '../store/types';

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
