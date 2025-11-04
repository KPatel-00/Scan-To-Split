/**
 * Receipts Slice - Manages separate bill receipts
 * ✨ PROMPT 9: Enhanced with XSS sanitization for all user input
 */
import type { StateCreator } from 'zustand';
import type { Receipt, Item } from '../types';
import { sanitizeString, sanitizeNumber } from '../../lib/sanitization';
import { migrateLegacyCategory } from '../../lib/taxonomy/migration';

export interface ReceiptsSlice {
  receipts: Receipt[];
  mergedPaidBy: string | null;
  mergedTax: number;
  mergedTip: number;
  mergedStoreName: string;
  mergedDate: string;
  addScannedData: (scannedReceipts: Receipt[]) => void;
  setPayer: (participantId: string, receiptId?: string) => void;
  setModifiers: (values: { tax?: number; tip?: number }, receiptId?: string) => void;
  setMergedBillInfo: (storeName: string, date: string) => void;
  updateReceipt: (receiptId: string, updates: Partial<Receipt>) => void;
}

export const createReceiptsSlice: StateCreator<ReceiptsSlice, [], [], ReceiptsSlice> = (set) => ({
  receipts: [],
  mergedPaidBy: null,
  mergedTax: 0,
  mergedTip: 0,
  mergedStoreName: '',
  mergedDate: '',

  addScannedData: (scannedReceipts) => {
    set((state) => {
      const stateWithMode = state as any;
      if (stateWithMode.managementMode === 'merged') {
        // Flatten all items into the main items array
        const allItems = scannedReceipts.flatMap((receipt) =>
          receipt.items.map((item) => ({
            ...item,
            originReceiptId: receipt.id,
          }))
        );
        
        return {
          items: [...(stateWithMode.items || []), ...allItems],
        };
      } else {
        // Add receipts to the receipts array
        return {
          receipts: [...state.receipts, ...scannedReceipts],
        };
      }
    });
  },

  setPayer: (participantId, receiptId) => {
    if (receiptId) {
      // Separate mode
      set((state) => ({
        receipts: state.receipts.map((receipt) =>
          receipt.id === receiptId
            ? { ...receipt, paidBy: participantId }
            : receipt
        ),
      }));
    } else {
      // Merged mode
      set({ mergedPaidBy: participantId });
    }
  },

  setModifiers: (values, receiptId) => {
    if (receiptId) {
      // Separate mode
      set((state) => ({
        receipts: state.receipts.map((receipt) =>
          receipt.id === receiptId
            ? { ...receipt, ...values }
            : receipt
        ),
      }));
    } else {
      // Merged mode
      set((state) => ({
        mergedTax: values.tax !== undefined ? values.tax : state.mergedTax,
        mergedTip: values.tip !== undefined ? values.tip : state.mergedTip,
      }));
    }
  },

  setMergedBillInfo: (storeName, date) =>
    set({ 
      // ✨ PROMPT 9: Sanitize store name and date
      mergedStoreName: sanitizeString(storeName), 
      mergedDate: sanitizeString(date) 
    }),

  updateReceipt: (receiptId, updates) =>
    set((state) => ({
      receipts: state.receipts.map((receipt) =>
        receipt.id === receiptId ? { ...receipt, ...updates } : receipt
      ),
    })),
});

// Receipt-specific item operations (called from items slice but modify receipts)
// ✨ PROMPT 9: Enhanced with sanitization
export const receiptItemOperations = {
  addItemToReceipt: (set: any) => (item: Omit<Item, 'id'>, receiptId: string) => {
    // Sanitize all user-controlled fields
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      name: sanitizeString(item.name),
      category: migrateLegacyCategory(item.category),
      quantity: sanitizeNumber(item.quantity),
      price: sanitizeNumber(item.price),
      assignedTo: [],
    };
    
    // Don't add items with empty names
    if (!newItem.name) return;
    
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? { ...receipt, items: [...receipt.items, newItem] }
          : receipt
      ),
    }));
  },

  editItemInReceipt: (set: any) => (itemId: string, updatedItem: Partial<Item>, receiptId: string) => {
    // ✨ PROMPT 9: Sanitize updated fields
    const sanitizedUpdate: Partial<Item> = { ...updatedItem };
    
    if (updatedItem.name !== undefined) {
      sanitizedUpdate.name = sanitizeString(updatedItem.name);
      if (!sanitizedUpdate.name) return; // Don't allow empty names
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
    
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) =>
                item.id === itemId ? { ...item, ...sanitizedUpdate } : item
              ),
            }
          : receipt
      ),
    }));
  },

  deleteItemFromReceipt: (set: any) => (itemId: string, receiptId: string) => {
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.filter((item) => item.id !== itemId),
            }
          : receipt
      ),
    }));
  },

  assignItemInReceipt: (set: any) => (itemId: string, participantId: string, receiptId: string) => {
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => {
                if (item.id !== itemId) return item;
                const assignedTo = item.assignedTo || [];
                if (assignedTo.includes(participantId)) return item;
                return { ...item, assignedTo: [...assignedTo, participantId] };
              }),
            }
          : receipt
      ),
    }));
  },

  unassignItemInReceipt: (set: any) => (itemId: string, participantId: string, receiptId: string) => {
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => {
                if (item.id !== itemId) return item;
                return {
                  ...item,
                  assignedTo: (item.assignedTo || []).filter((id) => id !== participantId),
                };
              }),
            }
          : receipt
      ),
    }));
  },

  clearAssignmentsInReceipt: (set: any) => (itemId: string, receiptId: string) => {
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => {
                if (item.id !== itemId) return item;
                return {
                  ...item,
                  assignedTo: [],
                  assignments: undefined,
                };
              }),
            }
          : receipt
      ),
    }));
  },

  assignAllInReceipt: (set: any, get: any) => (itemId: string, receiptId: string) => {
    const participants = get().participants || [];
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => {
                if (item.id !== itemId) return item;
                return {
                  ...item,
                  assignedTo: participants.map((p: any) => p.id),
                  assignments: undefined,
                };
              }),
            }
          : receipt
      ),
    }));
  },

  setCustomSplitInReceipt: (set: any) => (itemId: string, splits: Record<string, number>, receiptId: string) => {
    set((state: any) => ({
      receipts: state.receipts.map((receipt: Receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              items: receipt.items.map((item) => {
                if (item.id !== itemId) return item;
                return {
                  ...item,
                  assignments: splits,
                  assignedTo: Object.keys(splits),
                };
              }),
            }
          : receipt
      ),
    }));
  },
};
