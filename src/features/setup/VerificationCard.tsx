import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { smoothSlow } from '@/lib/motion/physics';

export function VerificationCard() {
  const { t } = useTranslation();
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const currency = useStore((state) => state.currency);
  const mergedTax = useStore((state) => state.mergedTax);
  const mergedTip = useStore((state) => state.mergedTip);

  // Calculate total from items
  const itemsSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Calculate total with modifiers
  const calculatedTotal = useMemo(() => {
    return itemsSubtotal + mergedTax + mergedTip;
  }, [itemsSubtotal, mergedTax, mergedTip]);

  // Total from AI scan (sum of all AI-read totals if multiple receipts)
  const billTotal = useMemo(() => {
    if (receipts.length > 0) {
      // Use AI-scanned totals if available
      const aiTotal = receipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
      if (aiTotal > 0) return aiTotal;
      
      // Fallback: calculate from items + tax + tip
      return receipts.reduce((sum, receipt) => {
        const itemsTotal = receipt.items.reduce((s, item) => s + item.price * item.quantity, 0);
        return sum + itemsTotal + (receipt.tax || 0) + (receipt.tip || 0);
      }, 0);
    }
    // Fallback: if no receipts (manual entry), use calculated total
    return calculatedTotal;
  }, [receipts, calculatedTotal]);

  // Calculate difference
  const difference = useMemo(() => {
    return billTotal - calculatedTotal;
  }, [billTotal, calculatedTotal]);

  const isMatch = Math.abs(difference) < 0.01;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...smoothSlow,
        delay: 0.3,
      }}
    >
      <Card className={cn(
        "border-2 transition-colors",
        isMatch ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900" : "border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isMatch ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            )}
            {t('setup.verification.title')}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('setup.verification.tooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total from Bill (AI) */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {t('setup.verification.totalFromBill')}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currency.symbol}{billTotal.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {receipts.length > 1 
                  ? t('setup.verification.fromReceipts', { count: receipts.length })
                  : t('setup.verification.fromAI')}
              </div>
            </div>

            {/* Calculated Total */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {t('setup.verification.calculatedTotal')}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currency.symbol}{calculatedTotal.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('setup.verification.itemsCount', { count: items.length })}
              </div>
            </div>

            {/* Difference */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {t('setup.verification.difference')}
              </div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isMatch ? 1 : [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-2xl font-bold",
                  isMatch ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                )}
              >
                {difference >= 0 ? '+' : ''}{currency.symbol}{difference.toFixed(2)}
              </motion.div>
              <div className={cn(
                "text-xs font-medium",
                isMatch ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
              )}>
                {isMatch ? t('setup.verification.perfect') : t('setup.verification.checkItems')}
              </div>
            </div>
          </div>

          {/* Breakdown if modifiers exist */}
          {(mergedTax > 0 || mergedTip > 0) && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('setup.billModifiers.subtotal')}</span>
                <span className="font-medium">{currency.symbol}{itemsSubtotal.toFixed(2)}</span>
              </div>
              {mergedTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('setup.billModifiers.tax')}</span>
                  <span className="font-medium">{currency.symbol}{mergedTax.toFixed(2)}</span>
                </div>
              )}
              {mergedTip > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('setup.billModifiers.tip')}</span>
                  <span className="font-medium">{currency.symbol}{mergedTip.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

