import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHydration } from '../hooks/useHydration';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useStore } from '../store/useStore';
import { feedback } from '../lib/feedback';
import { calculateParticipantBalances, calculateSettlement } from '../lib/settlement';
import { CelebrationSection } from '../features/summary/CelebrationSection';
import { GrandTotalSection } from '../features/summary/GrandTotalSection';
import { SettlementSummarySection } from '../features/summary/SettlementSummarySection';
import { ParticipantSummarySection } from '../features/summary/ParticipantSummarySection';
import { ActionButtonsSection } from '../features/summary/ActionButtonsSection';

// Stagger container for sequential animations
// Blueprint: Cards "land softly" AFTER confetti burst
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slower stagger for more dramatic effect
      delayChildren: 0.6, // Delay until after confetti starts (500ms flash + 100ms buffer)
    },
  },
};

export function Summary() {
  const isHydrated = useHydration();
  const { t } = useTranslation();
  
  const {
    participants,
    items: storeItems,
    receipts,
    managementMode,
    currency,
    mergedTax,
    mergedTip,
    mergedStoreName,
    mergedDate,
    setLastActivePage,
  } = useStore();

  // Set last active page on mount
  useEffect(() => {
    setLastActivePage('/summary');
  }, [setLastActivePage]);

  // Calculate totals based on management mode
  const items = managementMode === 'merged' ? storeItems : receipts.flatMap(r => r.items);
  
  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = managementMode === 'merged' ? mergedTax : receipts.reduce((sum: number, r: any) => sum + (r.tax || 0), 0);
  const tip = managementMode === 'merged' ? mergedTip : receipts.reduce((sum: number, r: any) => sum + (r.tip || 0), 0);
  const grandTotal = subtotal + tax + tip;

  // Calculate participant balances with proportional tax/tip (Blueprint Section 2.7)
  const billData = managementMode === 'merged' 
    ? { items, tax: mergedTax, tip: mergedTip }
    : receipts.map(r => ({
        items: r.items,
        tax: r.tax || 0,
        tip: r.tip || 0,
        paidBy: r.paidBy ?? undefined, // Convert null to undefined
      }));

  const participantBalances = calculateParticipantBalances(
    participants,
    billData,
    managementMode
  );

  // Calculate settlement transactions (minimum transactions algorithm)
  const settlements = calculateSettlement(participantBalances);

  // Wait for hydration
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 relative">
      {/* Celebration Section with Confetti + Flash */}
      <CelebrationSection
        participantCount={participants.length}
        itemCount={items.length}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                feedback.click();
                window.history.back();
              }}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('buttons.back')}
            </Button>

            {/* Title Badge */}
            <Badge variant="outline" className="text-sm px-4 py-1.5">
              <Receipt className="h-3.5 w-3.5 mr-2" />
              {t('summary.finalSummary.title')}
            </Badge>

            {/* Spacer for centering */}
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 1. Grand Total Card */}
          <GrandTotalSection
            subtotal={subtotal}
            tax={tax}
            tip={tip}
            grandTotal={grandTotal}
            currency={currency}
            managementMode={managementMode}
            mergedStoreName={mergedStoreName}
            receipts={receipts}
          />

          {/* 2. Settlement Summary + Cost Breakdown */}
          <SettlementSummarySection
            settlements={settlements}
            participantBalances={participantBalances}
            grandTotal={grandTotal}
            currency={currency}
            participants={participants}
          />

          {/* 3. Participant Summary Cards */}
          <ParticipantSummarySection
            participantBalances={participantBalances}
            items={items}
            receipts={receipts}
            currency={currency}
            managementMode={managementMode}
          />

          {/* 4. Action Buttons */}
          <ActionButtonsSection
            participants={participants}
            items={items}
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
    </div>
  );
}
