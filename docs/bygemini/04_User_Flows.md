# 04. User Flows & Navigation

This document outlines the user journey through the application, highlighting the frictionless navigation and logical progression.

---

## 1. The Navigation Philosophy
*   **Linear Progression:** The app follows a clear 3-step wizard: **Setup → Assignment → Summary**.
*   **Lossless Navigation:** Users can move backward and forward (e.g., go back to add a forgotten item) without losing any data. State is persisted globally.
*   **Lazy Loading:** Each step is a separate code chunk. The "Summary" code isn't even downloaded until the user finishes the "Assignment" step, keeping the app fast.

## 2. Step-by-Step Walkthrough

### Step 0: The Landing Page (`/`)
*   **Goal:** Trust & Conversion.
*   **Experience:**
    *   Hero section with a "Get Started" CTA.
    *   "Try a Demo" button that instantly populates the store with sample data, allowing users to test the app in seconds without uploading a file.
    *   Features and USP sections animate in as the user scrolls.
*   **Session Re-hydration ("Welcome Back"):**
    *   If a user returns with an active session, a **"Welcome Back" Modal** appears immediately.
    *   **Option 1:** "Continue Session" (Restores previous state).
    *   **Option 2:** "Start New Bill" (Clears state and starts fresh).

### Step 1: Setup (`/setup`)
*   **Goal:** Input Data (Bill & People).
*   **Workflow:**
    1.  **Upload:** User drags & drops up to 3 receipt images.
    2.  **Pre-Scan Review:** User sees thumbnails of uploaded files with file sizes. They can remove accidental uploads or add more before committing.
    3.  **AI Processing:** The "Scanner" animation plays. The AI extracts items.
    4.  **Review:** The user sees the extracted items in the "Items List."
        *   *Smart Feature:* If multiple receipts are found, the **"Multi-Bill Choice Modal"** appears: "Merge these or keep them separate?"
    5.  **Participants:** User adds friends to the "Participants" list.
        *   *Smart Feature:* "Load Group" allows users to instantly recall their "Roommates" or "Travel Crew" from previous sessions.

### Step 2: Assignment (`/assignment`)
*   **Goal:** Who had what?
*   **Workflow:**
    1.  **Select:** User taps "Alice" in the top palette.
    2.  **Assign:** User taps the "Burger," "Fries," and "Coke." Alice's avatar appears on those rows.
    3.  **Split:** User taps "Bob" (while Alice is still selected) and taps the "Shared Appetizer." The app splits the cost 50/50.
        *   *Smart Feature:* **Habit Recognition** suggests: "You usually split 'Nachos' with Bob. Do it again?"
    4.  **Review:** A progress bar shows how much of the bill has been assigned.

### Step 3: Summary (`/summary`)
*   **Goal:** Settlement & Celebration.
*   **Experience:**
    1.  **Celebration:** A confetti burst triggers upon arrival.
    2.  **Breakdown:**
        *   **Grand Total:** The final number.
        *   **Individual Cards:** "Alice owes $25.50," "Bob owes $18.00."
    3.  **Action:**
        *   **"Share Image":** Generates a PNG for the group chat.
        *   **"Download PDF":** Generates a formal report.

## 3. Edge Cases & Error Handling
*   **Offline:** If the user loses internet, the app continues to work (except for new AI scans). Data is saved locally.
*   **Migration:** If we update the data structure, a `MigrationBanner` and background utilities automatically upgrade the user's old data to the new format without data loss.
*   **Empty States:** No screen is ever blank. If a list is empty, we show a helpful illustration and a button to fix it (e.g., "No items? Add one manually.").

---
*Next: Technical Architecture.*
