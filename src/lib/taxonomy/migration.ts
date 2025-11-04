/**
 * Migration utilities for transitioning from legacy to new category system
 */

import type { Category, LegacyCategory, Item } from '../../store/types';
import { getDefaultCategory, searchCategory, getCategoryById } from './index';

/**
 * Check if item uses legacy category format
 */
export function isLegacyCategory(category: any): category is LegacyCategory {
  return (
    typeof category === 'object' &&
    'name' in category &&
    'icon' in category &&
    !('id' in category) &&
    !('code' in category)
  );
}

/**
 * Convert legacy category format to new Category object
 */
export function migrateLegacyCategory(
  legacy: LegacyCategory | Category,
  itemName?: string
): Category {
  // Check if already in new format
  if ('id' in legacy && 'code' in legacy && 'name_en' in legacy) {
    return legacy as Category;
  }
  
  // Legacy format: { name, icon }
  const legacyCat = legacy as LegacyCategory;
  
  // Try to find matching category by name
  const nameMatch = searchCategory(legacyCat.name, 'de') || searchCategory(legacyCat.name, 'en');
  
  if (nameMatch) {
    return nameMatch;
  }
  
  // Try to match by item name if provided
  if (itemName) {
    const itemMatch = searchCategory(itemName, 'de');
    if (itemMatch) {
      return itemMatch;
    }
  }
  
  // Fallback: Try to map by icon name
  const iconMapping: Record<string, string> = {
    'Milk': 'GROC.DAIRY',
    'milk': 'GROC.DAIRY',
    'Egg': 'GROC.DAIRY',
    'egg': 'GROC.DAIRY',
    'Cheese': 'GROC.DAIRY',
    'cheese': 'GROC.DAIRY',
    'Croissant': 'GROC.BAKERY',
    'croissant': 'GROC.BAKERY',
    'Wheat': 'GROC.BAKERY',
    'wheat': 'GROC.BAKERY',
    'Apple': 'GROC.PRODUCE',
    'apple': 'GROC.PRODUCE',
    'Carrot': 'GROC.PRODUCE',
    'carrot': 'GROC.PRODUCE',
    'Salad': 'GROC.PRODUCE',
    'salad': 'GROC.PRODUCE',
    'Drumstick': 'GROC.MEAT',
    'drumstick': 'GROC.MEAT',
    'Beef': 'GROC.MEAT',
    'beef': 'GROC.MEAT',
    'Fish': 'GROC.SEAFOOD',
    'fish': 'GROC.SEAFOOD',
    'Package': 'GROC.PANTRY',
    'package': 'GROC.PANTRY',
    'Popcorn': 'GROC.SNACKS',
    'popcorn': 'GROC.SNACKS',
    'Nut': 'GROC.SNACKS',
    'nut': 'GROC.SNACKS',
    'Coffee': 'GROC.BEVERAGES',
    'coffee': 'GROC.BEVERAGES',
    'CupSoda': 'GROC.BEVERAGES',
    'cup-soda': 'GROC.BEVERAGES',
    'Wine': 'ALCO',
    'wine': 'ALCO',
    'Beer': 'ALCO',
    'beer': 'ALCO',
    'Utensils': 'REST',
    'utensils': 'REST',
    'UtensilsCrossed': 'REST',
    'utensils-crossed': 'REST',
    'Pizza': 'REST',
    'pizza': 'REST',
    'IceCream': 'GROC.FROZEN',
    'ice-cream': 'GROC.FROZEN',
    'Snowflake': 'GROC.FROZEN',
    'snowflake': 'GROC.FROZEN',
    'Candy': 'GROC.CONFECTIONERY',
    'candy': 'GROC.CONFECTIONERY',
    'Cookie': 'GROC.CONFECTIONERY',
    'cookie': 'GROC.CONFECTIONERY',
    'Sparkles': 'DRUG',
    'sparkles': 'DRUG',
    'ShoppingCart': 'GROC',
    'shopping-cart': 'GROC',
    'Users': 'MISC',
    'users': 'MISC',
  };

  const mappedCategoryId = iconMapping[legacyCat.icon || ''];
  if (mappedCategoryId) {
    const category = getCategoryById(mappedCategoryId);
    if (category) {
      return category;
    }
  }
  
  // Final fallback: default category
  return getDefaultCategory();
}

/**
 * Get category name for display (supports both legacy and new format)
 * @param category - Category object (legacy or new format)
 * @param locale - Language preference ('en' or 'de')
 */
export function getCategoryName(category: Category | LegacyCategory, locale: 'en' | 'de' = 'de'): string {
  // Legacy format
  if ('name' in category && !('name_en' in category)) {
    return (category as LegacyCategory).name;
  }
  
  // New format
  const cat = category as Category;
  return locale === 'de' ? cat.name_de : cat.name_en;
}

/**
 * Get category icon name (supports both legacy and new format)
 */
export function getCategoryIcon(category: Category | LegacyCategory): string {
  return category.icon || 'Package';
}

/**
 * Create a default empty category (for forms, etc.)
 */
export function createEmptyCategory(): Category {
  return getDefaultCategory();
}

/**
 * Sanitize and normalize category name
 */
export function sanitizeCategoryName(name: string): string {
  return name.trim() || 'Uncategorized';
}

/**
 * Migrate a single item
 */
export function migrateItem(item: Item): Item {
  if (isLegacyCategory(item.category)) {
    return {
      ...item,
      category: migrateLegacyCategory(item.category as LegacyCategory, item.name),
    };
  }
  return item;
}

/**
 * Migrate array of items
 */
export function migrateItems(items: Item[]): Item[] {
  return items.map(migrateItem);
}

/**
 * Migration statistics
 */
export interface MigrationStats {
  total: number;
  migrated: number;
  failed: number;
  details: {
    itemName: string;
    oldCategory: string;
    newCategory: string;
    success: boolean;
  }[];
}

/**
 * Migrate with detailed logging
 */
export function migrateItemsWithStats(items: Item[]): {
  items: Item[];
  stats: MigrationStats;
} {
  const stats: MigrationStats = {
    total: items.length,
    migrated: 0,
    failed: 0,
    details: [],
  };

  const migratedItems = items.map(item => {
    if (isLegacyCategory(item.category)) {
      const oldCat = item.category as LegacyCategory;
      const newCategory = migrateLegacyCategory(oldCat, item.name);
      
      const success = newCategory.id !== 'MISC';
      
      stats.details.push({
        itemName: item.name,
        oldCategory: oldCat.name || oldCat.icon || 'Unknown',
        newCategory: newCategory.id,
        success,
      });

      if (success) {
        stats.migrated++;
      } else {
        stats.failed++;
      }

      return {
        ...item,
        category: newCategory,
      };
    }
    
    return item;
  });

  return { items: migratedItems, stats };
}
