import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgePercent, Recycle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { staggerContainer, staggerItem } from '@/lib/motion/entry';
import { formatCurrency, type Currency } from '../../lib/utils';
import type { Item } from '../../store/types';

interface SavingsSummaryProps {
  items: Item[];
  currency: Currency;
}

export function SavingsSummary({ items, currency }: SavingsSummaryProps) {
  const { t } = useTranslation();

  const savings = useMemo(() => {
    const discounts = items
      .filter(i => i.category.id === 'DISC')
      .reduce((sum, i) => sum + Math.abs(i.price * i.quantity), 0);

    const deposits = items
      .filter(i => i.category.id === 'DEPO')
      .reduce((sum, i) => sum + i.price * i.quantity, 0);

    const depositReturns = items
      .filter(i => i.category.id === 'DEPO_RET')
      .reduce((sum, i) => sum + Math.abs(i.price * i.quantity), 0);

    const netDeposits = deposits - depositReturns;

    return { discounts, deposits: netDeposits };
  }, [items]);

  if (savings.discounts === 0 && savings.deposits === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-green-600" />
          {t('analytics.savings.title', 'Savings & Deposits')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid gap-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Discounts */}
          {savings.discounts > 0 && (
            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900"
              variants={staggerItem}
              layout
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                  <BadgePercent className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {t('analytics.savings.discounts', 'Total Saved')}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {t('analytics.savings.discountsDesc', 'From coupons and promotions')}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(savings.discounts, currency.symbol)}
              </p>
            </motion.div>
          )}

          {/* Deposits */}
          {savings.deposits > 0 && (
            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900"
              variants={staggerItem}
              layout
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                  <Recycle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {t('analytics.savings.deposits', 'Active Deposits')}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {t('analytics.savings.depositsDesc', 'Can be returned for cash')}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(savings.deposits, currency.symbol)}
              </p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
