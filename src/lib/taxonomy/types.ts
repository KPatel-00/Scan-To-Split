/**
 * Type-safe category codes and utilities
 */

/**
 * Top-level merchandise category codes
 */
export type MerchandiseCategoryCode =
  | 'GROC'  // Grocery & Food
  | 'ALCO'  // Alcoholic Beverages
  | 'TOBA'  // Tobacco & Smoking
  | 'DRUG'  // Drugstore / Personal Care
  | 'PHAR'  // Health & Pharmacy (OTC)
  | 'HOME'  // Household Supplies
  | 'PETS'  // Pet Supplies
  | 'DIYH'  // DIY / Hardware
  | 'FURN'  // Furniture & Home Living
  | 'ELEC'  // Consumer Electronics
  | 'APPL'  // Large Appliances
  | 'OFFI'  // Office & Stationery
  | 'BOOK'  // Books & Media
  | 'TOYS'  // Toys, Crafts & Hobbies
  | 'CLTH'  // Apparel & Accessories
  | 'SPOR'  // Sports & Outdoors
  | 'AUTO'  // Auto & Mobility
  | 'GARD'  // Garden, Plants & Flowers
  | 'REST'  // Restaurant & Foodservice
  | 'SERV'  // In-Store Services
  | 'TCOM'  // Telco & Digital
  | 'GIFT'  // Gift Cards & Stored Value
  | 'POST'  // Postage & Lottery
  | 'MISC'; // Miscellaneous

/**
 * Special line item codes
 */
export type SpecialLineCategoryCode =
  | 'TAX'       // Tax (VAT/Sales)
  | 'DEPO'      // Deposit
  | 'DEPO_RET'  // Deposit Return
  | 'DISC'      // Discount / Promotion
  | 'FEES'      // Fees & Surcharges
  | 'SHIP'      // Shipping / Delivery
  | 'TIP'       // Tip / Gratuity
  | 'ROUND'     // Rounding Adjustment
  | 'REFUND'    // Return / Refund
  | 'CASHBK'    // Cashback at Register
  | 'DONAT'     // Charitable Donation
  | 'PAYMT';    // Payment Method Lines

/**
 * All category codes
 */
export type CategoryCode = MerchandiseCategoryCode | SpecialLineCategoryCode;

/**
 * Grocery subcategory codes
 */
export type GrocerySubcategoryCode =
  | 'GROC.PRODUCE'       // Produce
  | 'GROC.MEAT'          // Meat & Poultry
  | 'GROC.SEAFOOD'       // Seafood
  | 'GROC.DAIRY'         // Dairy & Eggs
  | 'GROC.BAKERY'        // Bakery
  | 'GROC.PANTRY'        // Pantry
  | 'GROC.BREAKFAST'     // Breakfast & Cereal
  | 'GROC.SNACKS'        // Snacks
  | 'GROC.SWEETS'        // Confectionery
  | 'GROC.FROZEN'        // Frozen Foods
  | 'GROC.DELI'          // Ready-to-Eat/Delicatessen
  | 'GROC.BEVERAGES_NA'  // Beverages—Non-Alcoholic
  | 'GROC.SPECIALTY'     // International/Specialty
  | 'GROC.BABY'          // Baby Food
  | 'GROC.PET';          // Pet Food/Treats

/**
 * Category code constants for easy reference
 */
export const CATEGORY_CODES = {
  // Merchandise
  GROCERY: 'GROC' as const,
  ALCOHOL: 'ALCO' as const,
  TOBACCO: 'TOBA' as const,
  DRUGSTORE: 'DRUG' as const,
  PHARMACY: 'PHAR' as const,
  HOUSEHOLD: 'HOME' as const,
  PETS: 'PETS' as const,
  HARDWARE: 'DIYH' as const,
  FURNITURE: 'FURN' as const,
  ELECTRONICS: 'ELEC' as const,
  APPLIANCES: 'APPL' as const,
  OFFICE: 'OFFI' as const,
  BOOKS: 'BOOK' as const,
  TOYS: 'TOYS' as const,
  CLOTHING: 'CLTH' as const,
  SPORTS: 'SPOR' as const,
  AUTO: 'AUTO' as const,
  GARDEN: 'GARD' as const,
  RESTAURANT: 'REST' as const,
  SERVICES: 'SERV' as const,
  TELECOM: 'TCOM' as const,
  GIFT_CARDS: 'GIFT' as const,
  POST: 'POST' as const,
  MISC: 'MISC' as const,
  
  // Special Lines
  TAX: 'TAX' as const,
  DEPOSIT: 'DEPO' as const,
  DEPOSIT_RETURN: 'DEPO_RET' as const,
  DISCOUNT: 'DISC' as const,
  FEES: 'FEES' as const,
  SHIPPING: 'SHIP' as const,
  TIP: 'TIP' as const,
  ROUNDING: 'ROUND' as const,
  REFUND: 'REFUND' as const,
  CASHBACK: 'CASHBK' as const,
  DONATION: 'DONAT' as const,
  PAYMENT: 'PAYMT' as const,
} as const;

/**
 * Type guard: Check if category code is a special line
 */
export function isSpecialLineCode(code: string): code is SpecialLineCategoryCode {
  const specialCodes: SpecialLineCategoryCode[] = [
    'TAX', 'DEPO', 'DEPO_RET', 'DISC', 'FEES', 'SHIP',
    'TIP', 'ROUND', 'REFUND', 'CASHBK', 'DONAT', 'PAYMT',
  ];
  return specialCodes.includes(code as SpecialLineCategoryCode);
}

/**
 * Type guard: Check if category code is merchandise
 */
export function isMerchandiseCode(code: string): code is MerchandiseCategoryCode {
  return !isSpecialLineCode(code);
}

/**
 * Type guard: Check if category code is grocery
 */
export function isGroceryCode(code: string): boolean {
  return code === 'GROC' || code.startsWith('GROC.');
}

/**
 * Get category group for UI display
 */
export function getCategoryGroup(code: string): 'grocery' | 'retail' | 'service' | 'special' {
  if (isSpecialLineCode(code)) return 'special';
  if (isGroceryCode(code)) return 'grocery';
  if (['REST', 'SERV', 'TCOM'].includes(code)) return 'service';
  return 'retail';
}
