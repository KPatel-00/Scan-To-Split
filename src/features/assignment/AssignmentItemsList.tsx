import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, Receipt, Users, Store } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/EmptyState';
import { ItemSearchBar } from '../setup/ItemSearchBar';
import { useStore } from '../../store/useStore';
import ItemCard from './ItemCard';
import { smoothSlow } from '@/lib/motion/physics';

// Stagger animation for item list with premium timing from lib/motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

// Item animation with index-based delay for cascading effect
const itemVariants = (index: number) => ({
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...smoothSlow,
      delay: index * 0.08,
    },
  },
});

export default function AssignmentItemsList({ selectedParticipants }: { selectedParticipants: string[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBills, setExpandedBills] = useState<string[]>([]);

  const managementMode = useStore((state) => state.managementMode);
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const participants = useStore((state) => state.participants);
  const currency = useStore((state) => state.currency);
  const mergedStoreName = useStore((state) => state.mergedStoreName);

  // Filter items by search query
  const filterItemsByQuery = (itemsToFilter: typeof items) => {
    if (!searchQuery.trim()) return itemsToFilter;
    const query = searchQuery.toLowerCase();
    return itemsToFilter.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  };

  // Merged mode: filter items directly
  const filteredMergedItems = useMemo(() => {
    return filterItemsByQuery(items);
  }, [items, searchQuery]);

  // Separate mode: filter per receipt
  const filteredReceiptsData = useMemo(() => {
    return receipts.map((receipt) => ({
      ...receipt,
      filteredItems: filterItemsByQuery(receipt.items),
    }));
  }, [receipts, searchQuery]);

  // Auto-expand bills with search matches in separate mode
  useMemo(() => {
    if (managementMode === 'separate' && searchQuery.trim()) {
      const billsWithMatches = filteredReceiptsData
        .filter((r) => r.filteredItems.length > 0)
        .map((r) => r.id);
      setExpandedBills(billsWithMatches);
    }
  }, [searchQuery, filteredReceiptsData, managementMode]);

  // Empty state: no items at all
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-16 w-16" />}
        title={t('assignment.noItems')}
        description={t('assignment.noItemsDescription')}
        actionLabel={t('assignment.addItems')}
        onAction={() => navigate('/setup')}
      />
    );
  }

  // No participants
  if (participants.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-16 w-16" />}
        title={t('assignment.noParticipants')}
        description={t('assignment.noParticipantsDescription')}
        actionLabel={t('assignment.addParticipants')}
        onAction={() => navigate('/setup')}
      />
    );
  }

  // Merged mode rendering
  if (managementMode === 'merged') {
    // No search results
    if (searchQuery.trim() && filteredMergedItems.length === 0) {
      return (
        <div className="space-y-4">
          <ItemSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            itemCount={filteredMergedItems.length}
            zIndex={30}
            placeholder={t('assignment.searchPlaceholder')}
          />
          <EmptyState
            icon={<Package className="h-16 w-16" />}
            title={t('assignment.noSearchResults')}
            description={t('assignment.noSearchResultsDescription', { query: searchQuery })}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <ItemSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          itemCount={filteredMergedItems.length}
          zIndex={30}
          placeholder={t('assignment.searchPlaceholder')}
        />
        
        {/* Premium Bill Header Card for Merged Mode */}
        {mergedStoreName && (
          <Card className="p-4 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{mergedStoreName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {filteredMergedItems.length} {t('assignment.items', { count: filteredMergedItems.length })}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {currency.symbol}
                {filteredMergedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </Badge>
            </div>
          </Card>
        )}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMergedItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants(index)}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                transition={smoothSlow}
              >
                <ItemCard
                  item={item}
                  participants={participants}
                  selectedParticipants={selectedParticipants}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Separate mode rendering
  // No receipts (shouldn't happen, but defensive)
  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title={t('assignment.noReceipts')}
        description={t('assignment.noReceiptsDescription')}
        actionLabel={t('assignment.scanReceipts')}
        onAction={() => navigate('/setup')}
      />
    );
  }

  // No search results across all receipts
  const totalFilteredItems = filteredReceiptsData.reduce(
    (sum, r) => sum + r.filteredItems.length,
    0
  );

  if (searchQuery.trim() && totalFilteredItems === 0) {
    return (
      <div className="space-y-4">
        <ItemSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          itemCount={totalFilteredItems}
          zIndex={30}
          placeholder={t('assignment.searchPlaceholder')}
        />
        <EmptyState
          icon={<Package className="h-16 w-16" />}
          title={t('assignment.noSearchResults')}
          description={t('assignment.noSearchResultsDescription', { query: searchQuery })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ItemSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        itemCount={totalFilteredItems}
        zIndex={30}
        placeholder={t('assignment.searchPlaceholder')}
      />
      
      <Accordion
        type="multiple"
        value={expandedBills}
        onValueChange={setExpandedBills}
        className="space-y-4"
      >
        {filteredReceiptsData.map((receipt, index) => {
          const receiptTotal =
            receipt.filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
            (receipt.tax || 0) +
            (receipt.tip || 0);
          const hasItems = receipt.filteredItems.length > 0;

          // Hide receipts with no matches when searching
          if (searchQuery.trim() && !hasItems) return null;

          return (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...smoothSlow, delay: index * 0.1 }}
            >
              <AccordionItem
                value={receipt.id}
                className="border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]>div>svg]:rotate-180">
                  <div className="flex items-center justify-between w-full pr-2">
                    {/* Left: Bill Info with Premium Styling */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">
                            {receipt.storeName || t('assignment.billInfo.unknownStore')}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(receipt.date).toLocaleDateString(
                            t('common.locale'),
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: Total + Item Count with Premium Badges */}
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <Badge variant="secondary" className="text-base font-bold mb-1">
                          {currency.symbol}
                          {receiptTotal.toFixed(2)}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {receipt.filteredItems.length} {t('assignment.items', { count: receipt.filteredItems.length })}
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent 
                  className="px-4 pb-4 pt-2"
                  // Premium smoothSlow physics for smooth expansion (Blueprint requirement)
                >
                  {hasItems ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <AnimatePresence mode="popLayout">
                        {receipt.filteredItems.map((item, itemIndex) => {
                          // Find origin label for this item
                          const originLabel = receipt.storeName || t('assignment.billInfo.unknownStore');

                          return (
                            <motion.div
                              key={item.id}
                              variants={itemVariants(itemIndex)}
                              initial="hidden"
                              animate="visible"
                              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                              layout
                              transition={smoothSlow}
                            >
                              <ItemCard
                                item={item}
                                participants={participants}
                                selectedParticipants={selectedParticipants}
                                receiptId={receipt.id}
                                showOriginBadge={false} // Don't show origin in separate mode
                              />
                              {/* Optional: Show subtle origin badge on hover for context */}
                              {managementMode === 'separate' && (
                                <div className="hidden group-hover:block text-xs text-muted-foreground mt-1 ml-2">
                                  <Store className="inline h-3 w-3 mr-1" />
                                  {originLabel}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <div className="py-8">
                      <EmptyState
                        icon={<Package className="h-16 w-16" />}
                        title={t('assignment.noItemsInReceipt')}
                        description={t('assignment.noItemsInReceiptDescription')}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>
    </div>
  );
}


