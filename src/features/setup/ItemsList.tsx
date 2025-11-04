import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useStore } from '../../store/useStore';
import { CurrencySelector } from './CurrencySelector';
import { ItemSearchBar } from './ItemSearchBar';
import { BillInfoHeader } from './BillInfoHeader';
import { ItemRow } from '../../components/item-row';
import { AddItemDialog } from '../../components/AddItemDialog';
import { EmptyState } from '../../components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { layoutTransition } from '../../lib/motion';
import { getCategoryName } from '../../lib/taxonomy/migration';
import { isSpecialLine, isPfandLine, isDiscountLine, isTipLine, isFeeLine } from '../../lib/taxonomy/specialLines';

export function ItemsList() {
  const { t } = useTranslation();
  const items = useStore((state) => state.items);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      getCategoryName(item.category, 'de')?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Group items by type
  const itemGroups = useMemo(() => {
    const regularItems = filteredItems.filter(item => 
      !item.category || !isSpecialLine(item.category.id)
    );
    const discountItems = filteredItems.filter(item => 
      item.category && isDiscountLine(item.category.id)
    );
    const depositItems = filteredItems.filter(item => 
      item.category && isPfandLine(item.category.id)
    );
    const taxItems = filteredItems.filter(item => 
      item.category?.id === 'TAX'
    );
    const tipItems = filteredItems.filter(item => 
      item.category && isTipLine(item.category.id)
    );
    const feeItems = filteredItems.filter(item => 
      item.category && isFeeLine(item.category.id)
    );

    return {
      regular: regularItems,
      discounts: discountItems,
      deposits: depositItems,
      tax: taxItems,
      tips: tipItems,
      fees: feeItems,
    };
  }, [filteredItems]);

  // Calculate total
  const calculatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Check if multiple receipts were merged
  const hasMultipleReceipts = items.some((item) => item.originReceiptId);

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <CurrencySelector />

      {/* Search Bar */}
      <ItemSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        showSearchText={true}
        zIndex={10}
      />

      {/* Bill Info Header */}
      {items.length > 0 && (
        <BillInfoHeader
          calculatedTotal={calculatedTotal}
          itemCount={items.length}
        />
      )}

      {/* Items List or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title={t('setup.itemsList.emptyStates.noItems.title')}
          description={t('setup.itemsList.emptyStates.noItems.description')}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title={t('setup.itemsList.emptyStates.noResults.title')}
          description={t('setup.itemsList.emptyStates.noResults.description', { query: searchQuery })}
          action={
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              {t('setup.itemsList.emptyStates.noResults.action')}
            </Button>
          }
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Regular Items */}
          {itemGroups.regular.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {t('categories.sections.items', 'Items')}
              </h3>
              <AnimatePresence mode="popLayout">
                {itemGroups.regular.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    transition={layoutTransition}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <ItemRow
                      item={item}
                      showOriginBadge={hasMultipleReceipts}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Discounts */}
          {itemGroups.discounts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-green-600">
                    {t('categories.sections.discounts', 'Discounts')}
                  </h3>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                    {itemGroups.discounts.length}
                  </Badge>
                </div>
                <AnimatePresence mode="popLayout">
                  {itemGroups.discounts.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemRow
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Deposits (Pfand) */}
          {itemGroups.deposits.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-blue-600">
                    {t('categories.sections.deposits', 'Deposits (Pfand)')}
                  </h3>
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                    {itemGroups.deposits.length}
                  </Badge>
                </div>
                <AnimatePresence mode="popLayout">
                  {itemGroups.deposits.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemRow
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Fees */}
          {itemGroups.fees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-orange-600">
                  {t('categories.sections.fees', 'Fees')}
                </h3>
                <AnimatePresence mode="popLayout">
                  {itemGroups.fees.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemRow
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Tips */}
          {itemGroups.tips.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-purple-600">
                  {t('categories.sections.tips', 'Tips')}
                </h3>
                <AnimatePresence mode="popLayout">
                  {itemGroups.tips.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemRow
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Tax (Informational) */}
          {itemGroups.tax.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {t('categories.sections.tax', 'Tax (Included)')}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {t('common.informational', 'Info')}
                  </Badge>
                </div>
                <AnimatePresence mode="popLayout">
                  {itemGroups.tax.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ItemRow
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Add Manual Item Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        variant="outline"
        className="w-full"
        size="lg"
      >
        <Plus />
        {t('buttons.addManualItem')}
      </Button>

      {/* Add Item Dialog */}
      <AddItemDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
