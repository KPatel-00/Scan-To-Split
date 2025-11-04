I'll analyze the Setup page comprehensively - examining its structure, related files, hooks, utilities, and their purposes. 

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/pages/Setup.tsx)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/hooks)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/hooks/useFileUpload.ts#1-1), lines 1 to 100

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/hooks/useFileUpload.ts#100-100), lines 100 to 246

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/BillDetailsSection.tsx#1-1), lines 1 to 150

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/ItemsManagementSection.tsx)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/ParticipantsSection.tsx)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/components)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/hooks)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/utils)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/hooks/useParticipantForm.ts)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/hooks/useGroupManagement.ts)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/participants/hooks/useHabitRecognition.ts)

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/AIScanAnimation.tsx#1-1), lines 1 to 100

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/PIIRedactionModal.tsx#1-1), lines 1 to 100

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/features/setup/MultiBillModal.tsx#1-1), lines 1 to 100

Now let me check some of the key library files used in Setup: 

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/lib/piiDetection.ts#1-1), lines 1 to 80

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/lib/scanReceiptsClient.ts#1-1), lines 1 to 80

Read [](file:///c%3A/Users/Lenovo/Downloads/Splitter_React_Vite/src/lib/feedback.ts#1-1), lines 1 to 60

Perfect! Now let me create a comprehensive analysis document for you:

## 📋 Setup Page - Complete Analysis

### **Main File: Setup.tsx** (182 lines)

**Purpose**: Main entry point for bill setup workflow. Orchestrates 3 core sections: Bill Details, Items Management, and Participants.

**Key Responsibilities**:
1. **Hydration Guard** - Uses `useHydration()` to prevent SSR mismatch with localStorage
2. **Progress Tracking** - Sticky `ProgressStepper` component shows user position in flow
3. **Navigation Logic** - Validates participants & items before allowing "Next" to Assignment page
4. **AI Scanning State** - Displays `AIScanAnimation` overlay during receipt processing
5. **Modal Orchestration** - Manages PII redaction and multi-bill modals

**State Management** (All from Zustand):
- `participants`, `items`, `receipts` (domain data)
- `managementMode` (merged vs separate bills)
- `isScanning`, `scanFileCount` (scanning state from `scanningSlice`)

**Motion Animations**:
- Page entry: `gentleNormal` physics (opacity + y-axis fade-in)
- Sequential reveals: Staggered delays (0.05s, 0.1s, 0.2s, etc.)
- Uses named presets from `@/lib/motion/physics`

---

## 🏗️ Feature Components (setup)

### **1. BillDetailsSection.tsx** (308 lines)
**Purpose**: Upload receipts or manually enter bill data

**Features**:
- **AI Scan Upload** - Drag & drop or file picker for receipt images (max 3)
- **Manual Entry Tab** - Parse text like "Coffee 3.50" into items
- **Demo Data Button** - Loads sample ALDI receipt for testing
- **Store Info Fields** - Optional store name and date inputs

**Key Functions**:
- `handleManualEntry()` - Parses lines with regex: `/^(.+?)[\s-]+[€$£]?([\d,.]+)$/`
- `handleTryDemo()` - Loads 6 demo items + 3 participants (Lukas, Sophie, Finn)

**Dependencies**:
- taxonomy - Category assignment with `getDefaultCategory()`
- `useStore` - Adds items via `addItem()` action

---

### **2. ItemsManagementSection.tsx** (83 lines)
**Purpose**: Display and manage items based on management mode

**Conditional Rendering**:
```tsx
managementMode === 'merged' 
  ? <ItemsList />                  // Single bill view
  : <SeparateBillsTabs />          // Multi-bill tabs
```

**Child Components**:
- `BillAccordion` - Multi-receipt accordion (separate mode only)
- `BillModifiers` - Tax/Tip inputs (merged mode only)
- `VerificationCard` - Subtotal verification (merged mode)
- `GrandTotalCard` - Combined total across receipts (separate mode)

---

### **3. ParticipantsSection.tsx** (33 lines)
**Purpose**: Simple wrapper for participant management

**Child Component**: `ParticipantsList` (from `./participants/`)

**Features**:
- Add/remove participants
- Saved groups management
- Habit recognition (auto-suggest saving frequent groups)

---

## 🎣 Custom Hooks (hooks)

### **useFileUpload.ts** (246 lines) ⭐ CORE HOOK
**Purpose**: Orchestrates entire AI scanning workflow

**Workflow Pipeline**:
```
1. handleFileUpload() 
   ├─ Compress images (browser-image-compression)
   │  └─ Target: 500KB, max 1920px width
   ├─ PII Detection (detectPIIBatch)
   │  ├─ Found PII? → Show PIIRedactionModal
   │  └─ No PII? → uploadAndScan()
   
2. uploadAndScan()
   ├─ startScanning() (Zustand action)
   ├─ scanReceiptsClient() (Gemini AI - lazy loaded)
   │  ├─ Single receipt? → Add to merged mode
   │  └─ Multiple receipts? → Show MultiBillModal
   └─ stopScanning()

3. handleMultiBillConfirm(mode)
   ├─ 'merged' → Flatten all items into single array
   └─ 'separate' → Create receipts array
```

**State Management** (All from Zustand store):
- `scanningSlice`: `startScanning`, `stopScanning`, `piiDetections`, `pendingFiles`
- `modalsSlice`: `openPIIRedactionModal`, `closeMultiBillModal`
- `itemsSlice`: `addItem`, `addScannedData`
- `uiSlice`: `setManagementMode`, `setCurrency`

**Key Design**: NO local `useState` - everything goes through Zustand for global access

---

## 🧩 Participants Sub-Feature (participants)

### **Directory Structure**:
```
participants/
├── components/          # UI components
│   ├── ParticipantCard.tsx
│   ├── ParticipantGrid.tsx
│   ├── ParticipantInput.tsx
│   ├── GroupManagement.tsx
│   └── HabitRecognition.tsx
├── hooks/               # Feature-specific hooks
│   ├── useParticipantForm.ts
│   ├── useGroupManagement.ts
│   └── useHabitRecognition.ts
├── utils/               # Validation logic
│   └── participantValidation.ts
├── ParticipantsList.tsx # Main orchestrator
└── README.md            # Feature documentation
```

### **Hook: useParticipantForm.ts**
**Purpose**: Manage participant input form state

**Features**:
- Name validation before adding
- Enter key support
- Toast notifications on success
- Auto-clear input after adding

**Returns**: `{ name, setName, inputRef, handleAdd, handleKeyDown }`

---

### **Hook: useGroupManagement.ts**
**Purpose**: Save/load/delete participant groups

**Use Case**: Frequent dining groups (e.g., "Friday Crew", "Roommates")

**Features**:
- Save current participants as named group
- Load saved group (replaces current participants)
- Delete saved groups
- Dialog state management for save/load UIs

**Store Integration**: Uses `groupsSlice` (saved in localStorage)

---

### **Hook: useHabitRecognition.ts** ⭐ SMART FEATURE
**Purpose**: Auto-suggest saving groups when user adds same people 3+ times

**Algorithm**:
1. `recordGroupUsage()` - Records participant combinations on change
2. `getSuggestedGroupName()` - Detects if same 3+ people added ≥3 times
3. Shows banner: "Save this group as 'The Usuals'?"
4. `handleAccept()` - Auto-saves with suggested name

**UI**: Non-intrusive banner with accept/dismiss (single-use per session)

---

## 🎨 Modal Components

### **1. AIScanAnimation.tsx** (222 lines)
**Purpose**: Full-screen overlay during AI processing

**States**: `uploading` → `confirming` → `processing` → `rendering` → `done`

**Processing Messages** (cycles through):
- 🔍 "Let's see what we have here..."
- 📍 "Looking for store name and bill date..."
- 💶 "Detecting Currency..."
- 📄 "Reading the fine print..." (or "Analyzing receipts in parallel..." if multiple)
- ✅ "Finding all the items..."

**Animations**:
- Upload progress bar (8% increments every 80ms)
- Icon "pop" effects using `bouncySlow` physics
- Skeleton loaders for realistic processing feel

---

### **2. PIIRedactionModal.tsx** (218 lines)
**Purpose**: Privacy protection before AI scanning

**Triggers**: When `detectPIIBatch()` finds credit cards, emails, phone numbers, addresses

**Features**:
- **Visual Comparison** - Shows original vs masked receipt side-by-side
- **Toggle Preview** - Eye icon to reveal/hide sensitive info
- **User Choice**:
  - "Scan with Masked Version" (recommended) → `handleConfirmMasked()`
  - "Scan Original" → `handleScanOriginal()`

**PII Patterns Detected**:
- Credit cards (13-16 digits, Luhn algorithm validated)
- Email addresses
- Phone numbers (various formats)
- Street addresses
- VAT IDs (European format)

---

### **3. MultiBillModal.tsx** (281 lines)
**Purpose**: Choose how to manage multiple scanned receipts

**Options**:
1. **Merged Mode** (Recommended)
   - Combines all items into single list
   - One total for entire group
   - Simpler splitting workflow
   
2. **Separate Mode**
   - Individual bill tracking
   - Per-receipt payer, tax, tip
   - Detailed breakdown

**UX Design**:
- Card-based selection with visual icons
- Feature comparison lists
- Badge: "Recommended" on merged mode
- Receipt preview grid showing scanned bills

---

## 📚 Key Library Files

### **1. scanReceiptsClient.ts** (450 lines)
**Purpose**: Client-side AI scanning with Google Gemini 1.5 Flash

**Performance**: ✅ Lazy-loaded (dynamic import) - saves ~27 kB on initial load

**Workflow**:
```typescript
1. Validate API key (VITE_GOOGLE_GEMINI_API_KEY)
2. Compress images (already done in useFileUpload)
3. Convert to base64 for Gemini API
4. Send multimodal prompt (image + structured JSON schema)
5. Parse response with taxonomy validation
6. Auto-correct special line items (TAX, TIP, DISC)
7. Fallback categorization if AI returns invalid codes
```

**Error Handling**:
- Missing API key → "AI scanning isn't set up yet 🤖"
- Network error → "Check your connection"
- Timeout → "Receipt may be too large"

**Taxonomy Integration**:
- Uses `getCategoryById()` to validate AI-returned codes
- Falls back to `categorizeFallback()` for unknown categories
- Auto-corrects special line prices with `autoCorrectSpecialLinePrice()`

---

### **2. piiDetection.ts** (274 lines)
**Purpose**: Detect sensitive information before AI upload

**Detection Patterns**:
- Credit cards: `/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{1,4}\b/g`
- Emails: Standard email regex
- Phones: International formats
- Addresses: German + English keywords (Straße, street, etc.)
- VAT IDs: European format (DE123456789)

**Functions**:
- `detectPIIBatch(files)` - Process multiple images
- `createRedactedImage(file, patterns)` - Canvas-based masking
- `luhnCheck(cardNumber)` - Validate credit card numbers

**Performance**: Optimized to run <200ms per image

---

### **3. feedback.ts** (248 lines)
**Purpose**: Haptic & audio feedback for premium UX

**Sound Effects** (Web Audio API - no external files):
- `click()` - 800Hz sine wave (50ms)
- `success()` - Two-tone C5 → E5 (harmonic progression)
- `error()` - Lower frequency with decay
- `scan()` - Ascending three-note arpeggio
- `notification()` - Gentle alert tone

**Haptic Feedback** (Mobile):
- Light impact for button clicks
- Medium impact for success
- Heavy impact for errors

**User Control**: Respects `localStorage` setting (`sounds-enabled`)

---

## 🔗 Data Flow Summary

### **Upload Workflow**:
```
User selects files
  ↓
BillDetailsSection.onFileUpload()
  ↓
useFileUpload.handleFileUpload()
  ├─ Compress (browser-image-compression)
  ├─ PII Detection (piiDetection.ts)
  │  └─ Show PIIRedactionModal if found
  ├─ AI Scan (scanReceiptsClient.ts - Gemini)
  │  └─ Show AIScanAnimation during processing
  └─ Process Results
     ├─ Single receipt → addItem() to merged mode
     └─ Multiple receipts → Show MultiBillModal
        ├─ User picks 'merged' → Flatten items
        └─ User picks 'separate' → Create receipts array
```

### **Store Slices Used**:
- `itemsSlice` - Add items, edit, delete
- `receiptsSlice` - Manage separate bills
- `participantsSlice` - Add/remove people
- `groupsSlice` - Save/load participant groups
- `scanningSlice` - Scanning state (isScanning, fileCount, piiDetections)
- `modalsSlice` - Modal open/close state
- `uiSlice` - Management mode, currency, theme
- `settingsSlice` - User preferences

---

## 🎯 Key Design Patterns

### **1. Fine-Grained Selectors** (Performance)
```tsx
// ✅ CORRECT - Only re-renders when items change
const items = useStore((state) => state.items);

// ❌ WRONG - Re-renders on ANY store change
const store = useStore();
```

### **2. Hydration Guard** (Prevents SSR Mismatch)
```tsx
const isHydrated = useHydration();
if (!isHydrated) return <LoadingScreen />;
```

### **3. Store-First State** (No Local useState for Shared Data)
```tsx
// All modals read their open state from store
const open = useStore((state) => state.isPIIRedactionModalOpen);
```

### **4. Sequential Animations** (Staggered Delays)
```tsx
<motion.div transition={{ ...smoothSlow, delay: 0.1 }}>  {/* Section 1 */}
<motion.div transition={{ ...smoothSlow, delay: 0.2 }}>  {/* Section 2 */}
<motion.div transition={{ ...smoothSlow, delay: 0.35 }}> {/* Section 3 */}
```

### **5. XSS Prevention** (All User Input Sanitized)
```tsx
// In scanReceiptsClient.ts - ALL AI responses go through sanitizeInput()
addItem({
  name: sanitizeInput(item.name),
  category: sanitizeInput(item.category)
});
```

---

## 🚀 Performance Optimizations

1. **Lazy Loading**:
   - Gemini AI: `const { GoogleGenerativeAI } = await import('@google/generative-ai');`
   - Only loads when user scans receipts (saves 27 kB)

2. **Image Compression**:
   - Target 500KB per image
   - Max 1920px width/height
   - Reduces upload time & AI processing cost

3. **PII Detection**:
   - Runs in <200ms per image
   - Prevents unnecessary API calls with sensitive data

4. **Store Slicing**:
   - 9 domain slices prevent re-renders
   - Selectors compute derived values efficiently

---

## 📝 Missing/Potential Improvements

1. **Error Recovery**: No retry mechanism if AI scan fails mid-process
2. **Offline Support**: Could cache scanned receipts for retry later
3. **Batch Processing**: Sequential scanning could be parallelized
4. **PII OCR**: Currently uses placeholder (could integrate Tesseract.js)
5. **Currency Auto-Detect**: Works but could validate with known symbols

Would you like me to:
1. **Document any specific component** in more detail?
2. **Create a flowchart** of the AI scanning pipeline?
3. **Add this Setup page analysis** to the copilot-instructions.md?
4. **Analyze other pages** (Assignment, Summary, Analytics)?