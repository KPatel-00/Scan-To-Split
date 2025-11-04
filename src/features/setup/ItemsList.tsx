import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package, Tag, RecycleIcon, Coins, DollarSign, Receipt } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { useStore } from '../../store/useStore';
import { CurrencySelector } from './CurrencySelector';
import { ItemSearchBar } from './ItemSearchBar';
import { BillInfoHeader } from './BillInfoHeader';
import { PremiumItemCard } from './components/PremiumItemCard';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { AddItemDialog } from '../../components/AddItemDialog';
import { EmptyState } from '../../components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, layoutTransition } from '../../lib/motion';
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
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Regular Items - Premium Section */}
          {itemGroups.regular.length > 0 && (
            <div className="space-y-4">
              <PremiumSectionHeader
                icon={Package}
                title={t('categories.sections.items', 'Items')}
                count={itemGroups.regular.length}
              />
              <AnimatePresence mode="popLayout">
                {itemGroups.regular.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    transition={layoutTransition}
                  >
                    <PremiumItemCard
                      item={item}
                      showOriginBadge={hasMultipleReceipts}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Discounts - Premium Success Variant */}
          {itemGroups.discounts.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="space-y-4">
                <PremiumSectionHeader
                  icon={Tag}
                  title={t('categories.sections.discounts', 'Discounts')}
                  count={itemGroups.discounts.length}
                  variant="success"
                />
                <AnimatePresence mode="popLayout">
                  {itemGroups.discounts.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                    >
                      <PremiumItemCard
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Deposits (Pfand) - Premium Info Variant */}
          {itemGroups.deposits.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="space-y-4">
                <PremiumSectionHeader
                  icon={RecycleIcon}
                  title={t('categories.sections.deposits', 'Deposits (Pfand)')}
                  count={itemGroups.deposits.length}
                  variant="info"
                />
                <AnimatePresence mode="popLayout">
                  {itemGroups.deposits.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                    >
                      <PremiumItemCard
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Fees - Premium Warning Variant */}
          {itemGroups.fees.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="space-y-4">
                <PremiumSectionHeader
                  icon={Coins}
                  title={t('categories.sections.fees', 'Fees')}
                  count={itemGroups.fees.length}
                  variant="warning"
                />
                <AnimatePresence mode="popLayout">
                  {itemGroups.fees.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                    >
                      <PremiumItemCard
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Tips - Premium Info Variant */}
          {itemGroups.tips.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="space-y-4">
                <PremiumSectionHeader
                  icon={DollarSign}
                  title={t('categories.sections.tips', 'Tips')}
                  count={itemGroups.tips.length}
                  variant="info"
                />
                <AnimatePresence mode="popLayout">
                  {itemGroups.tips.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                    >
                      <PremiumItemCard
                        item={item}
                        showOriginBadge={hasMultipleReceipts}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Tax (Informational) - Premium Default with Badge */}
          {itemGroups.tax.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="space-y-4">
                <PremiumSectionHeader
                  icon={Receipt}
                  title={t('categories.sections.tax', 'Tax (Included)')}
                  count={itemGroups.tax.length}
                />
                <AnimatePresence mode="popLayout">
                  {itemGroups.tax.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      transition={layoutTransition}
                    >
                      <PremiumItemCard
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
