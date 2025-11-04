import { useTranslation } from 'react-i18next';
import { Receipt, Recycle, BadgePercent, AlertCircle, HandCoins } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { typography } from '../lib/typography';
import { cn } from '../lib/utils';
import type { SplitCalculation } from '../lib/settlementEnhanced';

interface SpecialLinesSummaryProps {
  calculation: SplitCalculation;
  currency: { symbol: string; code: string };
}

export function SpecialLinesSummary({ calculation, currency }: SpecialLinesSummaryProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return `${currency.symbol}${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className={typography.label.md}>
            {t('settlement.subtotal', 'Subtotal')}
          </span>
          <span className="font-semibold">{formatCurrency(calculation.totals.subtotal)}</span>
        </div>

        {/* Discounts */}
        {calculation.specialLines.discounts < 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className={cn("flex items-center gap-2", typography.body.sm)}>
              <BadgePercent className="h-4 w-4" />
              {t('categories.sections.discounts', 'Discounts')}
            </span>
            <span className="font-semibold">
              -{formatCurrency(calculation.specialLines.discounts)}
            </span>
          </div>
        )}

        <Separator />

        {/* After Discounts */}
        <div className="flex justify-between items-center">
          <span className={typography.label.md}>
            {t('settlement.afterDiscounts', 'After Discounts')}
          </span>
          <span className="font-semibold">
            {formatCurrency(calculation.totals.afterDiscounts)}
          </span>
        </div>

        {/* Tips */}
        {calculation.specialLines.tips > 0 && (
          <div className="flex justify-between items-center text-purple-600">
            <span className={cn("flex items-center gap-2", typography.body.sm)}>
              <HandCoins className="h-4 w-4" />
              {t('categories.sections.tips', 'Tip')}
            </span>
            <span className="font-semibold">
              {formatCurrency(calculation.specialLines.tips)}
            </span>
          </div>
        )}

        {/* Fees */}
        {calculation.specialLines.fees > 0 && (
          <div className="flex justify-between items-center text-orange-600">
            <span className={cn("flex items-center gap-2", typography.body.sm)}>
              <AlertCircle className="h-4 w-4" />
              {t('categories.sections.fees', 'Fees')}
            </span>
            <span className="font-semibold">
              {formatCurrency(calculation.specialLines.fees)}
            </span>
          </div>
        )}

        <Separator className="my-3" />

        {/* Grand Total */}
        <div className={cn("flex justify-between items-center", typography.body.lg)}>
          <span className="font-bold">
            {t('settlement.total', 'Total')}
          </span>
          <span className="font-bold">
            {formatCurrency(calculation.totals.grandTotal)}
          </span>
        </div>

        {/* Deposits Info (if any) */}
        {calculation.totals.deposits !== 0 && (
          <>
            <Separator className="my-3" />
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <Recycle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className={cn(typography.label.xs, "text-blue-600")}>
                    {t('categories.sections.deposits', 'Deposits (Pfand)')}
                  </p>
                  <p className={cn(typography.label.xs, "text-blue-600/80")}>
                    {t('settlement.depositsDescription', 'Bottle deposits can be returned separately')}
                  </p>
                  <p className={cn(typography.body.sm, "font-semibold text-blue-600")}>
                    {formatCurrency(calculation.totals.deposits)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tax Info (if any) */}
        {calculation.specialLines.tax > 0 && (
          <div className="bg-muted/50 p-2 rounded-md">
            <div className="flex items-center justify-between">
              <span className={cn("flex items-center gap-2", typography.label.xs, "text-muted-foreground")}>
                <Receipt className="h-3 w-3" />
                {t('categories.sections.tax', 'Tax (Included)')}
              </span>
              <span className={cn(typography.label.xs, "text-muted-foreground")}>
                {formatCurrency(calculation.specialLines.tax)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
