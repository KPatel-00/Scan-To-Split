/**
 * Item Selectors - Derived state and computed values for items
 */
import type { Item } from '../types';
import { getCategoryName } from '../../lib/taxonomy/migration';

export const itemSelectors = {
  /**
   * Get total number of items
   */
  getTotalItemCount: (items: Item[]): number => items.length,

  /**
   * Get total value of all items
   */
  getTotalItemsValue: (items: Item[]): number =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  /**
   * Get items assigned to a specific participant
   */
  getItemsForParticipant: (items: Item[], participantId: string): Item[] =>
    items.filter((item) => item.assignedTo?.includes(participantId)),

  /**
   * Get unassigned items
   */
  getUnassignedItems: (items: Item[]): Item[] =>
    items.filter((item) => !item.assignedTo || item.assignedTo.length === 0),

  /**
   * Get items by category
   */
  getItemsByCategory: (items: Item[]): Record<string, Item[]> =>
    items.reduce((acc, item) => {
      const category = getCategoryName(item.category, 'de') || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>),
};
