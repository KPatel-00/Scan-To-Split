/**
 * Scanning Slice - Manages AI receipt scanning state
 * Extracted from useFileUpload hook for global state management
 */
import type { StateCreator } from 'zustand';
import type { PIIDetection } from '../../lib/piiDetection';

export interface ScanningSlice {
  // Scanning state
  isScanning: boolean;
  scanFileCount: number;
  
  // PII detection state
  piiDetections: PIIDetection[];
  pendingFiles: File[];
  
  // Scanned receipts data (before confirmation)
  scannedReceiptsData: any[]; // TODO: Type this properly based on scanReceiptsClient return type
  
  // Actions
  setIsScanning: (isScanning: boolean) => void;
  setScanFileCount: (count: number) => void;
  setPIIDetections: (detections: PIIDetection[]) => void;
  setPendingFiles: (files: File[]) => void;
  setScannedReceiptsData: (data: any[]) => void;
  
  // Compound actions
  startScanning: (fileCount: number) => void;
  stopScanning: () => void;
  
  // Reset scanning state (after successful scan or cancel)
  resetScanningState: () => void;
}

export const createScanningSlice: StateCreator<ScanningSlice, [], [], ScanningSlice> = (set) => ({
  // Initial state
  isScanning: false,
  scanFileCount: 0,
  piiDetections: [],
  pendingFiles: [],
  scannedReceiptsData: [],

  // Basic setters
  setIsScanning: (isScanning) => set({ isScanning }),
  setScanFileCount: (count) => set({ scanFileCount: count }),
  setPIIDetections: (detections) => set({ piiDetections: detections }),
  setPendingFiles: (files) => set({ pendingFiles: files }),
  setScannedReceiptsData: (data) => set({ scannedReceiptsData: data }),

  // Compound actions for convenience
  startScanning: (fileCount) =>
    set({
      isScanning: true,
      scanFileCount: fileCount,
    }),

  stopScanning: () =>
    set({
      isScanning: false,
      scanFileCount: 0,
    }),

  // Complete reset (cleanup after scan workflow)
  resetScanningState: () =>
    set({
      isScanning: false,
      scanFileCount: 0,
      piiDetections: [],
      pendingFiles: [],
      scannedReceiptsData: [],
    }),
});
