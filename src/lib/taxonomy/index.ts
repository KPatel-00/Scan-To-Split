/**
 * Taxonomy Service - Central access point for category data
 */

import categoryData from './data/categories.json';
import type { Category } from '../../store/types';

// Cache for performance
let categoriesCache: Category[] | null = null;
let categoryMap: Map<string, Category> | null = null;

/**
 * Load and parse all categories from taxonomy JSON
 */
export function loadTaxonomy(): Category[] {
  if (categoriesCache) return categoriesCache;
  
  const categories: Category[] = [];
  
  // Parse top-level categories
  categoryData.categories.forEach((cat: any) => {
    // Add parent category
    categories.push({
      id: cat.id,
      code: cat.code,
      name_en: cat.name_en,
      name_de: cat.name_de,
      icon: cat.icon,
      isSpecialLine: false,
      keywords: cat.keywords || [],
      synonyms: cat.synonyms || [],
    });
    
    // Add subcategories (children)
    if (cat.children) {
      cat.children.forEach((child: any) => {
        categories.push({
          id: child.id,
          code: cat.code,  // Inherit parent code
          name_en: child.name_en,
          name_de: child.name_de,
          icon: child.icon,
          isSpecialLine: false,
          parentId: cat.id,
          keywords: child.keywords || [],
        });
      });
    }
  });
  
  // Add special line items (non-merchandise line items)
  categoryData.non_merch_line_items?.forEach((special: any) => {
    categories.push({
      id: special.id,
      code: special.id,  // For special lines, code = id
      name_en: special.name_en,
      name_de: special.name_de,
      icon: special.icon,
      isSpecialLine: true,
      keywords: special.keywords || [],
    });
  });
  
  categoriesCache = categories;
  return categories;
}

/**
 * Build category lookup map for O(1) access
 */
function buildCategoryMap(): Map<string, Category> {
  if (categoryMap) return categoryMap;
  
  const categories = loadTaxonomy();
  categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  return categoryMap;
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  const map = buildCategoryMap();
  return map.get(id);
}

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  return loadTaxonomy();
}

/**
 * Get only merchandise categories (exclude special lines)
 */
export function getMerchandiseCategories(): Category[] {
  return loadTaxonomy().filter(cat => !cat.isSpecialLine);
}

/**
 * Get only special line categories (TAX, DEPO, etc.)
 */
export function getSpecialLineCategories(): Category[] {
  return loadTaxonomy().filter(cat => cat.isSpecialLine);
}

/**
 * Get top-level categories only (no children)
 */
export function getTopLevelCategories(): Category[] {
  return loadTaxonomy().filter(cat => !cat.parentId);
}

/**
 * Get subcategories for a parent category
 */
export function getSubcategories(parentId: string): Category[] {
  return loadTaxonomy().filter(cat => cat.parentId === parentId);
}

/**
 * Search categories by name, keywords, or synonyms
 */
export function searchCategory(
  query: string,
  locale: 'en' | 'de' = 'de'
): Category | undefined {
  const normalizedQuery = query.toLowerCase().trim();
  const categories = loadTaxonomy();
  
  // 1. Exact ID match
  let match = categories.find(cat => cat.id.toLowerCase() === normalizedQuery);
  if (match) return match;
  
  // 2. Exact name match
  const nameField = locale === 'de' ? 'name_de' : 'name_en';
  match = categories.find(cat => cat[nameField].toLowerCase() === normalizedQuery);
  if (match) return match;
  
  // 3. Keyword match
  match = categories.find(cat =>
    cat.keywords?.some(kw => normalizedQuery.includes(kw.toLowerCase()))
  );
  if (match) return match;
  
  // 4. Synonym match
  match = categories.find(cat =>
    cat.synonyms?.some(syn => normalizedQuery.includes(syn.toLowerCase()))
  );
  if (match) return match;
  
  // 5. Fuzzy name match (contains)
  match = categories.find(cat => 
    cat[nameField].toLowerCase().includes(normalizedQuery) ||
    normalizedQuery.includes(cat[nameField].toLowerCase())
  );
  
  return match;
}

/**
 * Get default category for uncategorized items
 */
export function getDefaultCategory(): Category {
  return getCategoryById('MISC') || {
    id: 'MISC',
    code: 'MISC',
    name_en: 'Miscellaneous',
    name_de: 'Sonstiges',
    icon: 'Package',
    isSpecialLine: false,
  };
}

/**
 * Check if category is a special line item
 */
export function isSpecialLineCategory(categoryId: string): boolean {
  const category = getCategoryById(categoryId);
  return category?.isSpecialLine ?? false;
}

/**
 * Get category icon component name
 */
export function getCategoryIconName(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.icon || 'Package';
}

/**
 * Batch category lookup (optimized)
 */
export function getCategoriesByIds(ids: string[]): Map<string, Category> {
  const map = buildCategoryMap();
  const result = new Map<string, Category>();
  
  ids.forEach(id => {
    const category = map.get(id);
    if (category) {
      result.set(id, category);
    }
  });
  
  return result;
}
