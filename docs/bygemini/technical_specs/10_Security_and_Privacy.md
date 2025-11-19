# 10. Security & Privacy Architecture

This document details the security measures, privacy protections, and rate-limiting strategies implemented to protect user data and prevent abuse.

## 1. PII Detection & Redaction (`src/lib/piiDetection.ts`)
**Objective:** Prevent sensitive personal data from being processed or stored.

*   **Pattern Matching:** Uses regex to detect:
    *   Credit Card Numbers (13-16 digits)
    *   Email Addresses
    *   Phone Numbers
    *   VAT IDs (European format)
    *   Social Security Numbers
*   **Redaction Strategy:**
    *   **Client-Side:** Detection runs in the browser *before* any data is sent to the AI.
    *   **Masking:** Detected patterns are replaced with `[REDACTED]` placeholders.
    *   **Confidence Levels:** Only high-confidence matches are automatically redacted to prevent false positives.

```typescript
// Example Pattern
const PATTERNS = {
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{1,4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // ...
};
```

## 2. Rate Limiting (`src/lib/rateLimit.ts`)
**Objective:** Prevent API abuse and manage costs for the free tier.

*   **Token-Based System:**
    *   Generates an anonymous UUID token stored in `localStorage`.
    *   Limits are applied per-token AND per-IP.
*   **Limits:**
    *   **Files per Hour:** 20 (Conservative limit for free tier).
    *   **Requests per Minute:** 10 (Burst protection).
*   **Implementation:**
    *   Currently uses an in-memory store (mock) for the prototype.
    *   Designed to be replaced with Redis in production.

## 3. Enhanced Settlement Logic (`src/lib/settlementEnhanced.ts`)
**Objective:** Handle complex financial scenarios beyond simple splitting.

*   **Special Line Handling:**
    *   **Tax (`TAX`):** Calculated separately for informational purposes.
    *   **Deposits (`DEPO`):** Tracked as a separate "pot" (Pfand).
    *   **Discounts (`DISC`):** Applied proportionally to the subtotal.
    *   **Tips (`TIP`):** Split equally among all participants.
*   **Calculation Flow:**
    1.  Separate regular items from special lines.
    2.  Calculate subtotal from regular items.
    3.  Apply proportional discounts.
    4.  Add fixed fees/tips.
    5.  Calculate final "Grand Total" for settlement.

## 4. Category Editor (`src/components/CategoryEditorPopover.tsx`)
**Objective:** Allow users to correct or refine AI categorization.

*   **UI:** A searchable, accordion-based popover.
*   **Data Source:** Pulls directly from the `taxonomy` system.
*   **Search:** Real-time filtering of categories by name (EN/DE) and keywords.
*   **Interaction:**
    *   Clicking a category updates the item immediately.
    *   "Remove Category" option for uncategorized items.
