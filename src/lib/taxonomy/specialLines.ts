/**
 * Special Line Item Logic
 * Handles TAX, DEPO, DISC, FEES, TIP, etc.
 */

/**
 * Check if category is a special line item
 */
export function isSpecialLine(categoryIdOrCode: string): boolean {
  const specialCodes = [
    'TAX', 'DEPO', 'DEPO_RET', 'DISC', 'FEES',
    'SHIP', 'TIP', 'ROUND', 'REFUND', 'CASHBK', 'DONAT', 'PAYMT',
  ];
  return specialCodes.includes(categoryIdOrCode);
}

/**
 * Check if item should be excluded from split calculation
 * (e.g., TAX is usually already included in item prices)
 */
export function shouldExcludeFromSplit(categoryId: string): boolean {
  return [
    'TAX',      // VAT/Sales tax (usually inclusive)
    'PAYMT',    // Payment lines (not actual items)
    'CASHBK',   // Cashback (separate from bill)
  ].includes(categoryId);
}

/**
 * Check if item is a Pfand/deposit line
 */
export function isPfandLine(categoryId: string): boolean {
  return categoryId === 'DEPO' || categoryId === 'DEPO_RET';
}

/**
 * Check if item is a discount/coupon
 */
export function isDiscountLine(categoryId: string): boolean {
  return categoryId === 'DISC';
}

/**
 * Check if item is a fee/surcharge
 */
export function isFeeLine(categoryId: string): boolean {
  return categoryId === 'FEES' || categoryId === 'SHIP';
}

/**
 * Check if item is tip/gratuity
 */
export function isTipLine(categoryId: string): boolean {
  return categoryId === 'TIP';
}

/**
 * Check if item is a refund/return
 */
export function isRefundLine(categoryId: string): boolean {
  return categoryId === 'REFUND';
}

/**
 * Get special line handling strategy
 */
export type SpecialLineStrategy = 
  | 'exclude'          // Exclude from splits (TAX, PAYMT)
  | 'split-equal'      // Split equally (TIP, FEES, ROUND)
  | 'split-proportional' // Split by proportion (DISC)
  | 'track-separate'   // Track separately (DEPO, DEPO_RET)
  | 'track-only';      // Display only, no split (REFUND, CASHBK)

export function getSpecialLineStrategy(categoryId: string): SpecialLineStrategy {
  switch (categoryId) {
    case 'TAX':
    case 'PAYMT':
      return 'exclude';
    
    case 'TIP':
    case 'FEES':
    case 'SHIP':
    case 'ROUND':
      return 'split-equal';
    
    case 'DISC':
      return 'split-proportional';
    
    case 'DEPO':
    case 'DEPO_RET':
      return 'track-separate';
    
    case 'REFUND':
    case 'CASHBK':
    case 'DONAT':
      return 'track-only';
    
    default:
      return 'exclude';
  }
}

/**
 * Validate special line item price constraints
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSpecialLineItem(
  categoryId: string,
  price: number,
  itemName: string
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // DEPO must be positive
  if (categoryId === 'DEPO' && price <= 0) {
    result.valid = false;
    result.errors.push(
      `Deposit "${itemName}" has invalid price: ${price}. Deposits must be positive.`
    );
  }

  // DEPO_RET must be negative
  if (categoryId === 'DEPO_RET' && price >= 0) {
    result.valid = false;
    result.errors.push(
      `Deposit return "${itemName}" has invalid price: ${price}. Returns must be negative.`
    );
  }

  // DISC must be negative
  if (categoryId === 'DISC' && price >= 0) {
    result.valid = false;
    result.errors.push(
      `Discount "${itemName}" has invalid price: ${price}. Discounts must be negative.`
    );
  }

  // REFUND must be negative
  if (categoryId === 'REFUND' && price >= 0) {
    result.warnings.push(
      `Refund "${itemName}" has positive price: ${price}. Usually refunds are negative.`
    );
  }

  // TIP usually positive (but can be 0)
  if (categoryId === 'TIP' && price < 0) {
    result.warnings.push(
      `Tip "${itemName}" is negative: ${price}. This is unusual.`
    );
  }

  return result;
}

/**
 * Auto-correct special line item prices
 */
export function autoCorrectSpecialLinePrice(
  categoryId: string,
  price: number
): number {
  // Force DEPO_RET to negative
  if (categoryId === 'DEPO_RET' && price > 0) {
    return -Math.abs(price);
  }

  // Force DISC to negative
  if (categoryId === 'DISC' && price > 0) {
    return -Math.abs(price);
  }

  // Force REFUND to negative
  if (categoryId === 'REFUND' && price > 0) {
    return -Math.abs(price);
  }

  return price;
}
