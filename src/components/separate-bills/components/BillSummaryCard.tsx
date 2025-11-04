import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { useStore } from '../../../store/useStore';

interface BillSummaryCardProps {
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  finalTotal: number;
}

export function BillSummaryCard({
  subtotal,
  taxAmount,
  tipAmount,
  finalTotal,
}: BillSummaryCardProps) {
  const { t } = useTranslation();
  const currency = useStore((state) => state.currency);

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('setup.billModifiers.subtotal')}
            </span>
            <span className="font-medium">
              {currency.symbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {taxAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('setup.billModifiers.tax')}
              </span>
              <span className="font-medium">
                {currency.symbol}
                {taxAmount.toFixed(2)}
              </span>
            </div>
          )}
          {tipAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('setup.billModifiers.tip')}
              </span>
              <span className="font-medium">
                {currency.symbol}
                {tipAmount.toFixed(2)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-base font-bold">
            <span>{t('setup.itemsList.billInfo.totalAmount')}</span>
            <span className="text-primary text-xl">
              {currency.symbol}
              {finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
