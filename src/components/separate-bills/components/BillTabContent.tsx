import { TabsContent } from '../../ui/tabs';
import { BillPayerSelector } from './BillPayerSelector';
import { BillItemsList } from './BillItemsList';
import { BillSummaryCard } from './BillSummaryCard';
import { BillModifiers } from '../../../features/setup/BillModifiers';

interface BillTabContentProps {
  receipt: any;
  items: any[];
  filteredItems: any[];
  total: number;
  taxAmount: number;
  tipAmount: number;
  finalTotal: number;
  searchQuery: string;
  onPayerChange: (payerId: string, receiptId: string) => void;
  onAddItem: (receiptId: string) => void;
}

export function BillTabContent({
  receipt,
  items,
  filteredItems,
  total,
  taxAmount,
  tipAmount,
  finalTotal,
  searchQuery,
  onPayerChange,
  onAddItem,
}: BillTabContentProps) {
  return (
    <TabsContent value={receipt.id} className="mt-6 space-y-6">
      {/* Payer Selector Card */}
      <BillPayerSelector
        receiptId={receipt.id}
        paidBy={receipt.paidBy}
        onPayerChange={onPayerChange}
      />

      {/* Bill Modifiers (Tax/Tip) */}
      <BillModifiers receiptId={receipt.id} />

      {/* Items List */}
      <BillItemsList
        items={items}
        filteredItems={filteredItems}
        receiptId={receipt.id}
        finalTotal={finalTotal}
        searchQuery={searchQuery}
        onAddItem={() => onAddItem(receipt.id)}
      />

      {/* Per-Bill Verification Card */}
      <BillSummaryCard
        subtotal={total}
        taxAmount={taxAmount}
        tipAmount={tipAmount}
        finalTotal={finalTotal}
      />
    </TabsContent>
  );
}
