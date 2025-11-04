import { motion } from 'framer-motion';
import { Plus, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { ItemRow } from '../../item-row';
import { EmptyState } from '../../EmptyState';
import { useStore } from '../../../store/useStore';

interface BillItemsListProps {
  items: any[];
  filteredItems: any[];
  receiptId: string;
  finalTotal: number;
  searchQuery: string;
  onAddItem: () => void;
}

export function BillItemsList({
  items,
  filteredItems,
  receiptId,
  finalTotal,
  searchQuery,
  onAddItem,
}: BillItemsListProps) {
  const { t } = useTranslation();
  const currency = useStore((state) => state.currency);
  const hasResults = filteredItems.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {t('setup.itemsList.billInfo.totalItems', { count: items.length })}
          </CardTitle>
          <div className="text-2xl font-bold text-primary">
            {currency.symbol}
            {finalTotal.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-12 w-12" />}
            title={t('setup.itemsList.emptyStates.noItems.title')}
            description={t('setup.itemsList.emptyStates.noItems.description')}
          />
        ) : !hasResults && searchQuery.trim() ? (
          <EmptyState
            icon={<Receipt className="h-12 w-12" />}
            title={t('setup.itemsList.emptyStates.noResults.title')}
            description={t('setup.itemsList.emptyStates.noResults.description', {
              query: searchQuery,
            })}
          />
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {filteredItems.map((item: any) => (
              <ItemRow
                key={item.id}
                item={item}
                receiptId={receiptId}
                showOriginBadge={false} // Don't show origin badge in separate mode
              />
            ))}
          </motion.div>
        )}

        <Separator />

        {/* Add Manual Item Button */}
        <Button variant="outline" className="w-full" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          {t('setup.itemsList.addItem.title')}
        </Button>
      </CardContent>
    </Card>
  );
}
