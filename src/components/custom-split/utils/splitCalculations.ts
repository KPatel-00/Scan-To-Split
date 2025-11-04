import type { Participant } from '../../../store/types';

export type SplitMode = 'amount' | 'percentage' | 'shares';

/**
 * Calculate the total amount based on split mode and values
 */
export function calculateLiveTotal(
  values: Record<string, string>,
  mode: SplitMode,
  itemTotal: number,
  participants: Participant[]
): number {
  let total = 0;

  participants.forEach((p) => {
    const value = parseFloat(values[p.id] || '0');

    if (mode === 'amount') {
      total += value;
    } else if (mode === 'percentage') {
      total += (itemTotal * value) / 100;
    } else if (mode === 'shares') {
      // Calculate monetary value from shares
      const totalShares = participants.reduce(
        (sum, participant) => sum + parseFloat(values[participant.id] || '0'),
        0
      );
      if (totalShares > 0) {
        total += (itemTotal * value) / totalShares;
      }
    }
  });

  return total;
}

/**
 * Convert values from one split mode to another
 */
export function convertSplitMode(
  currentValues: Record<string, string>,
  fromMode: SplitMode,
  toMode: SplitMode,
  itemTotal: number,
  participants: Participant[]
): Record<string, string> {
  const newValues: Record<string, string> = {};

  participants.forEach((p) => {
    const currentValue = parseFloat(currentValues[p.id] || '0');

    // Convert from current mode to new mode
    if (fromMode === 'amount' && toMode === 'percentage') {
      const percentage = itemTotal > 0 ? (currentValue / itemTotal) * 100 : 0;
      newValues[p.id] = percentage.toFixed(2);
    } else if (fromMode === 'amount' && toMode === 'shares') {
      // Default to 1 share each when switching to shares
      newValues[p.id] = '1';
    } else if (fromMode === 'percentage' && toMode === 'amount') {
      const amount = (itemTotal * currentValue) / 100;
      newValues[p.id] = amount.toFixed(2);
    } else if (fromMode === 'percentage' && toMode === 'shares') {
      newValues[p.id] = '1';
    } else if (fromMode === 'shares' && toMode === 'amount') {
      const totalShares = participants.reduce(
        (sum, participant) => sum + parseFloat(currentValues[participant.id] || '0'),
        0
      );
      const amount = totalShares > 0 ? (itemTotal * currentValue) / totalShares : 0;
      newValues[p.id] = amount.toFixed(2);
    } else if (fromMode === 'shares' && toMode === 'percentage') {
      const totalShares = participants.reduce(
        (sum, participant) => sum + parseFloat(currentValues[participant.id] || '0'),
        0
      );
      const percentage = totalShares > 0 ? (currentValue / totalShares) * 100 : 0;
      newValues[p.id] = percentage.toFixed(2);
    } else {
      // Same mode, keep value
      newValues[p.id] = currentValues[p.id] || '0';
    }
  });

  return newValues;
}

/**
 * Convert split values to final amount assignments
 */
export function convertToAmounts(
  values: Record<string, string>,
  mode: SplitMode,
  itemTotal: number,
  participants: Participant[]
): Record<string, number> {
  const splits: Record<string, number> = {};

  participants.forEach((p) => {
    const value = parseFloat(values[p.id] || '0');

    if (mode === 'amount') {
      splits[p.id] = value;
    } else if (mode === 'percentage') {
      splits[p.id] = (itemTotal * value) / 100;
    } else if (mode === 'shares') {
      const totalShares = participants.reduce(
        (sum, participant) => sum + parseFloat(values[participant.id] || '0'),
        0
      );
      splits[p.id] = totalShares > 0 ? (itemTotal * value) / totalShares : 0;
    }
  });

  return splits;
}
