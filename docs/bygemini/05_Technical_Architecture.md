# 05. Technical Architecture (Simplified)

This document explains the "under the hood" technology that powers ScanToSplit.ai, written for a non-technical audience to understand the robustness of the solution.

---

## 1. The Tech Stack
*   **Framework:** **React 18** (The industry standard for interactive web apps).
*   **Language:** **TypeScript** (Ensures code reliability and fewer bugs).
*   **Build Tool:** **Vite** (Ensures lightning-fast load times).
*   **State Management:** **Zustand** (Efficiently manages the complex data of bills, items, and users).
*   **Styling:** **Tailwind CSS** (Allows for rapid, custom design implementation).

## 2. Performance Architecture
We have engineered the app to be fast, even on slower mobile networks.

*   **Code Splitting:** We don't force the user to download the whole app at once.
    *   When you visit the Landing Page, you *only* download the Landing Page code.
    *   The "AI Scanner" code is only downloaded when you actually click "Scan."
    *   The "PDF Generator" code is only downloaded when you click "Export."
*   **Result:** The initial load is tiny (~200kB), making the app feel instant.

## 3. Data Persistence (The "Save" Feature)
*   **Mechanism:** We use the browser's `localStorage`.
*   **Benefit:**
    *   **Privacy:** Data lives on the user's device, not our servers.
    *   **Resilience:** If the user accidentally closes the tab or their phone battery dies, they can reopen the app and pick up exactly where they left off.
    *   **Hydration:** We use a "Hydration" check to ensure the data is fully loaded before showing the screen, preventing any "glitches" or flickering.
    *   **Session Recovery:** The app detects existing data on load and triggers the "Welcome Back" flow if a session was left incomplete.

## 4. Security & Safety
*   **XSS Prevention:** We assume all input is dangerous. Every item name, price, and participant name is "sanitized" (scrubbed of malicious code) before it is stored.
*   **Frozen Dependencies:** We lock our software libraries to specific versions. This prevents "supply chain attacks" where a malicious update to a third-party tool could compromise our app.

## 5. Scalability
The architecture is modular.
*   **Feature-Based Folders:** The code for "Scanning" is separate from "Assignment." This means we can upgrade the Scanner (e.g., to use a newer AI model) without risking breaking the Assignment feature.
*   **Taxonomy System:** We have a centralized list of categories (`src/lib/taxonomy`). Adding a new category like "Electronics" is as simple as adding one line of code, and it instantly propagates across the entire app.

---
**End of Report**
