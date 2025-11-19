# 05. AI Pipeline Specifications

This document details the AI-powered receipt scanning system, which uses Google's Gemini 1.5 Flash model to extract structured data from receipt images.

## 1. Architecture Overview

The AI pipeline is a **client-side only** implementation. It communicates directly with the Google Gemini API from the browser, eliminating the need for a backend proxy.

**Key Features:**
- **Model:** Gemini 1.5 Flash (optimized for speed and cost).
- **Lazy Loading:** The `@google/generative-ai` library is only loaded when the user initiates a scan.
- **Sanitization:** All AI output is strictly sanitized before entering the application state.
- **Taxonomy:** Enforces a strict category system (GROC, ALCO, etc.).

## 2. Implementation (`src/lib/scanReceiptsClient.ts`)

### Lazy Loading Pattern
To keep the initial bundle size small, the heavy AI library is imported dynamically.

```typescript
// Only loads when user scans receipts
const { GoogleGenerativeAI } = await import('@google/generative-ai');
const genAI = new GoogleGenerativeAI(apiKey);
```

### Prompt Engineering (Prompt 9)
The system uses a highly specific prompt to ensure consistent JSON output.

**Key Prompt Sections:**
1.  **Role Definition:** "Meticulous financial assistant specializing in European and German receipts."
2.  **Categorization Rules:** Explicit mapping of items to IDs (e.g., "Milk" -> `GROC.DAIRY`).
3.  **Special Line Detection:** Rules for `TAX`, `DEPO` (Pfand), `DISC` (Discounts).
4.  **Output Format:** Strict JSON schema enforcement.

### Taxonomy System
The AI is instructed to map items to specific Category IDs defined in `src/lib/taxonomy/`.

| Category ID | Description | Icon |
| :--- | :--- | :--- |
| `GROC.PRODUCE` | Fruits & Vegetables | Apple |
| `GROC.DAIRY` | Milk, Cheese, Eggs | Milk |
| `GROC.MEAT` | Meat & Poultry | Drumstick |
| `ALCO` | Alcohol | Wine |
| `DEPO` | Deposit (Pfand) | Recycle |
| `DEPO_RET` | Deposit Return | Undo2 |
| `DISC` | Discounts | BadgePercent |

## 3. Data Interfaces

### Input
Array of `File` objects (images) uploaded by the user.

### Output (`ScanResult`)
```typescript
interface ScanResult {
  success: boolean;
  receipts?: ScannedReceipt[];
  error?: string;
  message?: string; // User-friendly error message
}

interface ScannedReceipt {
  storeName: string;
  date: string;
  items: ScannedItem[];
  // ...
}
```

## 4. Error Handling
The system handles specific failure scenarios with user-friendly messages:

- **`AI_NOT_CONFIGURED`**: Missing API key.
- **`NO_FILES`**: User didn't select an image.
- **`TOO_MANY_FILES`**: >3 images selected.
- **API Failures**: Network issues or invalid responses.

## 5. Security & Sanitization
**CRITICAL:** All data returned by the AI is treated as untrusted user input.
Before being added to the Zustand store, every string is passed through `sanitizeInput()` (DOMPurify).

```typescript
// In the store action (itemsSlice.ts)
addItem({
  name: sanitizeInput(aiResult.name),
  price: Number(aiResult.price),
  // ...
});
```

