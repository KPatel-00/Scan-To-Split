/**
 * Fallback categorization using keyword matching
 * Used when AI doesn't return category_id or returns invalid one
 */

import { searchCategory, getDefaultCategory, getCategoryById } from './index';
import type { Category } from '../../store/types';

/**
 * Fallback categorization using keyword matching
 * Used when AI fails to categorize
 */
export function categorizeFallback(itemName: string, locale: 'en' | 'de' = 'de'): Category {
  // Try taxonomy search first
  const category = searchCategory(itemName, locale);
  if (category) return category;
  
  // Hardcoded fallbacks for common German items
  const lowerName = itemName.toLowerCase();
  
  // Special lines (highest priority)
  if (/mwst|ust|steuer|tax|vat/.test(lowerName)) {
    return getCategoryById('TAX') || getDefaultCategory();
  }
  if (/^pfand(?!rück)/.test(lowerName) || /deposit/.test(lowerName)) {
    return getCategoryById('DEPO') || getDefaultCategory();
  }
  if (/pfandrück|leergut/.test(lowerName)) {
    return getCategoryById('DEPO_RET') || getDefaultCategory();
  }
  if (/rabatt|coupon|gutschein|discount/.test(lowerName)) {
    return getCategoryById('DISC') || getDefaultCategory();
  }
  if (/gebühr|fee|tüte/.test(lowerName)) {
    return getCategoryById('FEES') || getDefaultCategory();
  }
  if (/trinkgeld|tip|gratuity/.test(lowerName)) {
    return getCategoryById('TIP') || getDefaultCategory();
  }
  
  // Grocery categories
  if (/milch|joghurt|käse|butter|sahne|quark/.test(lowerName)) {
    return getCategoryById('GROC.DAIRY') || getDefaultCategory();
  }
  if (/brot|brötchen|semmel|croissant/.test(lowerName)) {
    return getCategoryById('GROC.BAKERY') || getDefaultCategory();
  }
  if (/apfel|banane|tomate|zwiebel|kartoffel|salat|obst|gemüse/.test(lowerName)) {
    return getCategoryById('GROC.PRODUCE') || getDefaultCategory();
  }
  if (/fleisch|wurst|hackfleisch|schnitzel|steak/.test(lowerName)) {
    return getCategoryById('GROC.MEAT') || getDefaultCategory();
  }
  if (/chips|nüsse|popcorn|keks|cracker|pringles|cashew/.test(lowerName)) {
    return getCategoryById('GROC.SNACKS') || getDefaultCategory();
  }
  if (/wasser|saft|cola|limo|kaffee|tee|energie/.test(lowerName)) {
    return getCategoryById('GROC.BEVERAGES_NA') || getDefaultCategory();
  }
  if (/bier|wein|schnaps|alkohol/.test(lowerName)) {
    return getCategoryById('ALCO') || getDefaultCategory();
  }
  if (/schokolade|süß|bonbon|candy/.test(lowerName)) {
    return getCategoryById('GROC.SWEETS') || getDefaultCategory();
  }
  if (/eis|tiefkühl|frozen/.test(lowerName)) {
    return getCategoryById('GROC.FROZEN') || getDefaultCategory();
  }
  if (/reis|pasta|nudel|mehl|öl/.test(lowerName)) {
    return getCategoryById('GROC.PANTRY') || getDefaultCategory();
  }
  if (/fisch|lachs|thunfisch/.test(lowerName)) {
    return getCategoryById('GROC.SEAFOOD') || getDefaultCategory();
  }
  if (/reiniger|waschmittel|putzmittel/.test(lowerName)) {
    return getCategoryById('HOME') || getDefaultCategory();
  }
  
  // Default fallback
  return getDefaultCategory();
}
