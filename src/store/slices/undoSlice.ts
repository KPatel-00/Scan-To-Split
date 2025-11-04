/**
 * Undo Slice - Manages undo/redo functionality
 */
import type { StateCreator } from 'zustand';
import type { UndoableAction, Item, Participant } from '../types';

export interface UndoSlice {
  undoStack: UndoableAction[];
  pushUndoAction: (action: UndoableAction) => void;
  undoLastAction: () => void;
}

export const createUndoSlice: StateCreator<UndoSlice, [], [], UndoSlice> = (set, get) => ({
  undoStack: [],

  pushUndoAction: (action) =>
    set((state) => ({
      undoStack: [...state.undoStack, action],
    })),

  undoLastAction: () => {
    const state = get() as any;
    const lastAction = state.undoStack[state.undoStack.length - 1];
    
    if (!lastAction) return;

    // Restore the deleted item or participant
    if (lastAction.type === 'deleteItem') {
      const item = lastAction.data as Item;
      if (lastAction.receiptId) {
        // Restore to specific receipt
        set((currentState: any) => ({
          receipts: currentState.receipts.map((receipt: any) =>
            receipt.id === lastAction.receiptId
              ? { ...receipt, items: [...receipt.items, item] }
              : receipt
          ),
          undoStack: currentState.undoStack.slice(0, -1),
        }));
      } else {
        // Restore to merged items
        set((currentState: any) => ({
          items: [...currentState.items, item],
          undoStack: currentState.undoStack.slice(0, -1),
        }));
      }
    } else if (lastAction.type === 'deleteParticipant') {
      const participant = lastAction.data as Participant;
      set((currentState: any) => ({
        participants: [...currentState.participants, participant],
        undoStack: currentState.undoStack.slice(0, -1),
      }));
    }
  },
});
