/**
 * Main Store - Combines all slices with persistence
 * Refactored for better maintainability and performance
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createItemsSlice, type ItemsSlice } from './slices/itemsSlice';
import { createParticipantsSlice, type ParticipantsSlice } from './slices/participantsSlice';
import { createReceiptsSlice, type ReceiptsSlice, receiptItemOperations } from './slices/receiptsSlice';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { createGroupsSlice, type GroupsSlice } from './slices/groupsSlice';
import { createUndoSlice, type UndoSlice } from './slices/undoSlice';
import { createModalsSlice, type ModalsSlice } from './slices/modalsSlice';
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice';
import { createScanningSlice, type ScanningSlice } from './slices/scanningSlice';
import { migrateItems } from '../lib/taxonomy/migration';

// Export types from slices
export type {
  Item,
  Receipt,
  Participant,
  SavedGroup,
  GroupUsageHistory,
  Currency,
  UndoableAction,
} from './types';

// Export new slice types
export type { ModalsSlice } from './slices/modalsSlice';
export type { SettingsSlice } from './slices/settingsSlice';
export type { ScanningSlice } from './slices/scanningSlice';

// Combined store type
type StoreState = ItemsSlice &
  ParticipantsSlice &
  ReceiptsSlice &
  UISlice &
  GroupsSlice &
  UndoSlice &
  ModalsSlice &
  SettingsSlice &
  ScanningSlice & {
    // Global actions that operate across slices
    clearSession: () => void;
    clearAll: () => void;
  };

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      // Combine all slices
      ...createItemsSlice(set, get, api),
      ...createParticipantsSlice(set, get, api),
      ...createReceiptsSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createGroupsSlice(set, get, api),
      ...createUndoSlice(set, get, api),
      ...createModalsSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createScanningSlice(set, get, api),

      // Override item actions to handle both merged and receipt modes
      addItem: (item, receiptId) => {
        const newItem = {
          ...item,
          id: `item-${Date.now()}-${Math.random()}`,
          assignedTo: [],
        };
        
        if (receiptId) {
          receiptItemOperations.addItemToReceipt(set)(item, receiptId);
        } else {
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      editItem: (itemId, updatedItem, receiptId) => {
        if (receiptId) {
          receiptItemOperations.editItemInReceipt(set)(itemId, updatedItem, receiptId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, ...updatedItem } : item
            ),
          }));
        }
      },

      deleteItem: (itemId, receiptId) => {
        if (receiptId) {
          receiptItemOperations.deleteItemFromReceipt(set)(itemId, receiptId);
        } else {
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }));
        }
      },

      assignItemToParticipant: (itemId, participantId, receiptId) => {
        if (receiptId) {
          receiptItemOperations.assignItemInReceipt(set)(itemId, participantId, receiptId);
        } else {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== itemId) return item;
              const assignedTo = item.assignedTo || [];
              if (assignedTo.includes(participantId)) return item;
              return { ...item, assignedTo: [...assignedTo, participantId] };
            }),
          }));
        }
      },

      unassignItemFromParticipant: (itemId, participantId, receiptId) => {
        if (receiptId) {
          receiptItemOperations.unassignItemInReceipt(set)(itemId, participantId, receiptId);
        } else {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== itemId) return item;
              return {
                ...item,
                assignedTo: (item.assignedTo || []).filter((id) => id !== participantId),
              };
            }),
          }));
        }
      },

      clearItemAssignments: (itemId, receiptId) => {
        if (receiptId) {
          receiptItemOperations.clearAssignmentsInReceipt(set)(itemId, receiptId);
        } else {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== itemId) return item;
              return {
                ...item,
                assignedTo: [],
                assignments: undefined,
              };
            }),
          }));
        }
      },

      assignItemToAll: (itemId, receiptId) => {
        if (receiptId) {
          receiptItemOperations.assignAllInReceipt(set, get)(itemId, receiptId);
        } else {
          const { participants } = get();
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== itemId) return item;
              return {
                ...item,
                assignedTo: participants.map((p) => p.id),
                assignments: undefined,
              };
            }),
          }));
        }
      },

      setCustomSplit: (itemId, splits, receiptId) => {
        if (receiptId) {
          receiptItemOperations.setCustomSplitInReceipt(set)(itemId, splits, receiptId);
        } else {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== itemId) return item;
              return {
                ...item,
                assignments: splits,
                assignedTo: Object.keys(splits),
              };
            }),
          }));
        }
      },

      // Global actions
      clearSession: () =>
        set((state) => ({
          managementMode: 'merged',
          items: [],
          participants: [],
          receipts: [],
          lastActivePage: '/',
          mergedPaidBy: null,
          mergedTax: 0,
          mergedTip: 0,
          mergedStoreName: '',
          mergedDate: '',
          undoStack: [],
          // Close all modals on session clear
          isWelcomeModalOpen: false,
          isWelcomeBackModalOpen: false,
          isSessionInsightsModalOpen: false,
          isPIIRedactionModalOpen: false,
          isMultiBillModalOpen: false,
          // Reset scanning state
          isScanning: false,
          scanFileCount: 0,
          piiDetections: [],
          pendingFiles: [],
          scannedReceiptsData: [],
          // ✨ PRESERVE isDemoData (will be set to true by demo, false by real upload)
          // Don't reset it here - let the caller control it
          // Keep theme, language, and settings
          theme: state.theme,
          language: state.language,
          hapticFeedback: state.hapticFeedback,
          soundFeedback: state.soundFeedback,
        })),

      clearAll: () => {
        set({
          participants: [],
          items: [],
          receipts: [],
          managementMode: 'merged',
          mergedTax: 0,
          mergedTip: 0,
          mergedStoreName: '',
          mergedDate: '',
          lastActivePage: '/',
          // Close all modals
          isWelcomeModalOpen: false,
          isWelcomeBackModalOpen: false,
          isSessionInsightsModalOpen: false,
          isPIIRedactionModalOpen: false,
          isMultiBillModalOpen: false,
          // Reset scanning state
          isScanning: false,
          scanFileCount: 0,
          piiDetections: [],
          pendingFiles: [],
          scannedReceiptsData: [],
          // Keep savedGroups, groupUsageHistory, currency, theme, language, and settings (user preferences)
        });
      },
    }),
    {
      name: 'scantosplit-storage',
      version: 2,
      
      migrate: (persistedState: any, version: number) => {
        console.log(`[Migration] From version ${version} to 2`);
        
        // Version 1 → 2: Migrate categories to taxonomy format
        if (version < 2) {
          console.log('[Migration] Migrating categories to taxonomy format...');
          
          const migratedState = { ...persistedState };
          
          // Migrate merged items
          if (migratedState.items && Array.isArray(migratedState.items)) {
            const before = migratedState.items.length;
            migratedState.items = migrateItems(migratedState.items);
            console.log(`[Migration] Migrated ${before} merged items`);
          }
          
          // Migrate receipt items
          if (migratedState.receipts && Array.isArray(migratedState.receipts)) {
            migratedState.receipts = migratedState.receipts.map((receipt: any) => {
              if (receipt.items && Array.isArray(receipt.items)) {
                const before = receipt.items.length;
                receipt.items = migrateItems(receipt.items);
                console.log(`[Migration] Migrated ${before} items in receipt ${receipt.id}`);
              }
              return receipt;
            });
          }
          
          console.log('[Migration] Category migration complete ✅');
          return migratedState;
        }
        
        return persistedState;
      },
      
      // Handle migration errors gracefully
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            console.error('[Storage] Failed to rehydrate:', error);
            // Don't clear storage automatically - let user decide
            console.warn('[Storage] Please refresh the page. If issues persist, contact support.');
          } else {
            console.log('[Storage] Rehydration complete');
          }
        };
      },
    }
  )
);

// Export selectors
export { itemSelectors } from './selectors/itemSelectors';
export { receiptSelectors } from './selectors/receiptSelectors';
export { participantSelectors } from './selectors/participantSelectors';
