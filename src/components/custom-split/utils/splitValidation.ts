/**
 * Validate if the live total matches the expected item total
 * Uses a tolerance of 0.01 to account for floating point precision
 */
export function validateTotal(liveTotal: number, expectedTotal: number): boolean {
  return Math.abs(liveTotal - expectedTotal) < 0.01;
}

/**
 * Initialize split values based on existing assignments or equal split
 */
export function initializeSplitValues(
  itemTotal: number,
  participantIds: string[],
  existingAssignments?: Record<string, number>
): Record<string, string> {
  const values: Record<string, string> = {};

  if (existingAssignments) {
    // Load existing assignments
    participantIds.forEach((id) => {
      const amount = existingAssignments[id] || 0;
      values[id] = amount.toFixed(2);
    });
  } else {
    // Initialize with equal split
    const equalAmount = itemTotal / participantIds.length;
    participantIds.forEach((id) => {
      values[id] = equalAmount.toFixed(2);
    });
  }

  return values;
}
