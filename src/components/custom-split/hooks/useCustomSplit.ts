/**
 * Custom Split Hook - Real-time validation with react-hook-form
 * ✨ PROMPT 9: Enhanced with react-hook-form for real-time validation
 * 
 * Features:
 * - Watches all participant input fields in real-time
 * - Calculates live total by summing watched values
 * - Real-time validation: text-green-500 if match, text-red-700 if mismatch
 * - Disabled "Done" button tied to validation state
 */

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../../store/useStore';
import { feedback } from '../../../lib/feedback';
import type { Item, Participant } from '../../../store/types';
import type { SplitMode } from '../utils/splitCalculations';
import {
  calculateLiveTotal,
  convertSplitMode,
  convertToAmounts,
} from '../utils/splitCalculations';
import { validateTotal, initializeSplitValues } from '../utils/splitValidation';

interface UseCustomSplitProps {
  item: Item;
  assignedParticipants: Participant[];
  receiptId?: string;
  isOpen: boolean;
}

// Form values type
type SplitFormValues = Record<string, string>;

export function useCustomSplit({
  item,
  assignedParticipants,
  receiptId,
  isOpen,
}: UseCustomSplitProps) {
  const { currency } = useStore();
  const setCustomSplit = useStore((state) => state.setCustomSplit);

  const [mode, setMode] = useState<SplitMode>('amount');
  const itemTotal = item.price * item.quantity;

  // ✨ PROMPT 9: Use react-hook-form for real-time field watching
  const { watch, setValue, reset, handleSubmit } = useForm<SplitFormValues>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {},
  });

  // Watch all field values in real-time
  const watchedValues = watch();

  // Initialize values when popover opens
  useEffect(() => {
    if (isOpen) {
      const participantIds = assignedParticipants.map((p) => p.id);
      const initialValues = initializeSplitValues(
        itemTotal,
        participantIds,
        item.assignments
      );
      
      // Reset form with initial values
      reset(initialValues);
      setMode('amount');
    }
  }, [isOpen, item.assignments, assignedParticipants, itemTotal, reset]);

  // ✨ PROMPT 9: Calculate live total from watched fields
  const liveTotal = useMemo(() => {
    return calculateLiveTotal(watchedValues, mode, itemTotal, assignedParticipants);
  }, [watchedValues, mode, assignedParticipants, itemTotal]);

  // ✨ PROMPT 9: Real-time validation - compare live total to item total
  const isValid = validateTotal(liveTotal, itemTotal);

  // Handle mode change with smart conversion
  const handleModeChange = (newMode: SplitMode) => {
    if (!newMode) return;

    const newValues = convertSplitMode(
      watchedValues,
      mode,
      newMode,
      itemTotal,
      assignedParticipants
    );

    // Update all form fields with converted values
    Object.entries(newValues).forEach(([participantId, value]) => {
      setValue(participantId, value);
    });

    setMode(newMode);
    feedback.click();
  };

  // Handle individual value change
  const handleValueChange = (participantId: string, value: string) => {
    setValue(participantId, value, { shouldValidate: true });
  };

  // Save custom split
  const onSubmit = (data: SplitFormValues) => {
    // Only save if validation passes
    if (!isValid) {
      feedback.error();
      return false;
    }

    const splits = convertToAmounts(data, mode, itemTotal, assignedParticipants);
    setCustomSplit(item.id, splits, receiptId);
    feedback.success();
    return true;
  };

  const handleSave = () => {
    return handleSubmit(onSubmit)();
  };

  // Get mode symbol for input adornment
  const getModeSymbol = () => {
    if (mode === 'amount') return currency.symbol;
    if (mode === 'percentage') return '%';
    return 'x';
  };

  // Get step value for input
  const getStep = () => {
    if (mode === 'percentage') return '0.1';
    if (mode === 'shares') return '1';
    return '0.01';
  };

  return {
    mode,
    values: watchedValues, // Now watched by react-hook-form
    itemTotal,
    liveTotal,
    isValid,
    currency,
    handleModeChange,
    handleValueChange,
    handleSave,
    getModeSymbol,
    getStep,
  };
}
