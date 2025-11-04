import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Tabs, TabsList } from '../ui/tabs';
import { Button } from '../ui/button';
import { EmptyState } from '../EmptyState';
import { AddItemDialog } from '../AddItemDialog';
import { BillTabHeader } from './components/BillTabHeader';
import { BillTabContent } from './components/BillTabContent';
import { useBillTabs } from './hooks/useBillTabs';

interface SeparateBillsTabsProps {
  searchQuery: string;
}

export function SeparateBillsTabs({ searchQuery }: SeparateBillsTabsProps) {
  const { t } = useTranslation();
  const receipts = useStore((state) => state.receipts);

  const {
    activeTab,
    receiptData,
    filterItems,
    showAddDialog,
    addDialogReceiptId,
    handleTabChange,
    handlePayerChange,
    handleOpenAddDialog,
    handleCloseAddDialog,
  } = useBillTabs(searchQuery);

  if (receipts.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-12 w-12" />}
        title={t('setup.itemsList.emptyStates.noItems.title')}
        description={t('setup.itemsList.emptyStates.noItems.description')}
        action={
          <Button
            variant="default"
            onClick={() => (window.location.hash = 'scan-section')}
          >
            {t('setup.itemsList.emptyStates.noItems.action')}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* Rich Tab Headers */}
        <TabsList
          className="grid w-full gap-2 h-auto bg-transparent p-0"
          style={{ gridTemplateColumns: `repeat(${receipts.length}, 1fr)` }}
        >
          {receiptData.map((data: any, index: number) => {
            const hasSearchResults =
              !!searchQuery.trim() && filterItems(data.items).length > 0;

            return (
              <BillTabHeader
                key={data.receipt.id}
                receipt={data.receipt}
                index={index}
                total={data.total}
                finalTotal={data.finalTotal}
                itemCount={data.items.length}
                hasSearchResults={hasSearchResults}
              />
            );
          })}
        </TabsList>

        {/* Tab Content for Each Receipt */}
        {receiptData.map((data: any) => {
          const filteredItems = filterItems(data.items);

          return (
            <BillTabContent
              key={data.receipt.id}
              receipt={data.receipt}
              items={data.items}
              filteredItems={filteredItems}
              total={data.total}
              taxAmount={data.taxAmount}
              tipAmount={data.tipAmount}
              finalTotal={data.finalTotal}
              searchQuery={searchQuery}
              onPayerChange={handlePayerChange}
              onAddItem={handleOpenAddDialog}
            />
          );
        })}
      </Tabs>

      {/* Add Item Dialog */}
      <AddItemDialog
        open={showAddDialog}
        onClose={handleCloseAddDialog}
        receiptId={addDialogReceiptId}
      />
    </div>
  );
}
