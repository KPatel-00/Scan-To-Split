import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export commonly used functions
export { formatCurrency } from './pdf/utils/pdfHelpers';
export { getCategoryName } from './taxonomy/migration';

// Calculate total from items array
export function calculateItemsTotal(items: Array<{ price: number; quantity?: number }>): number {
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

// Aggregate items by category
export function aggregateItemsByCategory(items: Array<{ category?: string; price: number }>): Record<string, number> {
  return items.reduce((acc, item) => {
    const category = item.category || 'MISC';
    acc[category] = (acc[category] || 0) + item.price;
    return acc;
  }, {} as Record<string, number>);
}
