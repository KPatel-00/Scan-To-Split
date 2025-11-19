# 02. Core Features & Functionalities

This document details the functional pillars of ScanToSplit.ai, based on the actual production implementation.

---

## 1. 🧠 AI-Powered Receipt Scanning (The "Magic")
At the heart of the application is the integration with **Google Gemini 1.5 Flash**. This is not simple OCR (Optical Character Recognition); it is intelligent understanding.

*   **How it works:**
    1.  User uploads or snaps a photo of a receipt.
    2.  The image is compressed locally (using `browser-image-compression`) to ensure fast uploads.
    3.  Gemini AI analyzes the image, extracting:
        *   Store Name & Date.
        *   Line Items (Name, Quantity, Price).
        *   **Taxonomy Codes:** It automatically categorizes items (e.g., `ALCO.BEER`, `GROC.DAIRY`) using our proprietary taxonomy system.
    *   **Sanitization:** All AI output is passed through a strict XSS sanitization layer (`DOMPurify`) before ever reaching the application state.

### B. Advanced Manual Entry (The "Power User" Tool)
For users who prefer typing or have handwritten receipts, we offer a smart text parser.
*   **Smart Parsing:** Users can paste a block of text, and our regex engine intelligently parses it.
*   **Supported Formats:**
    *   `Item Name 3.45` (Standard)
    *   `2x Milk 1.20` (Quantity handling)
    *   `Pfand -0.25` (Negative amounts/Refunds)
*   **Benefit:** Allows for rapid entry of complex lists without clicking individual fields.

## 2. 🔀 Dual-Mode Management Architecture
The application supports two distinct mental models for bill splitting, handled via the `managementMode` state in our Zustand store.

### A. Merged Mode ("The Dinner Party")
*   **Use Case:** A single event with one or more receipts that should be treated as one big bill.
*   **Functionality:**
    *   Scans multiple receipts but flattens them into a single `items` list.
    *   One "Payer" covers the whole bill.
    *   Tax and Tip are applied globally.
    *   **UI:** A unified list where users can see everything at once.

### B. Separate Mode ("The Weekend Trip")
*   **Use Case:** Multiple distinct events (e.g., Friday Dinner, Saturday Brunch, Taxi).
*   **Functionality:**
    *   Keeps receipts in separate tabs/accordions.
    *   **Per-Receipt Payers:** "Alice paid for Dinner," "Bob paid for the Taxi."
    *   **Per-Receipt Modifiers:** Tax and Tip are calculated individually for each receipt.
    *   **UI:** A "Collapsible Bill Accordion" that allows users to focus on one bill at a time while maintaining a global summary.

### C. The "Multi-Bill Choice" Modal
When the AI detects multiple receipts in a single upload, the app intelligently asks the user for their preference:
*   **"Merge All Items":** Combines everything into one list (Merged Mode).
*   **"Manage Separately":** Creates distinct tabs for each receipt (Separate Mode).
*   This decision point is critical for handling complex trips vs. simple large dinners.

## 3. 👥 Interactive Item Assignment
We replaced dropdown menus with a tactile "Paint" interface.

*   **The Palette:** Users select a participant (or multiple) from a sticky "Participant Palette" at the top of the screen.
*   **The Action:** They simply tap items in the list to assign them.
*   **Visual Feedback:**
    *   **Avatars:** The item row populates with the avatars of the assigned users.
    *   **Split Logic:** If 3 people are assigned to a $15 item, the app automatically calculates $5 each.
    *   **Animations:** Avatars "pop" in with a spring animation (`gentleLand` physics).

## 4. 🧠 Proactive Intelligence (Habit Recognition)
The app learns from your behavior to speed up future interactions.
*   **Smart Group Loading:** The app remembers your frequent groups (e.g., "Roommates," "Friday Poker Crew"). With one tap, you can reload a previous set of participants.
*   **Split Memory:** If you always split the "Shared Appetizer" with the same 3 people, the app remembers this pattern. A "Suggested Split" button appears, allowing you to replicate complex assignments instantly.

## 5. 🛡️ Privacy & Security Features
*   **Local-First Storage:** User data (bills, participants, habits) is stored in the browser's `localStorage`. We do not store personal financial data on our servers.
*   **Input Sanitization:** A rigorous `sanitizeInput()` function wraps every single data entry point, protecting users from malicious code injection (XSS) that could be hidden in receipt text.
*   **PII Redaction:** The AI is instructed to ignore sensitive fields like credit card numbers during the scan.

## 6. 📊 Analytics & Insights
The application doesn't just split bills; it helps users understand their spending.
*   **Visual Dashboard:** A dedicated `/analytics` route provides charts and graphs.
*   **Category Breakdown:** Shows spending by taxonomy category (e.g., "30% on Alcohol", "50% on Food").
*   **Savings Tracker:** Calculates how much was saved via discounts/coupons.
*   **Top Categories:** Identifies the most frequent spending areas.

## 7. 🎮 Sensory Feedback System
To create a "premium" feel, the app engages multiple senses, not just sight.
*   **Sound Design:** A custom `SoundManager` (Web Audio API) generates non-intrusive sounds for:
    *   **Clicks:** Subtle mechanical ticks.
    *   **Success:** A gentle chime when actions complete.
    *   **Errors:** A soft warning tone.
*   **Haptic Feedback:** The `triggerHaptic` utility uses the Vibration API on mobile devices to provide physical confirmation for:
    *   **Taps:** Light vibration (10ms) for buttons.
    *   **Success:** Double pulse for completed tasks.
    *   **Errors:** Heavy vibration (40ms) for warnings.

## 8. 🎓 Onboarding & Guidance
*   **Interactive Tours:** Powered by `driver.js`, the app offers step-by-step walkthroughs for:
    *   **Setup:** How to scan and add people.
    *   **Assignment:** How to tap-to-assign.
    *   **Summary:** How to export and settle.
*   **Contextual Help:** A global `HelpButton` provides instant access to these tours at any time.

## 13. 🧮 Advanced Custom Splitting
*   **Granular Control:** Users can split any item unequally using the "Custom Split" popover.
*   **Three Modes:**
    *   **Split by Shares:** "Alice ate 2 slices, Bob ate 1" (2:1 ratio).
    *   **Split by %:** "Alice pays 60%, Bob pays 40%".
    *   **Split by Amount:** "Alice pays $10, Bob pays the rest".
    *   **Validation:** Real-time math checks ensure splits add up to 100% or the full price.

## 14. 💎 Polish & Quality Assurance
*   **Internationalization (i18n):** Full multi-language support (English, German, Hindi, Spanish) with auto-detection.
*   **Theme System:** Advanced Dark/Light mode using the View Transitions API for cinema-quality switching effects.
*   **Premium Error Handling:** No "white screens of death." A custom `ErrorBoundary` provides a witty, helpful fallback UI if the app crashes.
*   **Offline Resilience:** The app works offline (except for AI scanning) thanks to robust `zustand` persistence.
*   **Verification Card:** A dedicated UI component that compares the "Scanned Total" vs. the "Calculated Total" to ensure 100% accuracy before splitting.

## 15. 🧠 The "Brain" & Assets
*   **AI Prompt Engineering:** The exact instructions used to guide Google Gemini are documented in `technical_specs/13_AI_Prompt_and_Taxonomy.md`. This includes the strict rules for German receipts (Pfand, MwSt).
*   **Taxonomy System:** The complete JSON structure for item categorization is also preserved in Spec #13.
*   **Lottie Animations:** The source JSON for the "Hero Scan Receipt" animation is preserved in `technical_specs/14_Assets_and_Animations.md`.

## 16. ⚙️ Core Algorithms (The "Black Box")
*   **Settlement Engine:** The exact math for handling German-specific splits (Proportional Discounts, Equal Tips, Pfand Separation) is documented in `technical_specs/15_Core_Algorithms.md`.
*   **PDF Pipeline:** The architecture for generating reports (Generators, Layouts) is also detailed there.
*   **Storage Health:** The logic for preventing data loss and managing the 5MB localStorage limit.

## 3. Technical Differentiators

## 15. 💰 Enhanced Settlement Engine
*   **Special Line Logic:** The `settlementEnhanced.ts` module handles complex financial scenarios:
    *   **Pfand (Deposits):** Tracked separately from the main bill.
    *   **Discounts:** Applied proportionally to the subtotal.
    *   **Tips/Fees:** Split equally among all participants.

## 16. 🏷️ Taxonomy Management
*   **Category Editor:** A dedicated `CategoryEditorPopover` allows users to correct AI mistakes.
*   **Searchable Taxonomy:** Users can search the full 24-category tree to find the right match.

---
*Next: The User Experience & Design System.*
