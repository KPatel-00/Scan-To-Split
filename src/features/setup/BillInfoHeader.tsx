/**
 * Premium Bill Info Header
 * 
 * Design upgrades:
 * - Glass morphism background with gradient overlay
 * - Premium typography using typography.display scales
 * - Enhanced tactile feedback on selector
 * - Smooth fade-in animation
 * - Improved visual hierarchy and spacing
 */

import { useTranslation } from 'react-i18next';
import { Calendar, Store } from 'lucide-react';
import { Card } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useStore } from '../../store/useStore';
import { feedback } from '../../lib/feedback';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';
import { typography } from '@/lib/typography';

interface BillInfoHeaderProps {
  calculatedTotal: number;
  itemCount: number;
}

export function BillInfoHeader({ calculatedTotal, itemCount }: BillInfoHeaderProps) {
  const { t } = useTranslation();
  const currency = useStore((state) => state.currency);
  const mergedStoreName = useStore((state) => state.mergedStoreName);
  const mergedDate = useStore((state) => state.mergedDate);
  const mergedPaidBy = useStore((state) => state.mergedPaidBy);
  const participants = useStore((state) => state.participants);
  const setPayer = useStore((state) => state.setPayer);

  const handlePayerChange = (participantId: string) => {
    setPayer(participantId, undefined); // undefined for merged mode (null would also work)
    feedback.click();
  };

  return (
    <motion.div variants={fadeInUp}>
      <Card className="mb-8 overflow-hidden border border-border/40 bg-gradient-to-br from-primary/5 via-card/50 to-primary/10 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left Side - Store Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <h3 className={typography.heading.h3}>
                {mergedStoreName || t('setup.itemsList.billInfo.storeName')}
              </h3>
            </div>
            
            {mergedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{mergedDate}</span>
              </div>
            )}
            
            {/* Payer Selector - Premium Styling */}
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                {t('setup.itemsList.billInfo.paidBy')}
              </span>
              <Select 
                value={mergedPaidBy || undefined} 
                onValueChange={handlePayerChange}
              >
                <SelectTrigger 
                  className="h-9 w-full border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card sm:w-48" 
                  aria-label={t('ariaLabels.selectPayer')}
                >
                  <SelectValue placeholder={t('setup.labels.paidBy')} />
                </SelectTrigger>
                <SelectContent>
                  {participants.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t('setup.participants.addPrompt')}
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Side - Premium Totals Display */}
          <div className="flex flex-col items-end gap-2 rounded-lg bg-gradient-to-br from-primary/10 to-transparent p-4">
            <div className={`${typography.display.md} text-primary`}>
              {currency.symbol}{calculatedTotal.toFixed(2)}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {t('setup.itemsList.billInfo.totalItems', { count: itemCount })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
