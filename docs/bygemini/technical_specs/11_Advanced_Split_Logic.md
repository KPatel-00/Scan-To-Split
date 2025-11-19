# 11. Advanced Split Logic

This document details the complex splitting algorithms used in the "Custom Split" feature, allowing for granular control over item assignment.

## 1. The Custom Split Popover (`src/components/custom-split/`)
**Objective:** Allow users to split a single item unequally among participants.

*   **Modes:**
    *   **Amount (`€`):** User types exact amounts (e.g., Alice pays €5.00, Bob pays €2.50).
    *   **Percentage (`%`):** User types percentages (e.g., Alice pays 60%, Bob pays 40%).
    *   **Shares (`1:2`):** User types shares (e.g., Alice eats 2 slices, Bob eats 1 slice).

## 2. Real-Time Validation (`useCustomSplit.ts`)
**Objective:** Ensure the split always adds up to the item's total price.

*   **Mechanism:**
    *   Uses `react-hook-form` to watch all input fields simultaneously.
    *   Calculates a `liveTotal` on every keystroke.
    *   **Visual Feedback:**
        *   **Green:** `liveTotal === itemTotal` (Valid)
        *   **Red:** `liveTotal !== itemTotal` (Invalid)
    *   **Guard:** The "Done" button is disabled until the split is valid (within a small epsilon for rounding).

## 3. Calculation Logic (`splitCalculations.ts`)
**Objective:** Handle the math for converting between modes.

*   **Shares Logic:**
    *   `Total Shares = Sum(All Participant Shares)`
    *   `Participant Cost = (Participant Share / Total Shares) * Item Price`
*   **Percentage Logic:**
    *   `Participant Cost = (Participant % / 100) * Item Price`
*   **Mode Switching:**
    *   When switching *to* Shares, defaults to `1` share per person.
    *   When switching *to* Amount/Percentage, calculates the current value based on the previous mode to preserve the user's intent.

## 4. Data Persistence
*   **Storage:** Custom splits are stored in the `item.assignments` field in the Zustand store.
*   **Structure:** `Record<participantId, amount>` (Always stored as absolute amounts for consistency).
