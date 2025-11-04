import { motion } from 'framer-motion';
import { Calendar, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { useStore } from '../../../store/useStore';
import { cn } from '../../../lib/utils';

interface BillTabHeaderProps {
  receipt: any;
  index: number;
  total: number;
  finalTotal: number;
  itemCount: number;
  hasSearchResults: boolean;
}

export function BillTabHeader({
  receipt,
  index,
  finalTotal,
  itemCount,
  hasSearchResults,
}: BillTabHeaderProps) {
  const { t } = useTranslation();
  const currency = useStore((state) => state.currency);

  return (
    <TabsTrigger
      value={receipt.id}
      className={cn(
        "relative h-auto p-4 flex flex-col items-start gap-2 rounded-lg border-2 transition-all",
        "data-[state=active]:border-primary data-[state=active]:bg-primary/5",
        "data-[state=inactive]:border-border data-[state=inactive]:bg-card",
        "hover:border-primary/50 hover:bg-primary/5",
        hasSearchResults && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {/* Badge: Bill Number */}
      <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
        {t('setup.itemsList.item.origin', { number: index + 1 })}
      </Badge>

      {/* Store Name */}
      <div className="flex items-center gap-2 w-full">
        <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="font-semibold text-sm truncate">
          {receipt.storeName || t('setup.itemsList.billInfo.storeName')}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 w-full">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{receipt.date}</span>
      </div>

      {/* Total & Items */}
      <div className="w-full pt-2 border-t flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          {currency.symbol}
          {finalTotal.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">
          {t('setup.itemsList.billInfo.totalItems', { count: itemCount })}
        </span>
      </div>

      {/* Search Indicator */}
      {hasSearchResults && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 h-4 w-4 bg-primary rounded-full border-2 border-background"
        />
      )}
    </TabsTrigger>
  );
}
