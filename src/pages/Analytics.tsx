import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { CategoryBreakdown } from '../components/analytics/CategoryBreakdown';
import { SavingsSummary } from '../components/analytics/SavingsSummary';
import { TopCategories } from '../components/analytics/TopCategories';
import { Card, CardContent } from '../components/ui/card';
import { BarChart3, Receipt, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/motion';
import { calculateItemsTotal, formatCurrency } from '../lib/utils';
import { typography } from '../lib/typography';

export function Analytics() {
  const { t } = useTranslation();
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const currency = useStore((state) => state.currency);

  // Combine items from all receipts
  const allItems = [
    ...items,
    ...receipts.flatMap(receipt => receipt.items),
  ];

  // Use centralized utility for total calculation
  const totalSpent = calculateItemsTotal(allItems);

  return (
    <motion.div
      className="container mx-auto p-6 space-y-6 max-w-7xl"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className={`${typography.h1} flex items-center gap-2`}>
          <BarChart3 className="h-8 w-8" />
          {t('analytics.title', 'Analytics')}
        </h1>
        <p className={`${typography.body.lgMuted} mt-2`}>
          {t('analytics.description', 'Insights into your spending patterns')}
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={typography.body.smMuted}>
                    {t('analytics.stats.totalSpent', 'Total Spent')}
                  </p>
                  <p className={typography.stats.medium}>
                    {formatCurrency(totalSpent, currency.symbol)}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={typography.body.smMuted}>
                    {t('analytics.stats.totalItems', 'Total Items')}
                  </p>
                  <p className={typography.stats.medium}>{allItems.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={typography.body.smMuted}>
                    {t('analytics.stats.avgPerItem', 'Avg per Item')}
                  </p>
                  <p className={typography.stats.medium}>
                    {formatCurrency(totalSpent / (allItems.length || 1), currency.symbol)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Analytics Widgets */}
      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={staggerContainer}
      >
        <motion.div variants={staggerItem}>
          <CategoryBreakdown items={allItems} currency={currency} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <TopCategories items={allItems} currency={currency} limit={10} />
        </motion.div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <SavingsSummary items={allItems} currency={currency} />
      </motion.div>
    </motion.div>
  );
}

