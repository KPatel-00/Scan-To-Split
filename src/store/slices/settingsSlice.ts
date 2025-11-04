/**
 * Settings Slice - Manages user preferences and settings
 * Separated from UI slice for cleaner domain boundaries
 */
import type { StateCreator } from 'zustand';

export interface SettingsSlice {
  // Feedback preferences
  hapticFeedback: boolean;
  soundFeedback: boolean;
  
  // Future settings can be added here
  // e.g., autoSave, notifications, etc.
  
  // Actions
  setHapticFeedback: (enabled: boolean) => void;
  setSoundFeedback: (enabled: boolean) => void;
  toggleHapticFeedback: () => void;
  toggleSoundFeedback: () => void;
  
  // Utility - reset all settings to defaults
  resetSettings: () => void;
}

// Default settings
const DEFAULT_SETTINGS = {
  hapticFeedback: true,
  soundFeedback: true,
} as const;

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  // Initial state - defaults
  hapticFeedback: DEFAULT_SETTINGS.hapticFeedback,
  soundFeedback: DEFAULT_SETTINGS.soundFeedback,

  // Setters
  setHapticFeedback: (enabled) => set({ hapticFeedback: enabled }),
  setSoundFeedback: (enabled) => set({ soundFeedback: enabled }),

  // Toggles (more convenient for switches)
  toggleHapticFeedback: () => set((state) => ({ hapticFeedback: !state.hapticFeedback })),
  toggleSoundFeedback: () => set((state) => ({ soundFeedback: !state.soundFeedback })),

  // Reset to defaults
  resetSettings: () => set(DEFAULT_SETTINGS),
});
