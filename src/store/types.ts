/**
 * Shared Types for Zustand Store
 * Centralized type definitions for all store slices
 */

/**
 * Category taxonomy structure
 * Based on comprehensive receipt categorization system
 */
export interface Category {
  /** Unique category identifier (e.g., "GROC.DAIRY", "TAX") */
  id: string;
  
  /** Top-level category code (e.g., "GROC", "TAX") */
  code: string;
  
  /** English category name */
  name_en: string;
  
  /** German category name */
  name_de: string;
  
  /** Lucide icon component name (e.g., "Egg", "Receipt") */
  icon: string;
  
  /** True for special line items (TAX, DEPO, DISC, etc.) */
  isSpecialLine?: boolean;
  
  /** Parent category ID for hierarchical navigation */
  parentId?: string;
  
  /** Search keywords for AI categorization */
  keywords?: string[];
  
  /** Synonyms for fuzzy matching */
  synonyms?: string[];
}

/**
 * Legacy category format (for migration)
 * @deprecated Use Category interface instead
 */
export interface LegacyCategory {
  name: string;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  
  /** Full category object with taxonomy data */
  category: Category;
  
  originReceiptId?: string;
  assignments?: Record<string, number>; // participantId -> amount (for custom splits)
  assignedTo?: string[]; // participant IDs
}

export interface Receipt {
  id: string;
  storeName: string;
  date: string;
  items: Item[];
  paidBy: string | null;
  tax: number;
  tip: number;
  total?: number; // AI-scanned total from receipt (for verification)
}

export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface SavedGroup {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: number;
}

export interface GroupUsageHistory {
  checksum: string; // sorted participant names joined with ','
  count: number;
  lastUsed: number;
}

export interface Currency {
  symbol: string;
  code: string;
}

export interface UndoableAction {
  type: 'deleteItem' | 'deleteParticipant';
  data: Item | Participant;
  timestamp: number;
  receiptId?: string;
}

// Utility to generate participant colors
export const generateColor = (name: string): string => {
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
  ];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
