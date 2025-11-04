import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { HelpCircle, CheckCircle, AlertTriangle, Receipt } from 'lucide-react';
import { cn } from '../../lib/utils';
import { smoothSlow } from '@/lib/motion/physics';

export function GrandTotalCard() {
  const { t } = useTranslation();
  const receipts = useStore((state) => state.receipts);
  const currency = useStore((state) => state.currency);

  // Calculate grand total from all AI-scanned bills
  const totalFromAllBills = useMemo(() => {
    return receipts.reduce((sum, receipt) => {
      // Use AI-scanned total if available
      if (receipt.total) return sum + receipt.total;
      
      // Fallback: calculate from items + tax + tip
      const itemsTotal = receipt.items.reduce((s, item) => s + item.price * item.quantity, 0);
      return sum + itemsTotal + (receipt.tax || 0) + (receipt.tip || 0);
    }, 0);
  }, [receipts]);

  // Calculate grand total from all items across all receipts
  const calculatedGrandTotal = useMemo(() => {
    return receipts.reduce((sum, receipt) => {
      const itemsTotal = receipt.items.reduce((s, item) => s + item.price * item.quantity, 0);
      return sum + itemsTotal + (receipt.tax || 0) + (receipt.tip || 0);
    }, 0);
  }, [receipts]);

  // Calculate difference
  const difference = useMemo(() => {
    return totalFromAllBills - calculatedGrandTotal;
  }, [totalFromAllBills, calculatedGrandTotal]);

  const isMatch = Math.abs(difference) < 0.01;

  // Total number of items across all receipts
  const totalItems = useMemo(() => {
    return receipts.reduce((sum, receipt) => sum + receipt.items.length, 0);
  }, [receipts]);

  if (receipts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...smoothSlow,
        delay: 0.4,
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
            {t('setup.verification.grandTotalTitle')}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('setup.verification.grandTotalTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Receipt Count Banner */}
          <div className="mb-4 flex items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {t('setup.verification.billsCount', { count: receipts.length })}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {t('setup.verification.itemsCount', { count: totalItems })}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Total from All Bills (AI) */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {t('setup.verification.totalFromAllBills')}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currency.symbol}{totalFromAllBills.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('setup.verification.fromReceipts', { count: receipts.length })}
              </div>
            </div>

            {/* Calculated Grand Total */}
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {t('setup.verification.calculatedGrandTotal')}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currency.symbol}{calculatedGrandTotal.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('setup.verification.acrossAllBills')}
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
                {isMatch ? t('setup.verification.perfect') : t('setup.verification.checkAllBills')}
              </div>
            </div>
          </div>

          {/* Per-Bill Breakdown */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {t('setup.verification.perBillBreakdown')}
            </div>
            {receipts.map((receipt, index) => {
              const receiptItemsTotal = receipt.items.reduce((s, item) => s + item.price * item.quantity, 0);
              const receiptTotal = receiptItemsTotal + (receipt.tax || 0) + (receipt.tip || 0);
              
              return (
                <div key={receipt.id} className="flex justify-between items-center text-sm p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t('setup.itemsList.item.origin', { number: index + 1 })}
                    </span>
                    <span className="font-medium">{receipt.storeName}</span>
                    <span className="text-xs text-muted-foreground">
                      ({receipt.items.length} {t('setup.verification.items')})
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {currency.symbol}{receiptTotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
