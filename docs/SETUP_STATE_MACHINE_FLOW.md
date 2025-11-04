# Setup Page State Machine - Gemini-Style Flow

**Date**: October 31, 2025  
**Status**: ✅ Implemented

---

## 🎬 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                            │
│                  [Get Started] Button                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Navigate to /setup
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  STATE 1: SCAN PORTAL (Hero Upload)                        │
│  ┌───────────────────────────────────────────────────┐     │
│  │  "Let's get this sorted."                         │     │
│  │  Large Upload Dropzone                            │     │
│  │  [Scan or Upload Receipts]                        │     │
│  │  Privacy Badge: 🛡️ Privacy Protected              │     │
│  │  Alternative: Manual Entry | Try Demo             │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │ User uploads files
                      │ handleFileUpload() called
                      │ isScanning = true (Zustand)
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  STATE 2: AI SCANNING ANIMATION (Full-screen)              │
│  ┌───────────────────────────────────────────────────┐     │
│  │  ✨ "Let's see what we have here..."              │     │
│  │  ━━━━━━━━━━━━ 45% ━━━━━━━━━━━━━━                │     │
│  │                                                    │     │
│  │  Sequential Messages:                             │     │
│  │  1. "Let's see what we have..."                  │     │
│  │  2. "Looking for store name and bill date..."    │     │
│  │  3. "Detecting Currency..."                       │     │
│  │  4. "Reading the fine print..."                   │     │
│  │  5. "Finding all the items..."                    │     │
│  │                                                    │     │
│  │  ✓ Done!                                          │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │ Scan completes
                      │ isScanning = false (Zustand)
                      │ items.length > 0
                      │ pageState → 'dataHub'
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  STATE 3: DATA HUB (Items + Participants)                  │
│  ┌───────────────────────────────────────────────────┐     │
│  │  "Your Bill Details"                              │     │
│  │                                                    │     │
│  │  ┌──────────────────┬──────────────┐             │     │
│  │  │ Items (5)        │ People (2)   │ ← Desktop   │     │
│  │  │ - Milk €1.19     │ - Lukas      │             │     │
│  │  │ - Bread €1.79    │ - Sophie     │             │     │
│  │  │ - Salad €2.49    │              │             │     │
│  │  └──────────────────┴──────────────┘             │     │
│  │                                                    │     │
│  │  Mobile: [Items (5)] [People (2)] ← Tabs         │     │
│  │                                                    │     │
│  │  [Assign Items →]                                 │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │ Click "Assign Items"
                      ↓
                 ASSIGNMENT PAGE
```

---

## 🔄 State Machine Logic

### **States**
```typescript
type PageState = 'scanPortal' | 'scanning' | 'dataHub';
```

### **Transitions**
```typescript
// scanPortal → scanning
useEffect(() => {
  if (isScanning) {
    setPageState('scanning');
  }
}, [isScanning]);

// scanning → dataHub
const handleScanComplete = () => {
  setPageState('dataHub');
};

// Auto-detect state based on data
useEffect(() => {
  if (isScanning) {
    setPageState('scanning');
  } else if (items.length > 0 || receipts.length > 0 || participants.length > 0) {
    setPageState('dataHub');
  } else {
    setPageState('scanPortal');
  }
}, [isScanning, items.length, receipts.length, participants.length]);
```

---

## 🎨 Animation Details

### **State 1: ScanPortal**
- **Entry**: Stagger animation (opacity + y-axis)
- **Components**: Hero heading, upload dropzone, feature hints
- **Height**: `calc(100vh - 280px)` when empty (hero feel)

### **State 2: Scanning**
- **Entry**: Full-screen fade-in
- **Components**: Progress bar, sequential messages, icon animations
- **Duration**: ~3-5 seconds (depends on AI response)
- **Exit**: Fade-out + callback to DataHub

### **State 3: DataHub**
- **Entry**: Fade-in
- **Components**: Items list, Participants panel, Navigation CTA
- **Layout**: 
  - Mobile: Tabs (`TabsList` with counts)
  - Desktop: Side-by-side (2/3 + 1/3 sticky)

---

## 🔧 Key Implementation Details

### **AnimatePresence Mode**
```tsx
<AnimatePresence mode="wait">
  {pageState === 'scanPortal' && <ScanPortal key="scanPortal" />}
  {pageState === 'scanning' && <AIScanAnimation key="scanning" />}
  {pageState === 'dataHub' && <DataHub key="dataHub" />}
</AnimatePresence>
```

**Why `mode="wait"`?**
- Waits for exit animation to complete before rendering next component
- Prevents overlapping components during state transitions
- Smoother visual flow (no content flashing)

### **Zustand Integration**
```tsx
// Scanning state in store (scanningSlice)
const isScanning = useStore((state) => state.isScanning);
const scanFileCount = useStore((state) => state.scanFileCount);

// Data state in store
const items = useStore((state) => state.items);
const receipts = useStore((state) => state.receipts);
const participants = useStore((state) => state.participants);
```

### **Progressive Disclosure**
- **Empty state**: Only ScanPortal visible (full-height hero)
- **Scanning state**: Full-screen animation replaces everything
- **Data state**: DataHub replaces ScanPortal, shows management UI

---

## 🆚 Before vs After

### **Before (Vertical Stack)**
```
┌──────────────┐
│ ScanPortal   │ ← Always visible
├──────────────┤
│ AI Animation │ ← Overlay (modal)
├──────────────┤
│ DataHub      │ ← Conditionally visible below
└──────────────┘
```

**Problems**:
- ScanPortal always visible (cluttered when data exists)
- AI animation as overlay (doesn't replace content)
- Vertical scroll with all sections stacked

### **After (State Machine)**
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ ScanPortal   │ →   │ AI Animation │ →   │ DataHub      │
│ (State 1)    │     │ (State 2)    │     │ (State 3)    │
└──────────────┘     └──────────────┘     └──────────────┘
```

**Improvements**:
- ✅ Only one state visible at a time (focused UX)
- ✅ AI animation replaces content (immersive loading)
- ✅ Clear progression: Upload → Process → Manage
- ✅ No vertical stacking (cleaner layout)

---

## 📱 Responsive Behavior

### **Mobile (≤767px)**
All states take full viewport:
```
State 1: ScanPortal (full-height hero)
State 2: AI Animation (full-screen)
State 3: DataHub with Tabs
```

### **Desktop (≥768px)**
```
State 1: ScanPortal (centered, max-w-4xl)
State 2: AI Animation (full-screen)
State 3: DataHub (wide layout, max-w-7xl)
         ├─ Items (2/3 width)
         └─ Participants (1/3 width, sticky)
```

---

## 🎯 User Experience Flow

1. **User lands on `/setup`**
   - Sees hero upload section
   - Clear call-to-action: "Scan or Upload Receipts"

2. **User uploads receipts**
   - ScanPortal disappears
   - Full-screen AI animation appears
   - Progress messages guide expectation

3. **AI completes scanning**
   - Animation fades out
   - DataHub fades in with scanned items
   - User can review/edit items, add participants

4. **User clicks "Assign Items →"**
   - Navigates to `/assignment` page
   - State persists in Zustand (can return later)

---

## 🔮 Future Enhancements

### **Back Navigation** (Optional)
Add "Back to Upload" button in DataHub:
```tsx
<Button variant="ghost" onClick={() => setPageState('scanPortal')}>
  ← Back to Upload
</Button>
```

### **State Persistence** (Optional)
Save pageState to localStorage:
```tsx
const [pageState, setPageState] = useState<PageState>(
  () => (localStorage.getItem('setupPageState') as PageState) || 'scanPortal'
);

useEffect(() => {
  localStorage.setItem('setupPageState', pageState);
}, [pageState]);
```

### **Skip Animation** (Optional)
Add skip button during scanning:
```tsx
<Button variant="ghost" onClick={handleScanComplete}>
  Skip Animation
</Button>
```

---

## ✅ Testing Checklist

- [ ] Landing page CTA → ScanPortal appears
- [ ] Upload receipt → AI animation appears
- [ ] AI animation completes → DataHub appears
- [ ] DataHub shows scanned items
- [ ] Mobile: Tabs work (Items/People)
- [ ] Desktop: Side-by-side layout
- [ ] "Assign Items" button navigates to /assignment
- [ ] Demo bill loads → DataHub appears
- [ ] Manual entry (when implemented) → DataHub appears
- [ ] No vertical stacking (states replace each other)

---

## 🎉 Summary

Successfully implemented Gemini-style state machine flow with:
- **3 distinct states** that replace each other (not stack)
- **AnimatePresence** for smooth transitions
- **Progressive disclosure** based on data state
- **Full-screen AI animation** (immersive loading)
- **Responsive layouts** for all states

**Result**: Cleaner, more focused user experience with clear progression through the upload workflow.
