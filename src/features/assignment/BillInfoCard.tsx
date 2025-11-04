import { Card, CardContent } from '../../components/ui/card';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Receipt, Calendar, ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';
import { smoothSlow } from '@/lib/motion/physics';

export function BillInfoCard() {
  const { t } = useTranslation();
  const managementMode = useStore((state) => state.managementMode);
  const items = useStore((state) => state.items);
  const mergedStoreName = useStore((state) => state.mergedStoreName);
  const mergedDate = useStore((state) => state.mergedDate);
  const currency = useStore((state) => state.currency);
  const mergedTax = useStore((state) => state.mergedTax);
  const mergedTip = useStore((state) => state.mergedTip);

  // Calculate total from items array
  const calculatedTotal = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return itemsTotal + mergedTax + mergedTip;
  }, [items, mergedTax, mergedTip]);

  // Don't render in separate mode
  if (managementMode === 'separate') {
    return null;
  }

  // Don't render if no items (empty state handled elsewhere)
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSlow}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Left Side: Store Name and Date */}
            <div className="flex-1 space-y-4">
              {/* Store Name */}
              <div className="flex items-start gap-4">
                <div className="mt-0.5 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {t('assignment.billInfo.storeName')}
                  </p>
                  <h3 className="text-lg font-bold text-foreground truncate">
                    {mergedStoreName || t('assignment.billInfo.unknownStore')}
                  </h3>
                </div>
              </div>

              {/* Date */}
              {mergedDate && (
                <div className="flex items-center gap-4 pl-[52px]">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {new Date(mergedDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Total and Item Count */}
            <div className="flex flex-col items-end gap-2 sm:border-l sm:border-border/50 sm:pl-6">
              {/* Total Amount */}
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {t('assignment.billInfo.calculatedTotal')}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    {currency.symbol}
                    {calculatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Item Count */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
                <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  {t('assignment.billInfo.itemCount', { count: items.length })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
