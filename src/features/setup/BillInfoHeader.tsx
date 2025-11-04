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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Side - Store Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">
                {mergedStoreName || t('setup.itemsList.billInfo.storeName')}
              </h3>
            </div>
            
            {mergedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{mergedDate}</span>
              </div>
            )}
            
            {/* Payer Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t('setup.itemsList.billInfo.paidBy')}
              </span>
              <Select 
                value={mergedPaidBy || undefined} 
                onValueChange={handlePayerChange}
              >
                <SelectTrigger 
                  className="w-full sm:w-48 h-9" 
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

          {/* Right Side - Totals */}
          <div className="flex flex-col items-end gap-1">
            <div className="text-3xl font-bold text-primary">
              {currency.symbol}{calculatedTotal.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('setup.itemsList.billInfo.totalItems', { count: itemCount })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
