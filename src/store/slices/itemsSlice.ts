/**
 * Items Slice - Manages bill items in both merged and separate modes
 * ✨ PROMPT 9: Enhanced with XSS sanitization for all user input
 */
import type { StateCreator } from 'zustand';
import type { Item } from '../types';
import { sanitizeString, sanitizeNumber } from '../../lib/sanitization';
import { migrateLegacyCategory } from '../../lib/taxonomy/migration';

export interface ItemsSlice {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>, receiptId?: string) => void;
  editItem: (itemId: string, updatedItem: Partial<Item>, receiptId?: string) => void;
  deleteItem: (itemId: string, receiptId?: string) => void;
  assignItemToParticipant: (itemId: string, participantId: string, receiptId?: string) => void;
  unassignItemFromParticipant: (itemId: string, participantId: string, receiptId?: string) => void;
  clearItemAssignments: (itemId: string, receiptId?: string) => void;
  assignItemToAll: (itemId: string, receiptId?: string) => void;
  setCustomSplit: (itemId: string, splits: Record<string, number>, receiptId?: string) => void;
}

export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (set) => ({
  items: [],

  addItem: (item, receiptId) => {
    // ✨ PROMPT 9: Sanitize all user-controlled fields
    const sanitizedItem: Item = {
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      name: sanitizeString(item.name),
      category: migrateLegacyCategory(item.category), // Migrate category to new format
      quantity: sanitizeNumber(item.quantity),
      price: sanitizeNumber(item.price),
      assignedTo: [],
    };
    
    // Don't add items with empty names
    if (!sanitizedItem.name) return;
    
    if (receiptId) {
      // Handled by receipts slice
      return;
    } else {
      // Add to merged items
      set((state) => ({ items: [...state.items, sanitizedItem] }));
    }
  },

  editItem: (itemId, updatedItem, receiptId) => {
    // ✨ PROMPT 9: Sanitize updated fields
    const sanitizedUpdate: Partial<Item> = { ...updatedItem };
    
    if (updatedItem.name !== undefined) {
      sanitizedUpdate.name = sanitizeString(updatedItem.name);
      // Don't allow empty names
      if (!sanitizedUpdate.name) return;
    }
    
    if (updatedItem.category !== undefined && updatedItem.category) {
      sanitizedUpdate.category = migrateLegacyCategory(updatedItem.category);
    }
    
    if (updatedItem.quantity !== undefined) {
      sanitizedUpdate.quantity = sanitizeNumber(updatedItem.quantity);
    }
    
    if (updatedItem.price !== undefined) {
      sanitizedUpdate.price = sanitizeNumber(updatedItem.price);
    }
    
    if (receiptId) {
      // Handled by receipts slice
      return;
    } else {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...sanitizedUpdate } : item
        ),
      }));
    }
  },

  deleteItem: (itemId, receiptId) => {
    if (receiptId) {
      // Handled by receipts slice
      return;
    } else {
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    }
  },

  assignItemToParticipant: (itemId, participantId, receiptId) => {
    const updateItem = (item: Item) => {
      if (item.id !== itemId) return item;
      const assignedTo = item.assignedTo || [];
      if (assignedTo.includes(participantId)) return item;
      return { ...item, assignedTo: [...assignedTo, participantId] };
    };

    if (!receiptId) {
      set((state) => ({ items: state.items.map(updateItem) }));
    }
  },

  unassignItemFromParticipant: (itemId, participantId, receiptId) => {
    const updateItem = (item: Item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        assignedTo: (item.assignedTo || []).filter((id) => id !== participantId),
      };
    };

    if (!receiptId) {
      set((state) => ({ items: state.items.map(updateItem) }));
    }
  },

  clearItemAssignments: (itemId, receiptId) => {
    const updateItem = (item: Item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        assignedTo: [],
        assignments: undefined,
      };
    };

    if (!receiptId) {
      set((state) => ({ items: state.items.map(updateItem) }));
    }
  },

  assignItemToAll: (itemId, receiptId) => {
    if (!receiptId) {
      set((state) => {
        const participants = (state as any).participants || [];
        return {
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  assignedTo: participants.map((p: any) => p.id),
                  assignments: undefined,
                }
              : item
          ),
        };
      });
    }
  },

  setCustomSplit: (itemId, splits, receiptId) => {
    const updateItem = (item: Item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        assignments: splits,
        assignedTo: Object.keys(splits),
      };
    };

    if (!receiptId) {
      set((state) => ({ items: state.items.map(updateItem) }));
    }
  },
});
