/**
 * Settlement Algorithm - Minimum Transaction Calculator
 * 
 * This module implements the debt settlement algorithm required by Part 4, Section 2.7.
 * It calculates the minimum number of transactions needed to settle all debts.
 */

export interface ParticipantBalance {
  id: string;
  name: string;
  color: string;
  totalCost: number;
  totalPaid: number;
  balance: number;
}

export interface Transaction {
  from: string; // Participant name (debtor)
  to: string;   // Participant name (creditor)
  amount: number;
}

/**
 * Calculate minimum transactions to settle all debts
 * Uses a greedy algorithm to match debtors with creditors
 * 
 * @param balances - Array of participant balances
 * @returns Array of transactions to settle all debts
 */
export function calculateSettlement(balances: ParticipantBalance[]): Transaction[] {
  // Create working copies sorted by balance (debtors first, then creditors)
  const debtors = balances
    .filter(p => p.balance < -0.01) // Owes money (negative balance)
    .map(p => ({ ...p, remaining: -p.balance })) // Convert to positive amount owed
    .sort((a, b) => b.remaining - a.remaining); // Largest debt first

  const creditors = balances
    .filter(p => p.balance > 0.01) // Is owed money (positive balance)
    .map(p => ({ ...p, remaining: p.balance }))
    .sort((a, b) => b.remaining - a.remaining); // Largest credit first

  const transactions: Transaction[] = [];

  // Greedy algorithm: Match largest debtor with largest creditor
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    // Calculate transaction amount (minimum of what's owed and what's due)
    const amount = Math.min(debtor.remaining, creditor.remaining);

    // Skip negligible amounts (< 1 cent)
    if (amount < 0.01) {
      if (debtor.remaining < creditor.remaining) {
        debtorIndex++;
      } else {
        creditorIndex++;
      }
      continue;
    }

    // Record transaction
    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimals
    });

    // Update remaining balances
    debtor.remaining -= amount;
    creditor.remaining -= amount;

    // Move to next debtor/creditor if settled
    if (debtor.remaining < 0.01) {
      debtorIndex++;
    }
    if (creditor.remaining < 0.01) {
      creditorIndex++;
    }
  }

  return transactions;
}

/**
 * Calculate total cost per participant including proportional tax/tip
 * Implements the multi-step calculation from Blueprint Section 2.7
 */
export interface BillData {
  items: any[];
  tax: number;
  tip: number;
  paidBy?: string; // Participant ID who paid this bill
}

export function calculateParticipantBalances(
  participants: any[],
  billData: BillData | BillData[], // Single bill (merged) or array (separate)
  _managementMode: 'merged' | 'separate'
): ParticipantBalance[] {
  const bills = Array.isArray(billData) ? billData : [billData];

  return participants.map(participant => {
    let totalCost = 0;
    let totalPaid = 0;

    // Process each bill
    bills.forEach(bill => {
      // Step A: Calculate itemCost for this participant on this bill
      let itemCostOnBill = 0;
      
      bill.items.forEach((item: any) => {
        const itemTotal = item.price * item.quantity;
        
        if (item.assignments && item.assignments[participant.id]) {
          // Custom split - use assigned amount
          itemCostOnBill += item.assignments[participant.id];
        } else if (item.assignedTo?.includes(participant.id)) {
          // Equal split among assigned participants
          const assignedCount = item.assignedTo.length;
          itemCostOnBill += itemTotal / assignedCount;
        }
      });

      // Step B: Calculate totalItemCost for this bill (excluding tax/tip)
      const totalItemCost = bill.items.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);

      // Step C: Calculate proportional share of modifiers (tax/tip)
      let shareOfModifiers = 0;
      if (totalItemCost > 0) {
        const costPercentage = itemCostOnBill / totalItemCost;
        shareOfModifiers = costPercentage * ((bill.tax || 0) + (bill.tip || 0));
      }

      // Add to participant's total cost
      totalCost += itemCostOnBill + shareOfModifiers;

      // Step D: Check if participant paid for this bill
      if (bill.paidBy === participant.id) {
        // Calculate bill's grand total (items + tax + tip)
        const billGrandTotal = totalItemCost + (bill.tax || 0) + (bill.tip || 0);
        totalPaid += billGrandTotal;
      }
    });

    // Calculate balance (positive = owed, negative = owes)
    const balance = totalPaid - totalCost;

    return {
      id: participant.id,
      name: participant.name,
      color: participant.color,
      totalCost: Math.round(totalCost * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    };
  });
}
