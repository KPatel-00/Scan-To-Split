import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package, Tag, RecycleIcon, Coins, DollarSign, Receipt, ChevronDown, Search, Store, Calendar, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useStore } from '../../store/useStore';
import { CurrencySelector } from './CurrencySelector';
import { PremiumItemCard } from './components/PremiumItemCard';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { AddItemDialog } from '../../components/AddItemDialog';
import { EmptyState } from '../../components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '../../lib/motion';
import { getCategoryName } from '../../lib/taxonomy/migration';
import { isSpecialLine, isPfandLine, isDiscountLine, isTipLine, isFeeLine } from '../../lib/taxonomy/specialLines';
import { feedback } from '../../lib/feedback';
import { typography } from '../../lib/typography';

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

  const handlePayerChange = (participantId: string) => {
    const setPayer = useStore.getState().setPayer;
    setPayer(participantId, undefined); // undefined for merged mode
    feedback.click();
  };

  const currency = useStore((state) => state.currency);
  const mergedStoreName = useStore((state) => state.mergedStoreName);
  const mergedDate = useStore((state) => state.mergedDate);
  const mergedPaidBy = useStore((state) => state.mergedPaidBy);
  const participants = useStore((state) => state.participants);

  return (
    <div className="space-y-0">
      {/* Unified Card: Bill Header + Items */}
      {items.length > 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
          {/* Bill Info Header - Clickable to toggle */}
          <button
            onClick={toggleItemsExpanded}
            className="w-full text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-expanded={isItemsExpanded}
            aria-label={isItemsExpanded ? t('setup.itemsList.collapseItems', 'Collapse items') : t('setup.itemsList.expandItems', 'Expand items')}
          >
            <div className="bg-gradient-to-br from-primary/5 via-card/50 to-primary/10 p-6 hover:from-primary/10 hover:via-card/60 hover:to-primary/15 transition-all duration-300">
              {/* Currency Selector - Top Right */}
              <div className="mb-4 flex justify-end">
                <CurrencySelector />
              </div>
              
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                {/* Left Side - Store Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className={typography.heading.h3}>
                      {mergedStoreName || t('setup.itemsList.billInfo.storeName')}
                    </h3>
                  </div>
                  
                  {mergedDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{mergedDate}</span>
                    </div>
                  )}
                  
                  {/* Payer Selector */}
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                      {t('setup.itemsList.billInfo.paidBy')}
                    </span>
                    <Select 
                      value={mergedPaidBy || undefined} 
                      onValueChange={handlePayerChange}
                    >
                      <SelectTrigger 
                        className="h-9 w-full border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card sm:w-48" 
                        aria-label={t('ariaLabels.selectPayer')}
                      >
                        <SelectValue placeholder={t('setup.labels.paidBy')} />
                      </SelectTrigger>
                      <SelectContent>
                        {participants.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {t('setup.participants.addPrompt')}
                          </div>
                        ) : (
                          participants.map((participant) => (
                            <SelectItem key={participant.id} value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Side - Total */}
                <div className="flex flex-col items-end gap-2 rounded-lg bg-gradient-to-br from-primary/10 to-transparent p-4">
                  <div className={`${typography.display.md} text-primary`}>
                    {currency.symbol}{calculatedTotal.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('setup.itemsList.billInfo.totalItems', { count: items.length })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expansion Hint - Only when collapsed */}
            <AnimatePresence>
              {!isItemsExpanded && (
                <motion.div
                  key="collapsed-hint"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border/20 bg-muted/30 px-6 py-3"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Search className="h-3.5 w-3.5" />
                    <span className="font-medium">View & Search Items</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Items Section - Collapsible Content */}
          <AnimatePresence>
            {isItemsExpanded && (
              <motion.div
                key="items-content"
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
                      duration: 0.3,
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
                className="overflow-hidden border-t border-border/20"
              >
                <div className="p-6 space-y-6">
                  {/* Search Bar - Integrated */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('setup.itemsList.searchPlaceholder')}
                      className="pl-10 pr-10 bg-background/50"
                      aria-label={t('ariaLabels.searchItems')}
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchQuery('')}
                            className="h-6 w-6 rounded-full hover:bg-muted"
                            aria-label={t('ariaLabels.clearSearch')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Items List or Empty State */}
                  {filteredItems.length === 0 && searchQuery ? (
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

                  {/* Add Manual Item Button - Inside items section */}
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Plus />
                    {t('buttons.addManualItem')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title={t('setup.itemsList.emptyStates.noItems.title')}
          description={t('setup.itemsList.emptyStates.noItems.description')}
          action={
            <Button onClick={() => setShowAddDialog(true)} size="lg">
              <Plus />
              {t('buttons.addManualItem')}
            </Button>
          }
        />
      )}

      {/* Add Item Dialog */}
      <AddItemDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
