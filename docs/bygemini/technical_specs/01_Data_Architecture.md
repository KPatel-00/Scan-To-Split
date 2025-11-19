# 01. Data Architecture & Models

This document defines the core data structures used in ScanToSplit.ai. These interfaces are the "source of truth" for the application state.

## 1. Core Entities

### Item
The fundamental unit of the application. Represents a single line item from a receipt.

```typescript
export interface Item {
  /** Unique identifier (e.g., "item-1731928374-0.123") */
  id: string;
  
  /** Name of the item (sanitized) */
  name: string;
  
  /** Quantity (default: 1) */
  quantity: number;
  
  /** Price per unit (can be negative for discounts) */
  price: number;
  
  /** Full category object with taxonomy data */
  category: Category;
  
  /** ID of the receipt this item belongs to (if in Merged Mode) */
  originReceiptId?: string;
  
  /** 
   * Custom split assignments.
   * Key: participantId, Value: amount assigned
   * Used for complex splits (e.g., "Alice pays $5, Bob pays $10")
   */
  assignments?: Record<string, number>;
  
  /** 
   * Simple assignments.
   * Array of participant IDs who share this item equally.
   */
  assignedTo?: string[];
}
```

### Receipt
Represents a scanned or manually entered bill.

```typescript
export interface Receipt {
  /** Unique identifier */
  id: string;
  
  /** Store name (e.g., "ALDI SÜD") */
  storeName: string;
  
  /** Date string (ISO format YYYY-MM-DD) */
  date: string;
  
  /** List of items belonging to this receipt */
  items: Item[];
  
  /** ID of the participant who paid for this receipt (Separate Mode) */
  paidBy: string | null;
  
  /** Additive tax amount */
  tax: number;
  
  /** Additive tip amount */
  tip: number;
  
  /** Total amount scanned from the receipt (for verification) */
  total?: number;
}
```

### Participant
A person involved in the bill split.

```typescript
export interface Participant {
  /** Unique identifier */
  id: string;
  
  /** Display name (sanitized) */
  name: string;
  
  /** Avatar background color (hex or tailwind class) */
  color: string;
}
```

## 2. Taxonomy System
The categorization engine.

```typescript
export interface Category {
  /** Unique ID (e.g., "GROC.DAIRY") */
  id: string;
  
  /** Top-level code (e.g., "GROC") */
  code: string;
  
  /** Display names */
  name_en: string;
  name_de: string;
  
  /** Lucide icon name */
  icon: string;
  
  /** True if this is a tax, tip, or fee */
  isSpecialLine?: boolean;
  
  /** Parent ID for hierarchy */
  parentId?: string;
}
```

## 3. Global Settings

```typescript
export interface Currency {
  symbol: string; // e.g., "€"
  code: string;   // e.g., "EUR"
}

export interface SavedGroup {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: number;
}
```
