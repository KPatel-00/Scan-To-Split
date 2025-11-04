/**
 * Groups Slice - Manages saved participant groups and habit recognition
 */
import type { StateCreator } from 'zustand';
import type { SavedGroup, GroupUsageHistory } from '../types';

export interface GroupsSlice {
  savedGroups: SavedGroup[];
  groupUsageHistory: GroupUsageHistory[];
  saveGroup: (name: string) => void;
  loadGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  getGroupChecksum: () => string;
  recordGroupUsage: () => void;
  getSuggestedGroupName: () => { shouldSuggest: boolean; count: number } | null;
}

export const createGroupsSlice: StateCreator<GroupsSlice, [], [], GroupsSlice> = (set, get) => ({
  savedGroups: [],
  groupUsageHistory: [],

  saveGroup: (name) => {
    const state = get() as any;
    const participants = state.participants || [];
    if (participants.length === 0) return;
    
    const id = `group-${Date.now()}`;
    const newGroup: SavedGroup = {
      id,
      name,
      participants: JSON.parse(JSON.stringify(participants)), // deep copy
      createdAt: Date.now(),
    };
    
    set((state) => ({
      savedGroups: [...state.savedGroups, newGroup],
    }));
  },

  loadGroup: (groupId) => {
    const { savedGroups } = get();
    const group = savedGroups.find((g) => g.id === groupId);
    if (!group) return;
    
    set({ participants: JSON.parse(JSON.stringify(group.participants)) } as any);
  },

  deleteGroup: (groupId) => {
    set((state) => ({
      savedGroups: state.savedGroups.filter((g) => g.id !== groupId),
    }));
  },

  getGroupChecksum: () => {
    const state = get() as any;
    const participants = state.participants || [];
    if (participants.length < 3) return '';
    
    // Create checksum from sorted participant names
    const sortedNames = participants.map((p: any) => p.name).sort();
    return sortedNames.join(',');
  },

  recordGroupUsage: () => {
    const checksum = get().getGroupChecksum();
    if (!checksum) return;
    
    const { groupUsageHistory } = get();
    const existing = groupUsageHistory.find((h) => h.checksum === checksum);
    
    if (existing) {
      // Increment count
      set((state) => ({
        groupUsageHistory: state.groupUsageHistory.map((h) =>
          h.checksum === checksum
            ? { ...h, count: h.count + 1, lastUsed: Date.now() }
            : h
        ),
      }));
    } else {
      // Create new history entry
      set((state) => ({
        groupUsageHistory: [
          ...state.groupUsageHistory,
          { checksum, count: 1, lastUsed: Date.now() },
        ],
      }));
    }
  },

  getSuggestedGroupName: () => {
    const checksum = get().getGroupChecksum();
    if (!checksum) return null;
    
    const { groupUsageHistory, savedGroups } = get();
    const history = groupUsageHistory.find((h) => h.checksum === checksum);
    
    if (!history || history.count < 3) return null;
    
    // Check if this group is already saved
    const alreadySaved = savedGroups.some((g) => {
      const groupChecksum = g.participants.map((p) => p.name).sort().join(',');
      return groupChecksum === checksum;
    });
    
    if (alreadySaved) return null;
    
    return { shouldSuggest: true, count: history.count };
  },
});
