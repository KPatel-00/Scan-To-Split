/**
 * CustomSplitPopover Module Exports
 * 
 * Main entry point for the CustomSplitPopover feature module.
 */

export { default as CustomSplitPopover } from './CustomSplitPopover';

// Optional: Export components for reuse
export { SplitModeSelector } from './components/SplitModeSelector';
export { AmountSplitForm } from './components/AmountSplitForm';
export { PercentageSplitForm } from './components/PercentageSplitForm';
export { SharesSplitForm } from './components/SharesSplitForm';
export { SplitValidationDisplay } from './components/SplitValidationDisplay';

// Optional: Export hooks
export { useCustomSplit } from './hooks/useCustomSplit';

// Optional: Export utilities
export {
  calculateLiveTotal,
  convertSplitMode,
  convertToAmounts,
} from './utils/splitCalculations';
export { validateTotal, initializeSplitValues } from './utils/splitValidation';

// Optional: Export types
export type { SplitMode } from './utils/splitCalculations';
