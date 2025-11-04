/**
 * Modals Slice - Manages all modal open/close states
 * Eliminates prop drilling of modal state through component tree
 */
import type { StateCreator } from 'zustand';

export interface ModalsSlice {
  // Modal states
  isWelcomeModalOpen: boolean;
  isWelcomeBackModalOpen: boolean;
  isSessionInsightsModalOpen: boolean;
  isPIIRedactionModalOpen: boolean;
  isMultiBillModalOpen: boolean;
  
  // Actions - Specific openers (more semantic than generic toggle)
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  
  openWelcomeBackModal: () => void;
  closeWelcomeBackModal: () => void;
  
  openSessionInsightsModal: () => void;
  closeSessionInsightsModal: () => void;
  
  openPIIRedactionModal: () => void;
  closePIIRedactionModal: () => void;
  
  openMultiBillModal: () => void;
  closeMultiBillModal: () => void;
  
  // Generic action for any future modals
  toggleModal: (modalKey: keyof Omit<ModalsSlice, 'openWelcomeModal' | 'closeWelcomeModal' | 'openWelcomeBackModal' | 'closeWelcomeBackModal' | 'openSessionInsightsModal' | 'closeSessionInsightsModal' | 'openPIIRedactionModal' | 'closePIIRedactionModal' | 'openMultiBillModal' | 'closeMultiBillModal' | 'toggleModal' | 'closeAllModals'>) => void;
  
  // Utility action - close all modals
  closeAllModals: () => void;
}

export const createModalsSlice: StateCreator<ModalsSlice, [], [], ModalsSlice> = (set) => ({
  // Initial states - all modals closed
  isWelcomeModalOpen: false,
  isWelcomeBackModalOpen: false,
  isSessionInsightsModalOpen: false,
  isPIIRedactionModalOpen: false,
  isMultiBillModalOpen: false,

  // Welcome Modal actions
  openWelcomeModal: () => set({ isWelcomeModalOpen: true }),
  closeWelcomeModal: () => set({ isWelcomeModalOpen: false }),

  // Welcome Back Modal actions
  openWelcomeBackModal: () => set({ isWelcomeBackModalOpen: true }),
  closeWelcomeBackModal: () => set({ isWelcomeBackModalOpen: false }),

  // Session Insights Modal actions
  openSessionInsightsModal: () => set({ isSessionInsightsModalOpen: true }),
  closeSessionInsightsModal: () => set({ isSessionInsightsModalOpen: false }),

  // PII Redaction Modal actions
  openPIIRedactionModal: () => set({ isPIIRedactionModalOpen: true }),
  closePIIRedactionModal: () => set({ isPIIRedactionModalOpen: false }),

  // Multi Bill Modal actions
  openMultiBillModal: () => set({ isMultiBillModalOpen: true }),
  closeMultiBillModal: () => set({ isMultiBillModalOpen: false }),

  // Generic toggle for dynamic modal management
  toggleModal: (modalKey) => set((state) => ({ [modalKey]: !state[modalKey] })),

  // Close all modals at once (useful for navigation/reset)
  closeAllModals: () =>
    set({
      isWelcomeModalOpen: false,
      isWelcomeBackModalOpen: false,
      isSessionInsightsModalOpen: false,
      isPIIRedactionModalOpen: false,
      isMultiBillModalOpen: false,
    }),
});
