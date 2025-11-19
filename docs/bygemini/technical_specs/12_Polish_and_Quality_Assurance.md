# 12. Polish & Quality Assurance Features

This document details the "invisible" features that elevate **ScanToSplit.ai** from a functional app to a premium product. These include onboarding tours, sensory feedback, error handling, and internationalization.

---

## 1. Onboarding & Interactive Tours
We use **Driver.js** to provide context-aware, step-by-step guides for first-time users.

### Architecture
*   **Library:** `driver.js` (v1.3.1)
*   **Definition File:** `src/lib/tours.ts`
*   **Persistence:** `localStorage` keys (`tour-setup-completed`, `tour-assignment-completed`, etc.) prevent tours from annoying returning users.

### Tour Flows
1.  **Setup Tour (`setupTour`)**:
    *   **Trigger:** First visit to `/setup` or clicking "Help".
    *   **Steps:**
        1.  **Upload Area:** "Drag & drop receipts here."
        2.  **Manual Entry:** "Or type items manually."
        3.  **Verification Card:** "Check the calculated total here."
2.  **Assignment Tour (`assignmentTour`)**:
    *   **Trigger:** First visit to `/assignment`.
    *   **Steps:**
        1.  **Participant Selector:** "Select a person first."
        2.  **Item Row:** "Tap items to assign them."
        3.  **Split Actions:** "Long press for custom splits."
3.  **Summary Tour (`summaryTour`)**:
    *   **Trigger:** First visit to `/summary`.
    *   **Steps:**
        1.  **Total Card:** "Final breakdown."
        2.  **Export Actions:** "Share image or PDF."

---

## 2. Sensory Feedback System
The app engages multiple senses to confirm actions and build muscle memory.

### A. Haptics (Tactile)
*   **Library:** `Navigator.vibrate()` API (via `src/lib/haptics.ts`)
*   **Patterns:**
    *   `selection`: 10ms (Light tap for buttons)
    *   `success`: [10, 30, 10] (Double tap for completion)
    *   `error`: [50, 30, 50, 30, 50] (Rumble for warnings)
*   **User Control:** Toggleable in `FeedbackSettings.tsx`.

### B. Sound (Auditory)
*   **Implementation:** Web Audio API (via `src/lib/feedback.ts`) - No external assets to load.
*   **Synthesized Sounds:**
    *   **Success:** Sine wave chord (C5-E5).
    *   **Error:** Sawtooth wave descending.
    *   **Click:** High-frequency blip.
*   **User Control:** Toggleable in `FeedbackSettings.tsx`.

---

## 3. Premium Error Handling
We never show a white screen of death.

### Error Boundary
*   **Component:** `src/components/ErrorBoundary.tsx`
*   **Library:** `react-error-boundary`
*   **UI:** A "Premium Error Fallback" card that:
    *   Animates in gently (`gentleNormal` physics).
    *   Provides a "Try Again" button (resets state).
    *   Provides a "Go Home" button (hard navigation).
    *   Displays a witty/reassuring message (e.g., "Even AI needs a coffee break").

### Toast Notifications
*   **Library:** `sonner` (via `src/components/ui/sonner.tsx`)
*   **Usage:**
    *   **Success:** Green checkmark, "Item added."
    *   **Error:** Red alert, "Scan failed. Try again."
    *   **Undo:** "Item deleted. [Undo]" (persists for 5s).

---

## 4. Internationalization (i18n)
The app is built for a global audience from day one.

### Architecture
*   **Library:** `i18next` + `react-i18next`
*   **Configuration:** `src/lib/i18n/index.ts`
*   **Detection:** Automatically detects browser language.
*   **Storage:** Persists language preference in `localStorage`.

### Supported Locales
*   **English (en):** Default.
*   **German (de):** Fully translated (critical for "Pfand" logic).
*   **Hindi (hi):** Supported for currency formatting.
*   **Spanish (es):** Supported.

---

## 5. Theme System & View Transitions
We support Light, Dark, and System themes with cinema-quality transitions.

### Implementation
*   **Provider:** `src/providers.tsx`
*   **Storage:** `zustand` store (`theme` slice).
*   **View Transitions API:**
    *   When toggling themes, we use `document.startViewTransition()`.
    *   This creates a smooth "wipe" effect rather than a jarring instant switch.
    *   **Fallback:** Gracefully degrades to standard CSS class switching on older browsers.

---

## 6. Offline Capability & Persistence
While not a full PWA (yet), the app is robust against network loss.

### State Persistence
*   **Mechanism:** `zustand` middleware (`persist`).
*   **Storage:** `localStorage`.
*   **Behavior:**
    *   **Items/Participants:** Saved instantly on change.
    *   **Session Recovery:** If a user closes the tab and returns, `ReturningUserBanner` detects the saved state and offers to "Continue Session".
    *   **Offline Usage:** Users can manually add items, assign splits, and view summaries without an internet connection. Only the *AI Scanning* feature requires a network.

---

## 7. Verification & Trust
Features designed specifically to build user trust in the AI.

### Verification Card
*   **Location:** `src/features/setup/components/VerificationCard.tsx` (or integrated into `BillDetails`).
*   **Function:** Displays the "Calculated Total" (sum of all items) vs. "Receipt Total" (scanned from OCR).
*   **Logic:** If they match, shows a Green Check. If they differ, shows a Yellow Warning, prompting the user to check for missing items.

### PII Redaction
*   **Location:** `src/lib/piiDetection.ts`
*   **Logic:** Client-side Regex scans for credit card patterns (13-16 digits) *before* upload.
*   **UI:** Draws black boxes over sensitive data on the canvas before sending to Gemini.
