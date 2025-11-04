/**
 * UI Slice - Manages UI state (theme, language, management mode, active page)
 */
import type { StateCreator } from 'zustand';
import type { Currency } from '../types';

export interface UISlice {
  managementMode: 'merged' | 'separate';
  currency: Currency;
  theme: 'system' | 'light' | 'dark';
  language: 'en' | 'de';
  lastActivePage: string;
  isDemoData: boolean; // ✨ NEW: Track if current data is from demo
  setManagementMode: (mode: 'merged' | 'separate') => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'de') => void;
  setLastActivePage: (pathname: string) => void;
  setIsDemoData: (isDemo: boolean) => void; // ✨ NEW
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  managementMode: 'merged',
  currency: { symbol: '€', code: 'EUR' },
  theme: 'system',
  language: 'en',
  lastActivePage: '/',
  isDemoData: false, // ✨ NEW: Default to false

  setManagementMode: (mode) => set({ managementMode: mode }),
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setLastActivePage: (pathname) => set({ lastActivePage: pathname }),
  setIsDemoData: (isDemo) => set({ isDemoData: isDemo }), // ✨ NEW
});
