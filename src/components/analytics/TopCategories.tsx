import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { getCategoryIconComponent } from '../../lib/taxonomy/helpers';
import { staggerContainer, staggerItem } from '@/lib/motion/entry';
import { interactiveSubtle } from '@/lib/motion/tactile';
import { aggregateItemsByCategory, formatCurrency, getCategoryName, type Currency } from '../../lib/utils';
import type { Item } from '../../store/types';

interface TopCategoriesProps {
  items: Item[];
  currency: Currency;
  limit?: number;
}

export function TopCategories({ items, currency, limit = 5 }: TopCategoriesProps) {
  const { t, i18n } = useTranslation();

  const topCategories = useMemo(() => {
    // Use centralized aggregation with special lines excluded
    const categoryMap = aggregateItemsByCategory(items);

    return Array.from(categoryMap.values())
      .map((data) => ({
        categoryId: data.categoryId,
        categoryName: getCategoryName(data.category, i18n.language as 'en' | 'de'),
        icon: data.category.icon,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }, [items, i18n.language, limit]);

  if (topCategories.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('analytics.topCategories.title', 'Top Categories')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {topCategories.map((category, index) => {
            const Icon = getCategoryIconComponent(category.icon);
            
            return (
              <motion.div
                key={category.categoryId}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent/50 transition-colors"
                variants={staggerItem}
                whileHover={interactiveSubtle.whileHover}
                whileTap={interactiveSubtle.whileTap}
                layout
              >
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{category.categoryName}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.count} {t('common.items', 'items')}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(category.total, currency.symbol)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}


