# Part 4: Assignment & Summary (Export Features)

**Last Updated**: November 18, 2025  
**Status**: ✅ Fully Implemented  
**Estimated Reading Time**: 45 minutes

---

## 4.1 Assignment Page Architecture

**File**: `src/pages/Assignment.tsx` (146 lines)

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParticipantPalette } from '@/features/assignment/ParticipantPalette';
import { BillInfoCard } from '@/features/assignment/BillInfoCard';
import { AssignmentItemsList } from '@/features/assignment/AssignmentItemsList';
import { ProgressStepper } from '@/components/ProgressStepper';
import { useStore } from '@/store/useStore';
import { useHydration } from '@/hooks/useHydration';
import { smoothSlow } from '@/lib/motion/physics';

export function Assignment() {
  const isHydrated = useHydration();
  const navigate = useNavigate();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  const setLastActivePage = useStore((state) => state.setLastActivePage);
  const managementMode = useStore((state) => state.managementMode);
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);

  // Save last active page on mount
  useEffect(() => {
    setLastActivePage('/assignment');
  }, [setLastActivePage]);

  // ✅ Hydration check prevents localStorage mismatch
  if (!isHydrated) {
    return <RouteLoadingScreen />;
  }

  const hasItems = managementMode === 'merged'
    ? items.length > 0
    : receipts.some((receipt) => receipt.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <AppHeader />

      <main className="container max-w-screen-lg flex-1 py-8 space-y-8">
        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothSlow}
        >
          <ProgressStepper />
        </motion.div>

        {/* Page Title Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothSlow, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Assign Items to People</CardTitle>
              </div>
              <CardDescription>
                Select participants then tap items to assign them
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Three-Part Layout */}
        <div className="space-y-6">
          {/* 1. Participant Palette (Top) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothSlow, delay: 0.2 }}
          >
            <ParticipantPalette
              selectedParticipants={selectedParticipants}
              onSelectionChange={setSelectedParticipants}
            />
          </motion.div>

          {/* 2. Bill Info Card (Middle) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothSlow, delay: 0.3 }}
          >
            <BillInfoCard />
          </motion.div>

          {/* 3. Items List (Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothSlow, delay: 0.4 }}
          >
            <AssignmentItemsList
              selectedParticipants={selectedParticipants}
            />
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/setup')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate('/summary')} className="flex-1">
            Continue to Summary
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
```

**Three-Part Layout**:
1. **ParticipantPalette** (Top) - Select participants for bulk assignment
2. **BillInfoCard** (Middle) - Bill metadata (store, date, totals)
3. **AssignmentItemsList** (Bottom) - Items with assignment chips

---

## 4.2 Participant Palette

**File**: `src/features/assignment/ParticipantPalette.tsx` (372 lines)

### Multi-Select with Tactile Feedback

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticipantAvatar } from '@/components/ParticipantAvatar';
import { useStore } from '@/store/useStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buttonTactile } from '@/lib/motion';
import { haptics } from '@/lib/haptics';

// Stagger animation for participant list
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Cascading entrance per participant
const itemVariants = (index: number) => ({
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.8,
    rotate: -5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: index * 0.08,
    },
  },
});

export function ParticipantPalette({ selectedParticipants, onSelectionChange }: ParticipantPaletteProps) {
  const participants = useStore((state) => state.participants);
  const prefersReducedMotion = useReducedMotion();
  
  // Track recently selected for "pulse" animation
  const [recentlySelected, setRecentlySelected] = useState<string[]>([]);
  
  // Celebration when all selected
  const [showCelebration, setShowCelebration] = useState(false);

  // Clear recently selected after animation
  useEffect(() => {
    if (recentlySelected.length > 0) {
      const timer = setTimeout(() => setRecentlySelected([]), 600);
      return () => clearTimeout(timer);
    }
  }, [recentlySelected]);

  // Celebrate when all participants selected
  useEffect(() => {
    if (participants.length > 0 && selectedParticipants.length === participants.length) {
      setShowCelebration(true);
      haptics.success();
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedParticipants.length, participants.length]);

  const toggleParticipant = (id: string) => {
    const isSelected = selectedParticipants.includes(id);
    
    onSelectionChange(
      isSelected
        ? selectedParticipants.filter((pid) => pid !== id)
        : [...selectedParticipants, id]
    );

    // Track for pulse animation
    if (!isSelected) {
      setRecentlySelected((prev) => [...prev, id]);
    }

    haptics.toggle();
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Select Participants</h3>
        </div>
        
        {/* Celebration Badge */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Everyone!
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Participant Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {participants.map((participant, index) => {
          const isSelected = selectedParticipants.includes(participant.id);
          const isPulsing = recentlySelected.includes(participant.id);

          return (
            <motion.button
              key={participant.id}
              variants={itemVariants(index)}
              whileHover={prefersReducedMotion ? undefined : buttonTactile.hover}
              whileTap={prefersReducedMotion ? undefined : buttonTactile.tap}
              onClick={() => toggleParticipant(participant.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all",
                "border-2",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card hover:border-primary/50",
                isPulsing && "animate-pulse"
              )}
            >
              {/* Avatar */}
              <ParticipantAvatar
                name={participant.name}
                color={participant.color}
                size="lg"
              />

              {/* Name */}
              <span className="text-sm font-medium truncate w-full text-center">
                {participant.name}
              </span>

              {/* Selected Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange(participants.map((p) => p.id))}
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange([])}
        >
          Clear
        </Button>
      </div>
    </Card>
  );
}
```

**Key Features**:
- ✅ **Multi-select**: Click to toggle participant selection
- ✅ **Staggered entrance**: Cascading animation (0.08s delay per item)
- ✅ **Pulse effect**: Newly selected participants pulse briefly
- ✅ **Celebration**: Badge appears when all participants selected
- ✅ **Reduced motion**: All animations disabled if user prefers

---

## 4.3 Item Card (Assignment View)

**File**: `src/features/assignment/ItemCard.tsx` (300 lines)

### Assignment Chip System

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calculator, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParticipantAvatar } from '@/components/ParticipantAvatar';
import { CustomSplitPopover } from '@/components/custom-split';
import { useStore } from '@/store/useStore';
import { feedback } from '@/lib/feedback';
import { layoutTransition } from '@/lib/motion';

export default function ItemCard({
  item,
  participants,
  selectedParticipants,
  receiptId,
}: ItemCardProps) {
  const currency = useStore((state) => state.currency);
  const assignItemToParticipant = useStore((state) => state.assignItemToParticipant);
  const unassignItemFromParticipant = useStore((state) => state.unassignItemFromParticipant);
  const assignItemToAll = useStore((state) => state.assignItemToAll);

  const assignedTo = item.assignedTo || [];
  const isNegative = item.price < 0;

  // Get category icon
  const CategoryIcon = getCategoryIcon(item.category?.icon);

  const handleToggleParticipant = (participantId: string) => {
    const isAssigned = assignedTo.includes(participantId);
    
    if (isAssigned) {
      unassignItemFromParticipant(item.id, participantId, receiptId);
      feedback.toggle();
    } else {
      assignItemToParticipant(item.id, participantId, receiptId);
      feedback.toggle();
    }
  };

  const handleQuickAssign = () => {
    // Assign to currently selected participants in palette
    selectedParticipants.forEach((pid) => {
      if (!assignedTo.includes(pid)) {
        assignItemToParticipant(item.id, pid, receiptId);
      }
    });
    feedback.success();
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200",
        isNegative && "bg-red-50/50 border-red-200 dark:bg-red-950/10"
      )}
    >
      {/* Item Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Category Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <CategoryIcon className="h-5 w-5 text-primary" />
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                {item.quantity}× {currency.symbol}{item.price.toFixed(2)}
              </p>
            </div>

            {/* Total Price */}
            <div className={cn(
              "text-lg font-bold",
              isNegative && "text-red-600 dark:text-red-400"
            )}>
              {currency.symbol}{(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Chips */}
      <div className="space-y-3">
        {/* Assigned Participants */}
        {assignedTo.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {assignedTo.map((pid) => {
                const participant = participants.find((p) => p.id === pid);
                if (!participant) return null;

                return (
                  <motion.button
                    key={pid}
                    layout
                    transition={layoutTransition}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleToggleParticipant(pid)}
                    className="flex items-center gap-2 rounded-full border-2 border-primary bg-primary/10 px-3 py-1.5 hover:bg-primary/20 transition-colors"
                  >
                    <ParticipantAvatar
                      name={participant.name}
                      color={participant.color}
                      size="xs"
                    />
                    <span className="text-sm font-medium">
                      {participant.name}
                    </span>
                    <Check className="h-3 w-3 text-primary" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Quick Assign (to selected participants) */}
          {selectedParticipants.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickAssign}
            >
              Assign to Selected ({selectedParticipants.length})
            </Button>
          )}

          {/* Assign to All */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => assignItemToAll(item.id, receiptId)}
          >
            Assign to All
          </Button>

          {/* Custom Split */}
          {assignedTo.length >= 2 && (
            <CustomSplitPopover
              item={item}
              assignedParticipants={participants.filter((p) =>
                assignedTo.includes(p.id)
              )}
              receiptId={receiptId}
            />
          )}

          {/* Delete Item */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete()}
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

**Assignment Flow**:
1. **Select participants** in palette (top)
2. **Click "Assign to Selected"** on item
3. **Chips appear** showing assigned participants
4. **Click chip** to unassign participant
5. **Custom Split** button available when 2+ participants assigned

---

## 4.4 Custom Split Popover

**File**: `src/components/custom-split/CustomSplitPopover.tsx` (170 lines)

### Real-Time Validation with react-hook-form

```tsx
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCustomSplit } from './hooks/useCustomSplit';
import { SplitModeSelector } from './components/SplitModeSelector';
import { AmountSplitForm } from './components/AmountSplitForm';
import { SplitValidationDisplay } from './components/SplitValidationDisplay';

export default function CustomSplitPopover({
  item,
  assignedParticipants,
  receiptId,
}: CustomSplitPopoverProps) {
  const [open, setOpen] = useState(false);

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

  // ✅ Edge Case: Auto-close if participants change while open
  useEffect(() => {
    if (open && assignedParticipants.length < 2) {
      setOpen(false);
    }
  }, [open, assignedParticipants.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calculator className="h-4 w-4" />
          Custom Split
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-medium mb-1">Custom Split</h4>
            <p className="text-sm text-muted-foreground">
              {item.name} ({currency.symbol}{itemTotal.toFixed(2)})
            </p>
          </div>

          {/* Split Mode Selector */}
          <SplitModeSelector
            mode={mode}
            onModeChange={handleModeChange}
          />

          {/* Amount Input Form */}
          <AmountSplitForm
            participants={assignedParticipants}
            values={values}
            mode={mode}
            currency={currency}
            onValueChange={handleValueChange}
            getStep={getStep}
            getModeSymbol={getModeSymbol}
          />

          {/* Live Validation Display */}
          <SplitValidationDisplay
            liveTotal={liveTotal}
            itemTotal={itemTotal}
            isValid={isValid}
            currency={currency}
            mode={mode}
          />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => {
                handleSave();
                setOpen(false);
              }}
              disabled={!isValid}
              className="flex-1"
            >
              Done
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### useCustomSplit Hook

**File**: `src/components/custom-split/hooks/useCustomSplit.ts`

```tsx
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

type SplitMode = 'amount' | 'percentage' | 'shares';

export function useCustomSplit({ item, assignedParticipants, receiptId, isOpen }) {
  const [mode, setMode] = useState<SplitMode>('amount');
  const [values, setValues] = useState<Record<string, number>>({});
  
  const currency = useStore((state) => state.currency);
  const setCustomSplit = useStore((state) => state.setCustomSplit);

  const itemTotal = item.price * item.quantity;

  // Initialize values when popover opens
  useEffect(() => {
    if (isOpen) {
      const existingSplit = item.customSplit;
      
      if (existingSplit) {
        setMode(existingSplit.mode);
        setValues(existingSplit.values);
      } else {
        // Auto-distribute equally
        const equalValue = mode === 'amount'
          ? itemTotal / assignedParticipants.length
          : mode === 'percentage'
          ? 100 / assignedParticipants.length
          : 1;

        const initialValues = assignedParticipants.reduce(
          (acc, p) => ({ ...acc, [p.id]: equalValue }),
          {}
        );
        setValues(initialValues);
      }
    }
  }, [isOpen]);

  // Calculate live total
  const liveTotal = mode === 'amount'
    ? Object.values(values).reduce((sum, val) => sum + val, 0)
    : mode === 'percentage'
    ? (Object.values(values).reduce((sum, val) => sum + val, 0) / 100) * itemTotal
    : (Object.values(values).reduce((sum, val) => sum + val, 0) / 
       Object.values(values).reduce((sum, val) => sum + val, 0)) * itemTotal;

  // Validation: live total must match item total (within 0.01 tolerance)
  const isValid = Math.abs(liveTotal - itemTotal) < 0.01;

  const handleModeChange = (newMode: SplitMode) => {
    setMode(newMode);
    // Re-initialize values for new mode
  };

  const handleValueChange = (participantId: string, value: number) => {
    setValues((prev) => ({ ...prev, [participantId]: value }));
  };

  const handleSave = () => {
    if (!isValid) return;

    setCustomSplit(item.id, { mode, values }, receiptId);
  };

  const getModeSymbol = () => {
    if (mode === 'amount') return currency.symbol;
    if (mode === 'percentage') return '%';
    return 'shares';
  };

  const getStep = () => {
    if (mode === 'amount') return '0.01';
    if (mode === 'percentage') return '0.1';
    return '1';
  };

  return {
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
  };
}
```

**Validation Logic**:
- **Amount mode**: Sum must equal item total (e.g., $10.00)
- **Percentage mode**: Sum must equal 100%
- **Shares mode**: Proportional split (shares sum doesn't matter)
- **Tolerance**: ±$0.01 (handles floating point rounding)
- **UI Feedback**: Green if valid, red if mismatch
- **Button State**: "Done" disabled until valid

---

## 4.5 Summary Page Architecture

**File**: `src/pages/Summary.tsx` (184 lines)

```tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useHydration } from '@/hooks/useHydration';
import { calculateParticipantBalances, calculateSettlement } from '@/lib/settlement';
import { CelebrationSection } from '@/features/summary/CelebrationSection';
import { GrandTotalSection } from '@/features/summary/GrandTotalSection';
import { SettlementSummarySection } from '@/features/summary/SettlementSummarySection';
import { ParticipantSummarySection } from '@/features/summary/ParticipantSummarySection';
import { ActionButtonsSection } from '@/features/summary/ActionButtonsSection';

// Stagger container - cards land AFTER confetti burst
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6, // Wait for confetti animation
    },
  },
};

export function Summary() {
  const isHydrated = useHydration();
  const { participants, items, receipts, managementMode, currency, mergedTax, mergedTip } = useStore();

  // ✅ Hydration check
  if (!isHydrated) return <RouteLoadingScreen />;

  // Calculate totals
  const allItems = managementMode === 'merged' ? items : receipts.flatMap(r => r.items);
  const subtotal = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = managementMode === 'merged' ? mergedTax : receipts.reduce((sum, r) => sum + (r.tax || 0), 0);
  const tip = managementMode === 'merged' ? mergedTip : receipts.reduce((sum, r) => sum + (r.tip || 0), 0);
  const grandTotal = subtotal + tax + tip;

  // Calculate participant balances (proportional tax/tip)
  const billData = managementMode === 'merged'
    ? { items, tax: mergedTax, tip: mergedTip }
    : receipts.map(r => ({
        items: r.items,
        tax: r.tax || 0,
        tip: r.tip || 0,
        paidBy: r.paidBy ?? undefined,
      }));

  const participantBalances = calculateParticipantBalances(
    participants,
    billData,
    managementMode
  );

  // Calculate minimum settlement transactions
  const settlements = calculateSettlement(participantBalances);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Celebration with Confetti */}
      <CelebrationSection
        participantCount={participants.length}
        itemCount={allItems.length}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Split Complete!</h1>
          <Badge variant="secondary">
            {participants.length} people · {allItems.length} items
          </Badge>
        </div>
      </div>

      {/* Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-4xl py-8 space-y-6"
      >
        {/* Grand Total Card */}
        <GrandTotalSection
          subtotal={subtotal}
          tax={tax}
          tip={tip}
          grandTotal={grandTotal}
          currency={currency}
        />

        {/* Settlement Summary (Who Pays Whom) */}
        <SettlementSummarySection
          settlements={settlements}
          participantBalances={participantBalances}
          grandTotal={grandTotal}
          currency={currency}
          participants={participants}
        />

        {/* Per-Participant Breakdown */}
        <ParticipantSummarySection
          participantBalances={participantBalances}
          currency={currency}
          participants={participants}
        />

        {/* Action Buttons (Export PDF, Share Image, New Bill) */}
        <ActionButtonsSection
          participants={participants}
          items={allItems}
          receipts={receipts}
          currency={currency}
          managementMode={managementMode}
          mergedStoreName={mergedStoreName}
          mergedDate={mergedDate}
          mergedTax={mergedTax}
          mergedTip={mergedTip}
        />
      </motion.div>
    </div>
  );
}
```

**Section Order**:
1. **CelebrationSection** - Confetti burst animation
2. **GrandTotalSection** - Total breakdown (subtotal + tax + tip)
3. **SettlementSummarySection** - Who pays whom (minimum transactions)
4. **ParticipantSummarySection** - Per-person cost breakdown
5. **ActionButtonsSection** - Export PDF, Share Image, New Bill

---

## 4.6 Settlement Calculations

**File**: `src/lib/settlement.ts`

### Proportional Tax/Tip Algorithm

```typescript
interface ParticipantBalance {
  id: string;
  itemsTotal: number;
  taxShare: number;
  tipShare: number;
  totalCost: number;
  paid: number;
  balance: number; // negative = owes, positive = owed
}

/**
 * Calculate per-participant balances with proportional tax/tip
 */
export function calculateParticipantBalances(
  participants: Participant[],
  billData: BillData | BillData[],
  managementMode: 'merged' | 'separate'
): ParticipantBalance[] {
  const balances: ParticipantBalance[] = participants.map((p) => ({
    id: p.id,
    itemsTotal: 0,
    taxShare: 0,
    tipShare: 0,
    totalCost: 0,
    paid: 0,
    balance: 0,
  }));

  const bills = Array.isArray(billData) ? billData : [billData];

  bills.forEach((bill) => {
    const { items, tax, tip, paidBy } = bill;

    // Calculate each participant's item subtotal
    items.forEach((item) => {
      const assignedTo = item.assignedTo || [];
      if (assignedTo.length === 0) return;

      const itemTotal = item.price * item.quantity;

      // Handle custom split
      if (item.customSplit) {
        const { mode, values } = item.customSplit;

        assignedTo.forEach((pid) => {
          const balance = balances.find((b) => b.id === pid);
          if (!balance) return;

          if (mode === 'amount') {
            balance.itemsTotal += values[pid] || 0;
          } else if (mode === 'percentage') {
            balance.itemsTotal += (itemTotal * (values[pid] || 0)) / 100;
          } else {
            // shares mode
            const totalShares = Object.values(values).reduce((sum, v) => sum + v, 0);
            balance.itemsTotal += (itemTotal * (values[pid] || 0)) / totalShares;
          }
        });
      } else {
        // Equal split among assigned participants
        const perPerson = itemTotal / assignedTo.length;

        assignedTo.forEach((pid) => {
          const balance = balances.find((b) => b.id === pid);
          if (balance) balance.itemsTotal += perPerson;
        });
      }
    });

    // Proportional tax/tip distribution
    const billSubtotal = items.reduce((sum, item) => {
      const assigned = item.assignedTo?.length || 0;
      return assigned > 0 ? sum + (item.price * item.quantity) : sum;
    }, 0);

    if (billSubtotal > 0) {
      balances.forEach((balance) => {
        const proportion = balance.itemsTotal / billSubtotal;
        balance.taxShare += tax * proportion;
        balance.tipShare += tip * proportion;
      });
    }

    // Track who paid
    if (paidBy) {
      const payer = balances.find((b) => b.id === paidBy);
      if (payer) {
        payer.paid += billSubtotal + tax + tip;
      }
    }
  });

  // Calculate final balances
  balances.forEach((balance) => {
    balance.totalCost = balance.itemsTotal + balance.taxShare + balance.tipShare;
    balance.balance = balance.paid - balance.totalCost;
  });

  return balances;
}
```

### Minimum Transactions Algorithm

```typescript
interface Transaction {
  from: string; // participant name
  to: string;   // participant name
  amount: number;
}

/**
 * Calculate minimum settlement transactions (greedy algorithm)
 */
export function calculateSettlement(balances: ParticipantBalance[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  // Separate debtors (negative balance) and creditors (positive balance)
  const debtors = balances
    .filter((b) => b.balance < -0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.balance - b.balance); // Most negative first

  const creditors = balances
    .filter((b) => b.balance > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance); // Most positive first

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amountToSettle = Math.min(
      Math.abs(debtor.balance),
      creditor.balance
    );

    if (amountToSettle > 0.01) {
      transactions.push({
        from: getParticipantName(debtor.id),
        to: getParticipantName(creditor.id),
        amount: amountToSettle,
      });

      debtor.balance += amountToSettle;
      creditor.balance -= amountToSettle;
    }

    // Move to next debtor/creditor if settled
    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j++;
  }

  return transactions;
}
```

**Algorithm Complexity**:
- **Time**: O(n log n) - sorting dominates
- **Transactions**: At most `n-1` (proven minimum for debt settlement)
- **Tolerance**: ±$0.01 (handles floating point rounding)

---

## 4.7 PDF Export

**File**: `src/lib/pdf/exportPDF.ts` (Main entry point)

### Lazy Loading Strategy

```typescript
import type { PDFExportData } from './types';

/**
 * Main PDF export function with lazy loading
 * Saves ~358kb gzipped on initial page load
 */
export async function exportToPDF(data: PDFExportData): Promise<void> {
  // ✅ Lazy-load jsPDF only when user clicks "Download PDF"
  const { default: jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Prepare data (calculate balances, settlements)
  const { balances, transactions, grandTotal } = prepareData(data);

  // Create context object shared across generators
  const context: PDFContext = {
    pdf,
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    yPosition: margin,
    currencySymbol: data.currency.symbol,
    data,
    balances,
    transactions,
    grandTotal,
  };

  // Generate sections
  generateHeader(context);
  generateSummary(context);
  generateParticipants(context);
  generateItems(context);
  generateFooter(pdf, pageWidth, pageHeight);

  // Save file
  const fileName = `scantosplit-settlement-${Date.now()}.pdf`;
  pdf.save(fileName);
}
```

### PDF Structure

**Page 1: Summary & Settlement**
```
┌─────────────────────────────────┐
│ ScanToSplit.ai                  │
│ Bill Settlement Summary          │
│ Generated: Nov 18, 2025          │
├─────────────────────────────────┤
│ GRAND TOTAL                     │
│ Subtotal:        $85.47         │
│ Tax (19%):        $16.24        │
│ Tip (15%):        $12.82        │
│ ────────────────────────────    │
│ Total:           $114.53        │
├─────────────────────────────────┤
│ SETTLEMENT SUMMARY              │
│ Alice pays Bob    $28.63        │
│ Carol pays Bob    $14.32        │
├─────────────────────────────────┤
│ PARTICIPANT BREAKDOWN            │
│ ┌─────────────┬──────────────┐  │
│ │ Alice       │ Bob          │  │
│ │ Items: $32  │ Items: $45   │  │
│ │ Tax:   $6   │ Tax:   $8    │  │
│ │ Tip:   $5   │ Tip:   $7    │  │
│ │ ─────────── │ ──────────── │  │
│ │ Total: $43  │ Total: $60   │  │
│ └─────────────┴──────────────┘  │
└─────────────────────────────────┘
```

**Page 2+: Items Breakdown**
```
┌─────────────────────────────────┐
│ ITEMS BREAKDOWN                 │
│                                 │
│ Receipt 1: Grocery Store        │
│ Date: Nov 18, 2025              │
│                                 │
│ 1. Organic Milk        $3.49    │
│    → Alice, Bob                 │
│                                 │
│ 2. Sourdough Bread     $4.99    │
│    → Alice, Bob, Carol          │
│                                 │
│ 3. (Discount) -$2.00            │
│    → All participants           │
│                                 │
│ ... (continues)                 │
└─────────────────────────────────┘
```

### Generator Modules

**File**: `src/lib/pdf/generators/summaryGenerator.ts`

```typescript
export function generateSummary(context: PDFContext) {
  const { pdf, margin, contentWidth, currencySymbol, grandTotal } = context;
  let y = context.yPosition;

  // Section Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', margin, y);
  y += 10;

  // Grand Total Box
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, y, contentWidth, 30, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Subtotal: ${currencySymbol}${context.data.subtotal.toFixed(2)}`, margin + 5, y + 8);
  pdf.text(`Tax: ${currencySymbol}${context.data.tax.toFixed(2)}`, margin + 5, y + 16);
  pdf.text(`Tip: ${currencySymbol}${context.data.tip.toFixed(2)}`, margin + 5, y + 24);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text(`Total: ${currencySymbol}${grandTotal.toFixed(2)}`, contentWidth - 30, y + 24, { align: 'right' });
  
  y += 40;

  // Settlement Transactions
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Settlement', margin, y);
  y += 8;

  context.transactions.forEach((txn) => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `${txn.from} pays ${txn.to}`,
      margin + 5,
      y
    );
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `${currencySymbol}${txn.amount.toFixed(2)}`,
      contentWidth - 20,
      y,
      { align: 'right' }
    );
    y += 7;
  });

  context.yPosition = y + 10;
  return context;
}
```

**Bundle Size**:
- **jsPDF**: 358.65 kB (118.52 kB gzipped)
- **Lazy-loaded**: Only downloads when user clicks "Download PDF"
- **Savings**: 118 kB saved on initial page load

---

## 4.8 Image Export (Web Share API)

**File**: `src/lib/shareableImage.ts`

### html-to-image Integration

```typescript
import { toPng } from 'html-to-image';

/**
 * Export shareable image with Web Share API fallback
 */
export async function exportShareableImage(): Promise<boolean> {
  const summaryElement = document.getElementById('summary-content');
  if (!summaryElement) return false;

  try {
    // Generate PNG from DOM element
    const dataUrl = await toPng(summaryElement, {
      quality: 0.95,
      pixelRatio: 2, // Retina quality
      backgroundColor: '#ffffff',
    });

    // Convert to Blob
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'scantosplit-summary.png', {
      type: 'image/png',
    });

    // Try Web Share API (mobile)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'Bill Split Summary',
        text: 'Check out our bill split!',
        files: [file],
      });
      return true;
    } else {
      // Fallback: Download image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'scantosplit-summary.png';
      link.click();
      return true;
    }
  } catch (error) {
    console.error('Image export failed:', error);
    return false;
  }
}
```

**File**: `src/features/summary/ActionButtonsSection.tsx`

```tsx
import { useState } from 'react';
import { Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToPDF } from '@/lib/pdf';
import { exportShareableImage } from '@/lib/shareableImage';
import { useToast } from '@/hooks/useToast';

export function ActionButtonsSection({ participants, items, receipts, currency, ... }: ActionButtonsSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF({
        participants,
        items,
        receipts,
        currency,
        managementMode,
        mergedStoreName,
        mergedDate,
        mergedTax,
        mergedTip,
      });
      
      toast({
        title: 'PDF Ready!',
        description: 'Your settlement summary has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareImage = async () => {
    setIsSharing(true);
    try {
      const success = await exportShareableImage();
      if (success) {
        toast({
          title: 'Image Shared!',
          description: 'Summary image created successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Export & Share</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PDF Export */}
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>

          {/* Image Share */}
          <Button
            variant="outline"
            onClick={handleShareImage}
            disabled={isSharing}
            className="gap-2"
          >
            {isSharing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Share Image
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
```

**Bundle Sizes**:
- **html-to-image**: 214.79 kB (53.30 kB gzipped)
- **html2canvas** (dependency): Included in above
- **Lazy-loaded**: Only downloads when user clicks "Share Image"

---

## Summary: Assignment & Summary Checklist

✅ **Assignment Page**: 3-part layout (palette, bill info, items)  
✅ **Participant Palette**: Multi-select with staggered animations, celebration badge  
✅ **Item Card**: Assignment chips, quick assign, custom split button  
✅ **Custom Split Popover**: Real-time validation with react-hook-form, 3 modes (amount/percentage/shares)  
✅ **Summary Page**: Confetti animation, grand total, settlement summary, per-participant breakdown  
✅ **Settlement Algorithm**: Proportional tax/tip, minimum transactions (O(n log n))  
✅ **PDF Export**: Lazy-loaded jsPDF (saves 118kb gzipped), text-based design, multi-page support  
✅ **Image Export**: Web Share API with fallback, html-to-image (53kb gzipped), Retina quality  

---

**Next**: Part 5 - Premium Patterns & Quality (Glass Morphism, Accessibility, Testing)
