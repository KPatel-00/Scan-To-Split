import { useState, useMemo } from 'react';
import { useStore } from '../../../store/useStore';
import { feedback } from '../../../lib/feedback';

export function useBillTabs(searchQuery: string) {
  const receipts = useStore((state) => state.receipts);
  const items = useStore((state) => state.items);
  const setPayer = useStore((state) => state.setPayer);

  const [activeTab, setActiveTab] = useState<string>(receipts[0]?.id || '');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addDialogReceiptId, setAddDialogReceiptId] = useState<string | undefined>(undefined);

  // Calculate per-receipt data
  const receiptData = useMemo(() => {
    return receipts.map((receipt: any) => {
      const receiptItems = items.filter((item: any) => item.originReceiptId === receipt.id);
      const total = receiptItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      
      // Apply modifiers
      const taxAmount = receipt.taxAmount || 0;
      const tipAmount = receipt.tipAmount || 0;
      const finalTotal = total + taxAmount + tipAmount;

      return {
        receipt,
        items: receiptItems,
        total,
        taxAmount,
        tipAmount,
        finalTotal,
      };
    });
  }, [receipts, items]);

  // Filter items based on search query
  const filterItems = (receiptItems: any[]) => {
    if (!searchQuery.trim()) return receiptItems;
    const query = searchQuery.toLowerCase();
    return receiptItems.filter(
      (item: any) =>
        item.name.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query)
    );
  };

  // Auto-switch to tabs with search results
  useMemo(() => {
    if (searchQuery.trim()) {
      for (const data of receiptData) {
        const filtered = filterItems(data.items);
        if (filtered.length > 0 && activeTab !== data.receipt.id) {
          setActiveTab(data.receipt.id);
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, receiptData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    feedback.click();
  };

  const handlePayerChange = (payerId: string, receiptId: string) => {
    setPayer(payerId, receiptId);
    feedback.click();
  };

  const handleOpenAddDialog = (receiptId: string) => {
    setAddDialogReceiptId(receiptId);
    setShowAddDialog(true);
    feedback.click();
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    setAddDialogReceiptId(undefined);
  };

  return {
    activeTab,
    receiptData,
    filterItems,
    showAddDialog,
    addDialogReceiptId,
    handleTabChange,
    handlePayerChange,
    handleOpenAddDialog,
    handleCloseAddDialog,
  };
}
