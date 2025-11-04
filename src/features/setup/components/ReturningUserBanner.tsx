/**
 * ReturningUserBanner - Shows data summary for returning users
 * Displays item/participant/receipt count with Continue/Clear actions
 */

import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { feedback } from '@/lib/feedback';
import { gentleNormal } from '@/lib/motion/physics';

interface ReturningUserBannerProps {
  itemCount: number;
  participantCount: number;
  receiptCount: number;
  managementMode: 'merged' | 'separate';
  isDemoData: boolean;
  onContinue: () => void;
  onClear: () => void;
}

const gentleLand = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...gentleNormal,
    },
  },
};

export function ReturningUserBanner({
  itemCount,
  participantCount,
  receiptCount,
  managementMode,
  isDemoData,
  onContinue,
  onClear,
}: ReturningUserBannerProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleClear = () => {
    if (confirm(t('setup.scanPortal.confirmClear', 'This will clear all your current data. Continue?'))) {
      feedback.click();
      onClear();
      toast({
        title: t('setup.scanPortal.sessionCleared', 'Session cleared'),
        description: t('setup.scanPortal.sessionClearedDesc', 'Ready for a new bill'),
      });
    }
  };

  const handleContinue = () => {
    feedback.click();
    onContinue();
  };

  if (isDemoData) {
    return null;
  }

  return (
    <motion.div 
      variants={gentleLand} 
      className="mb-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Data Summary */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {t('setup.scanPortal.continueFrom', 'Continue where you left off')}
          </p>
          <p className="text-base font-semibold">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {participantCount > 0 && (
              <> • {participantCount} {participantCount === 1 ? 'participant' : 'participants'}</>
            )}
            {managementMode === 'separate' && receiptCount > 0 && (
              <> • {receiptCount} {receiptCount === 1 ? 'receipt' : 'receipts'}</>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            {t('setup.scanPortal.clear', 'Clear')}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={handleContinue}
          >
            <FileText className="h-4 w-4" />
            {t('setup.scanPortal.continue', 'Continue')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
