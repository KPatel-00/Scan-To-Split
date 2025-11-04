import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { useStore, type Participant, type Item } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { smoothNormal } from '@/lib/motion/physics';

interface ParticipantSummaryProps {
  participant: Participant;
  total: number;
  items: Item[];
}

export function ParticipantSummary({ participant, total, items }: ParticipantSummaryProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const currency = useStore((state) => state.currency);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer transition-colors hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ParticipantAvatar
              name={participant.name}
              color={participant.color}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{participant.name}</h3>
                <Badge variant={total > 0 ? 'default' : 'secondary'}>
                  {total > 0 ? t('summary.finalSummary.owes') : t('summary.finalSummary.even')}
                </Badge>
              </div>
              <p className="text-2xl font-bold">
                {currency.symbol}{total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('summary.finalSummary.items', { count: items.length })}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={smoothNormal}
            className="origin-top overflow-hidden"
          >
            <CardContent className="border-t">
              <div className="space-y-2 pt-4">
                {items.map((item) => {
                  const assignedCount = item.assignedTo?.length || 1;
                  const itemCost = (item.price * item.quantity) / assignedCount;
                  
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className={item.price < 0 ? 'text-red-500' : ''}>
                        {item.name}
                        {item.quantity > 1 && ` (${item.quantity}x)`}
                        {assignedCount > 1 && ` ÷ ${assignedCount}`}
                      </span>
                      <span className="font-medium">
                        {currency.symbol}{itemCost.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
