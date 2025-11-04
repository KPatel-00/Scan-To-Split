/**
 * Taxonomy Helper Functions
 * Icon mapping, display names, and utilities
 */

import type { LucideIcon } from 'lucide-react';
import {
  // Grocery
  ShoppingCart, Apple, Milk, Egg, Fish, Drumstick, Package,
  Popcorn, Coffee, Cookie, Cherry, Leaf,
  Utensils, Baby, Bone, Gift, Tag,
  
  // Retail
  Wine, Beer, Sparkles, Pill, PawPrint,
  Smartphone, WashingMachine, FileText, BookOpen, 
  Shirt, Dumbbell, Car, Wrench,
  
  // Special Lines
  Receipt, Recycle, Undo2, BadgePercent, AlertCircle, Truck, HandCoins,
  CreditCard,
} from 'lucide-react';
import type { Category } from '../../store/types';

/**
 * Map of icon names to Lucide components
 */
const iconMap: Record<string, LucideIcon> = {
  // Grocery Icons
  ShoppingCart, Apple, Milk, Egg, Fish, Drumstick, Package,
  Popcorn, Coffee, Cookie, Cherry, Leaf,
  Utensils, Baby, Bone, Gift, Tag,
  
  // Retail Icons
  Wine, Beer, Sparkles, Pill, PawPrint,
  Smartphone, WashingMachine, FileText, BookOpen,
  Shirt, Dumbbell, Car, Wrench,
  
  // Special Line Icons
  Receipt, Recycle, Undo2, BadgePercent, AlertCircle, Truck, HandCoins,
  CreditCard,
};

/**
 * Get Lucide icon component by name
 */
export function getCategoryIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Package;
}

/**
 * Get category display name based on locale
 */
export function getCategoryDisplayName(category: Category, locale: 'en' | 'de'): string {
  return locale === 'de' ? category.name_de : category.name_en;
}

/**
 * Get category color based on type
 */
export function getCategoryColor(category: Category): string {
  if (category.isSpecialLine) {
    switch (category.id) {
      case 'TAX': return 'text-muted-foreground';
      case 'DEPO': return 'text-blue-600';
      case 'DEPO_RET': return 'text-blue-600';
      case 'DISC': return 'text-green-600';
      case 'FEES': return 'text-orange-600';
      case 'TIP': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }
  return 'text-primary';
}
