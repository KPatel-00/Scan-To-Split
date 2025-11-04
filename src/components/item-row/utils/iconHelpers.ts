import * as LucideIcons from 'lucide-react';

/**
 * Get Lucide icon component from category icon name
 * @param iconName - Hyphenated icon name (e.g., "shopping-cart")
 * @returns Icon component (defaults to Package if not found)
 */
export function getIconComponent(iconName: string | undefined): React.ComponentType<any> {
  if (!iconName || iconName === '') {
    return LucideIcons.Package;
  }
  
  // Convert hyphenated to PascalCase (e.g., "shopping-cart" -> "ShoppingCart")
  const pascalCase = iconName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const Icon = (LucideIcons as any)[pascalCase];
  return Icon || LucideIcons.Package;
}

/**
 * Check if item price is negative (discount/refund)
 * @param price - Item price
 * @returns True if price is negative
 */
export function isNegativePrice(price: number): boolean {
  return price < 0;
}
