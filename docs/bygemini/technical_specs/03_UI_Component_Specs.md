# 03. UI Component Specifications

This document details the "Premium" component library.

## 1. PremiumItemCard
The core component for displaying items in the setup list.

*   **Path:** `src/features/setup/components/PremiumItemCard.tsx`
*   **Props:**
    *   `item`: The `Item` object.
    *   `receiptId?`: Optional ID if in Separate Mode.
    *   `showOriginBadge?`: Boolean to show "Bill 1" badge.
*   **Visuals:**
    *   **Background:** `bg-card/50 backdrop-blur-sm` (Glassmorphism).
    *   **Border:** `border-border/40`.
    *   **Hover:** `hover:shadow-md hover:border-border/60`.
    *   **Negative Price:** Tinted red (`bg-red-50/50`) with red border.
*   **Interactions:**
    *   Clicking the icon opens the `CategoryEditorPopover`.
    *   Clicking the name/price turns it into an input field.

## 2. PremiumSectionHeader
A reusable header for sections (Items, Participants).

*   **Path:** `src/features/setup/components/PremiumSectionHeader.tsx`
*   **Props:**
    *   `title`: String.
    *   `icon`: Lucide Icon component.
    *   `count?`: Number (displayed in a badge).
    *   `variant`: `'default' | 'success' | 'info' | 'warning'`.
*   **Variants:**
    *   **Default:** Primary color accents.
    *   **Success:** Green accents (used for Discounts).
    *   **Info:** Blue accents.
    *   **Warning:** Orange accents.

## 3. UploadDropzone
The drag-and-drop area for receipts.

*   **Path:** `src/features/setup/components/UploadDropzone.tsx`
*   **States:**
    *   **Idle:** Dashed border, "Drag & Drop" text.
    *   **DragOver:** Solid primary border, background highlight.
    *   **Uploading:** Progress bar.
    *   **Processing:** "Scanner" animation (glowing bar).
*   **Animation:** Uses `AnimatePresence` to transition between states smoothly.

## 4. Typography System
Strictly enforced via `src/lib/typography.ts`.

*   **Display:** `text-4xl font-bold tracking-tight` (Hero).
*   **H1:** `text-3xl font-bold tracking-tight`.
*   **H2:** `text-2xl font-semibold tracking-tight`.
*   **H3:** `text-xl font-semibold tracking-tight`.
*   **Body:** `text-base leading-7`.
*   **Small:** `text-sm font-medium leading-none`.

## 5. ManualEntryBox
The smart text parser for manual input.

*   **Path:** `src/features/setup/components/ManualEntryBox.tsx`
*   **Features:**
    *   **Regex Parsing:** Detects `Name Price`, `Quantity x Name Price`, and `Name -Price`.
    *   **Tooltip:** Shows supported formats on hover.
    *   **Feedback:** Triggers `feedback.success()` on parse.

## 6. FilePreviewList
The intermediate state before AI scanning.

*   **Path:** `src/features/setup/components/FilePreviewList.tsx`
*   **Props:**
    *   `files`: Array of File objects.
    *   `previews`: Array of object URLs (thumbnails).
*   **Interactions:**
    *   **Remove:** Individual 'X' button per file.
    *   **Summary:** Shows total file count and size (e.g., "2 receipts • 4.5 MB").
    *   **Animation:** `AnimatePresence` handles smooth removal of items.

## 7. PremiumCTA
The "Hero" button component with advanced motion physics and shimmer effects.

*   **Path:** `src/components/ui/premium-cta.tsx`
*   **Props:**
    *   `href`: Navigation URL.
    *   `icon`: Lucide Icon.
    *   `variant`: `'default' | 'secondary' | 'outline'`.
    *   `shimmerSpeed`: `'slow' | 'normal' | 'fast'`.
*   **Features:**
    *   **Physics:** Scale 1.03 on hover, 0.95 on tap.
    *   **Shimmer:** CSS gradient animation sweeping across the button.
    *   **Pulse:** Icon pulses every 1.2s (unless disabled).
    *   **Accessibility:** Respects `prefers-reduced-motion`.

## 8. ChapterBadge
Reusable badge component for landing page chapters.

*   **Path:** `src/features/landing-page/components/ChapterBadge.tsx`
*   **Props:**
    *   `icon`: Lucide Icon.
    *   `text`: String.
    *   `variant`: `'primary' | 'inverse' | 'solid'`.
    *   `size`: `'sm' | 'md' | 'lg'`.
*   **Visuals:**
    *   **Primary:** `bg-primary/10 text-primary`.
    *   **Inverse:** `bg-background/10 text-background`.
    *   **Solid:** `bg-primary text-primary-foreground`.
*   **Animation:** Fades in and slides down on view (`whileInView`).
