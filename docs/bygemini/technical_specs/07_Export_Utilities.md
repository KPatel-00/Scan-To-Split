# 07. Export Utilities Specifications

This document details the export functionality for generating PDF reports and shareable social media images.

## 1. PDF Export (`src/lib/pdf/exportPDF.ts`)

The PDF export engine generates a professional, clean settlement report.

### Architecture
- **Library:** `jspdf` (Lazy loaded).
- **Strategy:** Programmatic generation (drawing text/lines) rather than HTML-to-Canvas, ensuring high-quality vector text and small file sizes.
- **Lazy Loading:** The `jspdf` library is ~350KB, so it is only loaded when the user clicks "Download PDF".

```typescript
// Lazy load pattern
const { default: jsPDF } = await import('jspdf');
```

### Report Structure
1.  **Header:** App branding, date, and "Settlement Report" title.
2.  **Summary:** Grand total, tip, tax, and active participants.
3.  **Settlement Plan:** Who owes whom (minimized transaction list).
4.  **Item Details:** Complete list of items, prices, and assignments.
5.  **Footer:** Page numbers and timestamp.

## 2. Shareable Image (`src/lib/shareableImage.ts`)

Generates a 1200x630px (Open Graph size) image for social sharing.

### Architecture
- **Library:** `html-to-image` (Lazy loaded).
- **Strategy:** Renders a hidden React component (`ShareableImageCard`) to the DOM, captures it as a PNG, and then removes it.
- **Sharing:** Uses the Web Share API (`navigator.share`) on mobile devices, falls back to file download on desktop.

### Implementation Details
- **Component:** `src/features/summary/ShareableImageCard.tsx`
- **Styling:** Uses a specific "Premium" dark theme with gradients and glassmorphism, independent of the user's current theme.
- **Quality:** Renders at 2x pixel ratio for crisp text on Retina displays.

```typescript
// Lazy load pattern
const { toPng } = await import('html-to-image');
```

## 3. Performance Considerations
Both export utilities are heavy dependencies. They are configured as `manualChunks` in `vite.config.ts` to ensure they are split into separate files and not included in the main entry bundle.

```typescript
// vite.config.ts
manualChunks: {
  'pdf-export': ['jspdf'],
  'image-export': ['html-to-image', 'html2canvas'],
  // ...
}
```
