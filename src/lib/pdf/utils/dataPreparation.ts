/**
 * PDF Data Preparation
 * Prepares and transforms data for PDF generation
 */

import type { PDFExportData, ParticipantPDFData } from '../types';
import { calculateParticipantBalances, calculateSettlement } from '../../settlement';

/**
 * Prepare all data needed for PDF generation
 */
export function prepareData(data: PDFExportData) {
  // Build bill sources string
  const sources = data.managementMode === 'merged'
    ? (data.mergedStoreName || 'Unknown Store')
    : [...new Set(data.receipts.map(r => r.storeName || 'Unknown Store'))].join(', ');

  // Calculate balances and settlement
  const billData = data.managementMode === 'merged'
    ? {
        items: data.items,
        tax: data.mergedTax || 0,
        tip: data.mergedTip || 0,
        paidBy: data.receipts[0]?.paidBy || undefined,
      }
    : data.receipts.map(r => ({
        items: r.items,
        tax: r.tax || 0,
        tip: r.tip || 0,
        paidBy: r.paidBy || undefined,
      }));

  const balances = calculateParticipantBalances(data.participants, billData, data.managementMode);
  const transactions = calculateSettlement(balances);

  // Calculate grand total
  const grandTotal = data.managementMode === 'merged'
    ? data.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 
      (data.mergedTax || 0) + (data.mergedTip || 0)
    : data.receipts.reduce((sum, r) => {
        const itemsTotal = r.items.reduce((s, i) => s + i.price * i.quantity, 0);
        return sum + itemsTotal + (r.tax || 0) + (r.tip || 0);
      }, 0);

  // Prepare participant data
  const participantData: ParticipantPDFData[] = data.participants.map(participant => {
    const balance = balances.find(b => b.id === participant.id)!;
    const items: { item: any; share: number; origin?: string }[] = [];
    const itemsByReceipt = new Map<string, { item: any; share: number }[]>();

    if (data.managementMode === 'merged') {
      // Merged mode: Single list with origin badges
      data.items.forEach(item => {
        const isAssigned = item.assignedTo?.includes(participant.id);
        
        if (isAssigned) {
          // Check for custom split
          const customAmount = item.assignments?.[participant.id];
          const assignedCount = item.assignedTo?.length || 1;
          const share = customAmount !== undefined
            ? customAmount
            : item.price * item.quantity / assignedCount;
          
          const origin = item.originReceiptId
            ? data.receipts.find(r => r.id === item.originReceiptId)?.storeName
            : undefined;

          items.push({ item, share, origin });
        }
      });
    } else {
      // Separate mode: Group by receipt
      data.receipts.forEach(receipt => {
        const receiptItems: { item: any; share: number }[] = [];
        
        receipt.items.forEach(item => {
          const isAssigned = item.assignedTo?.includes(participant.id);
          
          if (isAssigned) {
            // Check for custom split
            const customAmount = item.assignments?.[participant.id];
            const assignedCount = item.assignedTo?.length || 1;
            const share = customAmount !== undefined
              ? customAmount
              : item.price * item.quantity / assignedCount;
            
            receiptItems.push({ item, share });
          }
        });

        if (receiptItems.length > 0) {
          itemsByReceipt.set(receipt.storeName || 'Unknown Store', receiptItems);
        }
      });
    }

    return { participant, balance, items, itemsByReceipt };
  });

  return {
    sources,
    balances,
    transactions,
    grandTotal,
    participantData,
  };
}
