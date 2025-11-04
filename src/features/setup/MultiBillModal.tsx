import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Split, 
  Check, 
  Sparkles,
  Users,
  Calendar,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/badge';
import { useStore } from '../../store/useStore';
import { smoothNormal } from '@/lib/motion/physics';
import { buttonTactile } from '@/lib/motion';

interface MultiBillChoiceModalProps {
  // ✨ REFACTORED: Modal reads its own state from store
  onConfirm: (mode: 'merged' | 'separate') => void;
}

type ManagementMode = 'merged' | 'separate';

interface ModeOption {
  id: ManagementMode;
  icon: typeof Layers;
  title: string;
  description: string;
  badge?: string;
  features: string[];
}

export function MultiBillModal({
  onConfirm,
}: MultiBillChoiceModalProps) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<ManagementMode>('merged');

  // ✨ Read state from store
  const open = useStore((state) => state.isMultiBillModalOpen);
  const closeMultiBillModal = useStore((state) => state.closeMultiBillModal);
  const scannedReceiptsData = useStore((state) => state.scannedReceiptsData);
  const receiptCount = scannedReceiptsData.length;

  const modeOptions: ModeOption[] = [
    {
      id: 'merged',
      icon: Layers,
      title: t('setup.multiBill.modal.merged.title', 'Merged Mode'),
      description: t(
        'multiBill.modal.merged.description',
        'Combine all bills into one. Perfect for group dinners where everyone shares everything.'
      ),
      badge: t('setup.multiBill.modal.merged.badge', 'Recommended'),
      features: [
        t('setup.multiBill.modal.merged.feature1', 'Single combined item list'),
        t('setup.multiBill.modal.merged.feature2', 'One total for the entire group'),
        t('setup.multiBill.modal.merged.feature3', 'Simpler splitting workflow'),
      ],
    },
    {
      id: 'separate',
      icon: Split,
      title: t('setup.multiBill.modal.separate.title', 'Separate Mode'),
      description: t(
        'multiBill.modal.separate.description',
        'Track each bill independently. Best when different people paid different receipts.'
      ),
      features: [
        t('setup.multiBill.modal.separate.feature1', 'Individual bill tracking'),
        t('setup.multiBill.modal.separate.feature2', 'Per-bill payer, tax, and tip'),
        t('setup.multiBill.modal.separate.feature3', 'Detailed breakdown by receipt'),
      ],
    },
  ];

  const handleConfirm = () => {
    onConfirm(selectedMode);
    closeMultiBillModal(); // ✨ Store action
  };

  return (
    <Dialog open={open} onOpenChange={closeMultiBillModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {t('setup.multiBill.modal.title', 'How do you want to manage multiple bills?')}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {t('setup.multiBill.modal.detected', 'Detected {{count}} receipts', {
                    count: receiptCount,
                  })}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Mode Selection Cards */}
        <div className="grid gap-4 pt-4 md:grid-cols-2">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedMode === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => setSelectedMode(option.id)}
                initial={false}
                animate={{
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={smoothNormal}
                className={`group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                }`}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={buttonTactile.hover.transition}
                      className="absolute right-4 top-4"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Check className="h-5 w-5" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>

                {/* Badge (Merged only) */}
                {option.badge && (
                  <Badge
                    variant="secondary"
                    className="mb-3 bg-gradient-to-r from-primary/20 to-primary/10 text-primary"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {option.badge}
                  </Badge>
                )}

                {/* Title */}
                <h3 className="mb-2 text-xl font-bold">{option.title}</h3>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground">
                  {option.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={isSelected ? 'font-medium' : ''}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Hover Effect Overlay */}
                {!isSelected && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-6 overflow-hidden rounded-lg border bg-muted/30">
          <div className="border-b bg-muted/50 px-4 py-3">
            <h4 className="font-semibold">
              {t('setup.multiBill.modal.comparison.title', 'Quick Comparison')}
            </h4>
          </div>
          <div className="divide-y">
            {[
              {
                label: t('setup.multiBill.modal.comparison.workflow', 'Workflow'),
                merged: t('setup.multiBill.modal.comparison.simpler', 'Simpler'),
                separate: t('setup.multiBill.modal.comparison.detailed', 'More Detailed'),
                icon: Users,
              },
              {
                label: t('setup.multiBill.modal.comparison.tracking', 'Tracking'),
                merged: t('setup.multiBill.modal.comparison.combined', 'Combined Total'),
                separate: t('setup.multiBill.modal.comparison.perBill', 'Per-Bill Breakdown'),
                icon: Calendar,
              },
              {
                label: t('setup.multiBill.modal.comparison.bestFor', 'Best For'),
                merged: t('setup.multiBill.modal.comparison.sameGroup', 'Same Group Sharing'),
                separate: t('setup.multiBill.modal.comparison.different', 'Different Payers/Times'),
                icon: DollarSign,
              },
            ].map((row, idx) => {
              const RowIcon = row.icon;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-4 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <RowIcon className="h-4 w-4 text-muted-foreground" />
                    {row.label}
                  </div>
                  <div className="text-muted-foreground">{row.merged}</div>
                  <div className="text-muted-foreground">{row.separate}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6">
          <Button variant="ghost" onClick={closeMultiBillModal}>
            {t('buttons.cancel', 'Cancel')}
          </Button>
          <Button
            size="lg"
            onClick={handleConfirm}
            className="min-w-48 shadow-lg shadow-primary/30"
          >
            <Check />
            {t('buttons.confirm', 'Confirm')}{' '}
            {selectedMode === 'merged'
              ? t('setup.multiBill.modal.merged.title', 'Merged Mode')
              : t('setup.multiBill.modal.separate.title', 'Separate Mode')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
