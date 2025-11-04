import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package, Tag, RecycleIcon, Coins, DollarSign, Receipt, ChevronDown, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { useStore } from '../../store/useStore';
import { ItemSearchBar } from './ItemSearchBar';
import { BillInfoHeader } from './BillInfoHeader';
import { PremiumItemCard } from './components/PremiumItemCard';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { AddItemDialog } from '../../components/AddItemDialog';
import { EmptyState } from '../../components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '../../lib/motion';
import { getCategoryName } from '../../lib/taxonomy/migration';
import { isSpecialLine, isPfandLine, isDiscountLine, isTipLine, isFeeLine } from '../../lib/taxonomy/specialLines';
import { feedback } from '../../lib/feedback';

export function ItemsList() {
  const { t } = useTranslation();
  const items = useStore((state) => state.items);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);

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

  const toggleItemsExpanded = () => {
    setIsItemsExpanded(!isItemsExpanded);
    feedback.click(); // Tactile feedback
  };

  return (
    <div className="space-y-0">
      {/* Bill Info Header - Collapsible */}
      {items.length > 0 && (
        <div>
          {/* Clickable Header */}
          <button
            onClick={toggleItemsExpanded}
            className="w-full text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
            aria-expanded={isItemsExpanded}
            aria-label={isItemsExpanded ? t('setup.itemsList.collapseItems', 'Collapse items') : t('setup.itemsList.expandItems', 'Expand items')}
          >
            <BillInfoHeader
              calculatedTotal={calculatedTotal}
              itemCount={items.length}
            />
            
            {/* Expansion Indicator - Premium Style */}
            <motion.div
              className="flex items-center justify-center gap-2 -mt-2 mb-4 text-sm text-muted-foreground"
              initial={false}
              animate={{
                opacity: isItemsExpanded ? 0.6 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {!isItemsExpanded && (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="font-medium">View & Search Items</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                animate={{
                  rotate: isItemsExpanded ? 180 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </button>

          {/* Visual Connection - Only when expanded */}
          <AnimatePresence>
            {isItemsExpanded && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-2"
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Collapsible Items Section */}
      <AnimatePresence mode="wait">
        {isItemsExpanded && (
          <motion.div
            key="items-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
                opacity: {
                  duration: 0.4,
                  delay: 0.1,
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
                opacity: {
                  duration: 0.2,
                }
              }
            }}
            className="overflow-hidden"
          >
            {/* Search Bar - Collapsible */}
            <ItemSearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              collapsible={true}
              zIndex={10}
            />

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
                className="rounded-xl border border-x border-border/40 border-t-0 bg-card/30 p-6 backdrop-blur-sm shadow-sm space-y-8"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    layout
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      layout
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      layout
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      layout
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      layout
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      layout
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Manual Item Button - Always visible outside collapsible area */}
      <Button
        onClick={() => setShowAddDialog(true)}
        variant="outline"
        className="w-full mt-6"
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
