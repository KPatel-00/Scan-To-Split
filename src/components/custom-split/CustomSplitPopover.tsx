/**
 * Custom Split Popover - Real-time validation with react-hook-form
 * ✨ PROMPT 9: Enhanced with react-hook-form and edge case handling
 * 
 * Features:
 * - Real-time field watching with react-hook-form
 * - Live total calculation displayed below list
 * - Color-coded validation: green if match, red if mismatch
 * - Disabled "Done" button tied to validation
 * - Auto-close on participant change (edge case)
 */

import { useState, useEffect, useRef } from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { feedback } from '../../lib/feedback';
import type { Item, Participant } from '../../store/types';
import { useCustomSplit } from './hooks/useCustomSplit';
import { SplitModeSelector } from './components/SplitModeSelector';
import { AmountSplitForm } from './components/AmountSplitForm';
import { SplitValidationDisplay } from './components/SplitValidationDisplay';
import { smoothNormal } from '@/lib/motion/physics';

interface CustomSplitPopoverProps {
  item: Item;
  assignedParticipants: Participant[];
  receiptId?: string;
}

export default function CustomSplitPopover({
  item,
  assignedParticipants,
  receiptId,
}: CustomSplitPopoverProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  
  // ✨ PROMPT 9: Track participant IDs to detect changes
  const participantIdsRef = useRef<string[]>([]);

  const {
    mode,
    values,
    itemTotal,
    liveTotal,
    isValid,
    currency,
    handleModeChange,
    handleValueChange,
    handleSave,
    getModeSymbol,
    getStep,
  } = useCustomSplit({
    item,
    assignedParticipants,
    receiptId,
    isOpen: open,
  });

  // ✨ PROMPT 9: Edge Case - Auto-close if participants change while open
  useEffect(() => {
    if (open) {
      const currentIds = assignedParticipants.map(p => p.id).sort().join(',');
      const previousIds = participantIdsRef.current.sort().join(',');
      
      // Check if participant list changed (not just first open)
      if (previousIds && currentIds !== previousIds) {
        setOpen(false);
        feedback.error();
      }
      
      // Update ref
      participantIdsRef.current = assignedParticipants.map(p => p.id);
    }
  }, [open, assignedParticipants]);

  // Also close if less than 2 participants
  useEffect(() => {
    if (open && assignedParticipants.length < 2) {
      setOpen(false);
      feedback.error();
    }
  }, [open, assignedParticipants.length]);

  const handleSaveClick = () => {
    handleSave();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    feedback.click();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          disabled={assignedParticipants.length < 2}
          onClick={() => feedback.click()}
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full md:w-96 max-w-[90vw] p-0"
        align="center"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={smoothNormal}
        >
          {/* Header */}
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">
              {t('assignment.customSplit.title', { itemName: item.name })}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('assignment.customSplit.total')}: {currency.symbol}
              {itemTotal.toFixed(2)}
            </p>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Mode Switcher */}
            <SplitModeSelector mode={mode} onModeChange={handleModeChange} />

            {/* Participant List Form */}
            <AmountSplitForm
              participants={assignedParticipants}
              values={values}
              modeSymbol={getModeSymbol()}
              step={getStep()}
              onValueChange={handleValueChange}
            />

            {/* Live Total Validation */}
            <SplitValidationDisplay
              liveTotal={liveTotal}
              expectedTotal={itemTotal}
              isValid={isValid}
              currency={currency}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              {t('buttons.cancel')}
            </Button>
            {/* ✨ PROMPT 9: Disabled state tied to validation */}
            <Button onClick={handleSaveClick} disabled={!isValid}>
              {t('buttons.done')}
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
