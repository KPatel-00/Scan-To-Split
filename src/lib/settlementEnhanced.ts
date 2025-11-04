/**
 * Enhanced Settlement Calculations with Special Line Support
 */

import {
  isSpecialLine,
  isPfandLine,
  isDiscountLine,
  isTipLine,
  isFeeLine,
} from './taxonomy/specialLines';
import type { Item, Participant } from '../store/types';

export interface SplitCalculation {
  participantSplits: Record<string, number>;  // Regular item splits
  specialLines: {
    tax: number;                // Total tax (informational only)
    deposits: number;           // Total Pfand (track separately)
    depositReturns: number;     // Total Pfandrückgabe
    discounts: number;          // Total discounts (applied proportionally)
    tips: number;               // Total tips (split equally)
    fees: number;               // Total fees (split equally)
  };
  totals: {
    subtotal: number;           // Items only (excluding special lines)
    afterDiscounts: number;     // Subtotal + discounts (discounts are negative)
    deposits: number;           // Net deposits (DEPO - DEPO_RET)
    tips: number;               // Total tips
    fees: number;               // Total fees
    grandTotal: number;         // Final amount to split
  };
}

/**
 * Calculate splits with special line item handling
 */
export function calculateSplitsWithSpecialLines(
  items: Item[],
  participants: Participant[]
): SplitCalculation {
  // Separate items by type
  const regularItems = items.filter(item => 
    item.category && !isSpecialLine(item.category.id)
  );
  const specialLineItems = items.filter(item => 
    item.category && isSpecialLine(item.category.id)
  );

  // Calculate special line totals
  const taxItems = specialLineItems.filter(i => i.category?.id === 'TAX');
  const depositItems = specialLineItems.filter(i => i.category && isPfandLine(i.category.id));
  const discountItems = specialLineItems.filter(i => i.category && isDiscountLine(i.category.id));
  const tipItems = specialLineItems.filter(i => i.category && isTipLine(i.category.id));
  const feeItems = specialLineItems.filter(i => i.category && isFeeLine(i.category.id));

  const taxTotal = taxItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const depositTotal = depositItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountTotal = discountItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tipTotal = tipItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const feeTotal = feeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Calculate subtotal from regular items only
  const subtotal = regularItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate per-participant splits for regular items
  const participantSplits: Record<string, number> = {};
  
  participants.forEach(participant => {
    const participantItems = regularItems.filter(item => 
      item.assignedTo?.includes(participant.id)
    );
    
    participantSplits[participant.id] = participantItems.reduce((sum, item) => {
      const assignedCount = item.assignedTo?.length || 1;
      const itemTotal = item.price * item.quantity;
      return sum + (itemTotal / assignedCount);
    }, 0);
  });

  // Apply discounts proportionally
  if (discountTotal !== 0 && subtotal > 0) {
    const discountRatio = Math.abs(discountTotal) / subtotal;
    Object.keys(participantSplits).forEach(participantId => {
      const discount = participantSplits[participantId] * discountRatio;
      participantSplits[participantId] += discountTotal < 0 ? -discount : discount;
    });
  }

  // Add tips (split equally)
  if (tipTotal > 0 && participants.length > 0) {
    const tipPerPerson = tipTotal / participants.length;
    Object.keys(participantSplits).forEach(participantId => {
      participantSplits[participantId] += tipPerPerson;
    });
  }

  // Add fees (split equally)
  if (feeTotal > 0 && participants.length > 0) {
    const feePerPerson = feeTotal / participants.length;
    Object.keys(participantSplits).forEach(participantId => {
      participantSplits[participantId] += feePerPerson;
    });
  }

  const afterDiscounts = subtotal + discountTotal;
  const grandTotal = afterDiscounts + tipTotal + feeTotal;

  return {
    participantSplits,
    specialLines: {
      tax: taxTotal,
      deposits: depositItems
        .filter(i => i.category?.id === 'DEPO')
        .reduce((sum, i) => sum + i.price * i.quantity, 0),
      depositReturns: depositItems
        .filter(i => i.category?.id === 'DEPO_RET')
        .reduce((sum, i) => sum + i.price * i.quantity, 0),
      discounts: discountTotal,
      tips: tipTotal,
      fees: feeTotal,
    },
    totals: {
      subtotal,
      afterDiscounts,
      deposits: depositTotal,
      tips: tipTotal,
      fees: feeTotal,
      grandTotal,
    },
  };
}
