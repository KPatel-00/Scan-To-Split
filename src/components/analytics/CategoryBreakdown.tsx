import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { getCategoryIconComponent } from '../../lib/taxonomy/helpers';
import { staggerContainer, staggerItem } from '@/lib/motion/entry';
import { aggregateItemsByCategory, formatCurrency, getCategoryName, type Currency } from '../../lib/utils';
import type { Item } from '../../store/types';

interface CategoryBreakdownProps {
  items: Item[];
  currency: Currency;
}

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  icon: string;
  total: number;
  percentage: number;
  itemCount: number;
}

export function CategoryBreakdown({ items, currency }: CategoryBreakdownProps) {
  const { t, i18n } = useTranslation();

  // Calculate category totals using centralized utility
  const categoryData = useMemo(() => {
    const categoryMap = aggregateItemsByCategory(items);
    
    const grandTotal = Array.from(categoryMap.values())
      .reduce((sum, cat) => sum + cat.total, 0);

    const summaries: CategorySummary[] = Array.from(categoryMap.values())
      .map((data) => ({
        categoryId: data.categoryId,
        categoryName: getCategoryName(data.category, i18n.language as 'en' | 'de'),
        icon: data.category.icon,
        total: data.total,
        percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
        itemCount: data.count,
      }))
      .sort((a, b) => b.total - a.total);

    return summaries;
  }, [items, i18n.language]);

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('analytics.categoryBreakdown.title', 'Spending by Category')}
        </CardTitle>
        <CardDescription>
          {t('analytics.categoryBreakdown.description', 'See where your money went')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {categoryData.map((category) => {
            const Icon = getCategoryIconComponent(category.icon);
            
            return (
              <motion.div
                key={category.categoryId}
                className="space-y-2"
                variants={staggerItem}
                layout
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{category.categoryName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('analytics.categoryBreakdown.itemCount', {
                          count: category.itemCount,
                          defaultValue: `${category.itemCount} item${category.itemCount !== 1 ? 's' : ''}`,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.total, currency.symbol)}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
