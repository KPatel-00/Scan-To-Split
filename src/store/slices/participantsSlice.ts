/**
 * Participants Slice - Manages participant list and operations
 * ✨ PROMPT 9: Enhanced with XSS sanitization for all user input
 */
import type { StateCreator } from 'zustand';
import type { Participant } from '../types';
import { generateColor } from '../types';
import { sanitizeString } from '../../lib/sanitization';

export interface ParticipantsSlice {
  participants: Participant[];
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
}

export const createParticipantsSlice: StateCreator<ParticipantsSlice, [], [], ParticipantsSlice> = (
  set
) => ({
  participants: [],

  addParticipant: (name) => {
    // ✨ PROMPT 9: Sanitize user input before adding to store
    const sanitizedName = sanitizeString(name);
    
    // Don't add empty names
    if (!sanitizedName) return;
    
    const id = `participant-${Date.now()}-${Math.random()}`;
    const color = generateColor(sanitizedName);
    const newParticipant = { id, name: sanitizedName, color };
    
    set((state) => {
      const participants = [...state.participants, newParticipant];
      
      // If this is the first participant, set as default payer
      if (state.participants.length === 0) {
        const stateWithReceipts = state as any;
        return {
          participants,
          mergedPaidBy: id,
          receipts: stateWithReceipts.receipts?.map((receipt: any) => ({
            ...receipt,
            paidBy: id,
          })) || [],
        };
      }
      
      return { participants };
    });
  },

  removeParticipant: (id) =>
    set((state) => {
      const stateWithItems = state as any;
      return {
        participants: state.participants.filter((p) => p.id !== id),
        items: stateWithItems.items?.map((item: any) => ({
          ...item,
          assignedTo: item.assignedTo?.filter((pId: string) => pId !== id),
          assignments: item.assignments
            ? Object.fromEntries(
                Object.entries(item.assignments).filter(([pId]) => pId !== id)
              )
            : undefined,
        })) || [],
      };
    }),
});
