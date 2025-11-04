/**
 * Receipt Selectors - Calculations and derived state for receipts
 */
import type { Receipt } from '../types';

export const receiptSelectors = {
  /**
   * Calculate total for a receipt including tax and tip
   */
  getReceiptTotal: (receipt: Receipt): number => {
    const itemsTotal = receipt.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal + receipt.tax + receipt.tip;
  },

  /**
   * Get subtotal (items only) for a receipt
   */
  getReceiptSubtotal: (receipt: Receipt): number =>
    receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  /**
   * Calculate grand total across all receipts
   */
  getGrandTotal: (receipts: Receipt[]): number =>
    receipts.reduce((sum, receipt) => sum + receiptSelectors.getReceiptTotal(receipt), 0),

  /**
   * Get receipts that are missing a payer
   */
  getReceiptsWithoutPayer: (receipts: Receipt[]): Receipt[] =>
    receipts.filter((receipt) => !receipt.paidBy),

  /**
   * Check if receipt totals match AI-scanned total
   */
  isReceiptVerified: (receipt: Receipt): boolean => {
    if (!receipt.total) return true; // No AI total to verify against
    const calculated = receiptSelectors.getReceiptTotal(receipt);
    const difference = Math.abs(calculated - receipt.total);
    return difference < 0.01; // Within 1 cent
  },
};
