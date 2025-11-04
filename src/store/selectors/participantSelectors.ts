/**
 * Participant Selectors - Filtering and derived state for participants
 */
import type { Participant, Item } from '../types';

export const participantSelectors = {
  /**
   * Get participant by ID
   */
  getParticipantById: (participants: Participant[], id: string): Participant | undefined =>
    participants.find((p) => p.id === id),

  /**
   * Get participants who have items assigned
   */
  getActiveParticipants: (participants: Participant[], items: Item[]): Participant[] => {
    const activeIds = new Set(
      items.flatMap((item) => item.assignedTo || [])
    );
    return participants.filter((p) => activeIds.has(p.id));
  },

  /**
   * Count items assigned to a participant
   */
  getParticipantItemCount: (participantId: string, items: Item[]): number =>
    items.filter((item) => item.assignedTo?.includes(participantId)).length,
};
