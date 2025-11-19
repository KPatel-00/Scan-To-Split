# Part 3: Setup Flow Experience (Descriptive) - ACTUAL IMPLEMENTATION

**What This Covers**: The bill input journey - from clicking "Get Started" to having items and participants ready for assignment.

**Status**: ✅ Verified against real code (Setup.tsx, ScanPortal.tsx, DataHub.tsx examined)

**Last Updated**: Based on code audit - 3-state machine, actual component structure documented

---

## 🎬 The Journey Overview

When a user clicks "Get Started" from the landing page, they enter a **3-state flow** designed like Gemini AI's interface - clean, focused, and intelligent.

### The 3 States

```
STATE 1: ScanPortal          STATE 2: Scanning           STATE 3: DataHub
┌──────────────┐            ┌──────────────┐           ┌──────────────┐
│              │            │              │           │              │
│  📸 Upload   │  ──────>   │  ⏳ AI       │  ──────>  │  ✅ Review   │
│  Receipt     │            │  Processing  │           │  & Edit      │
│              │            │              │           │              │
└──────────────┘            └──────────────┘           └──────────────┘
```

**State 1: ScanPortal** - Upload or manually enter bill data
**State 2: AI Scanning** - Lottie animation while AI extracts items
**State 3: DataHub** - Review items, add participants, verify data

**Design Philosophy**: "Portal" style (Gemini inspiration) - each state fills the screen, no clutter, clear focus.

---

## 🎯 Top of Page: Progress Stepper

Before entering any state, you see a **progress indicator** that sticks to the top of the page.

### What It Looks Like

```
┌─────────────────────────────────────────────────────┐
│  1. Setup ●━━━━━━━━━━ 2. Assign ━━━━━━━━━━ 3. Done │
└─────────────────────────────────────────────────────┘
```

**Visual Design**:
- **Step 1 (Setup)**: Filled circle (●) + bold text - you are here
- **Step 2 (Assign)**: Empty circle (○) + gray text - next step
- **Step 3 (Done)**: Empty circle (○) + gray text - final step
- **Progress line**: Filled portion shows how far you've come

**Behavior**:
- **Sticky positioning** - stays at top when scrolling
- **Frosted glass background** - semi-transparent with backdrop blur
- **Responsive** - Shows step numbers on mobile, full text on desktop

**Why It's Important**:
- ✅ User always knows where they are (no feeling lost)
- ✅ Sets expectations (3 steps total)
- ✅ Provides sense of progress (motivation to complete)

---

## 📍 STATE 1: ScanPortal - The Upload Interface

**File**: `ScanPortal.tsx` (183 lines after Nov 4 refactoring)

**Status**: ✅ Fully implemented with 6 sub-components

### What You See on First Visit

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│           Let's get this sorted.                     │
│                                                      │
│  Scan or upload up to 3 receipts to begin.          │
│       The AI will do the heavy lifting.             │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │         📸  Drag & Drop Files Here             │ │
│  │                                                │ │
│  │         or click to browse                     │ │
│  │                                                │ │
│  │    (Images up to 10MB, .jpg .png .heic)       │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│       [Try Demo Bill]  [Manual Entry Instead]       │
│                                                      │
│  ✨ AI-powered   🔒 Private   ⚡ Multi-bill         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Component Breakdown

**1. Hero Header** (UploadDropzone.tsx):
- **Headline**: "Let's get this sorted." (typography.display.md - large, bold)
- **Subtitle**: "Scan or upload up to 3 receipts to begin. The AI will do the heavy lifting." (typography.body.lgMuted - gray)
- **Animation**: Fades in with upward slide (fadeInUp preset)
- **Feel**: Confident, friendly, not overwhelming

**2. Upload Dropzone** (UploadDropzone.tsx):
- **Component**: `<UploadDropzone>` - Large dashed border rectangle
- **Icon**: Camera or upload icon (large, 48px)
- **Primary Text**: "Drag & Drop Files Here"
- **Secondary Text**: "or click to browse"
- **File Types**: Shows accepted formats (images, HEIC)
- **Size Limit**: Shows "up to 10MB"

**Drag-and-Drop Behavior**:
- **On drag over**: Border becomes solid, background highlights (blue tint)
- **On drop**: Files appear in preview list immediately
- **On click**: Opens native file picker
- **Mobile**: Only click (no drag-and-drop on mobile)

**3. Alternative Actions** (AlternativeActions.tsx):
- **Two Buttons** below dropzone:
  - **"Try Demo Bill"** - Loads sample data (grocery store receipt)
  - **"Manual Entry Instead"** - Toggles to text-based entry

**Design**:
- Secondary button style (outline, not filled)
- Icons on left (beaker for demo, keyboard for manual)
- Side-by-side on desktop, stacked on mobile

**4. Feature Highlights** (FeatureHighlights.tsx):
- **Three Icons + Text** at bottom:
  - ✨ "AI-powered" - extracts items automatically
  - 🔒 "Private" - your data stays on your device
  - ⚡ "Multi-bill" - handle multiple receipts at once

**Purpose**: Reassures users, highlights benefits, builds trust

**Visual**: Small, subtle, always visible (not attention-grabbing)

### Returning User Scenario

**Scenario**: User already has items/participants from previous session

**What Changes**:
- **Banner Appears** at top (ReturningUserBanner.tsx):
  ```
  ┌──────────────────────────────────────────┐
  │  Welcome back! You have:                 │
  │  • 12 items from 1 receipt               │
  │  • 4 participants                        │
  │                                          │
  │  [Continue Editing]    [Clear & Restart] │
  └──────────────────────────────────────────┘
  ```

**Buttons**:
- **"Continue Editing"** - Jumps directly to STATE 3 (DataHub)
- **"Clear & Restart"** - Clears localStorage, resets to empty state

**Design**:
- Light blue background (info color)
- Not dismissible (must choose action)
- Prominent (hard to miss)

### File Selection Experience

**User Action**: Clicks dropzone or drops files

**What Happens**:

1. **File Validation** (immediate):
   - Checks file type (must be image or .heic)
   - Checks file size (must be < 10MB)
   - Invalid files: Shows error toast, not added
   - Valid files: Added to preview list

2. **File Preview List Appears** (FilePreviewList.tsx):
   ```
   ┌────────────────────────────────────────────┐
   │  📄 receipt_1.jpg        🗑️ Remove        │
   │  ▒▒▒▒▒ (Thumbnail)                        │
   │  2.4 MB                                    │
   ├────────────────────────────────────────────┤
   │  📄 receipt_2.png        🗑️ Remove        │
   │  ▒▒▒▒▒ (Thumbnail)                        │
   │  1.8 MB                                    │
   ├────────────────────────────────────────────┤
   │  [+ Add More Files]   [Start Scanning →]  │
   └────────────────────────────────────────────┘
   ```

**Each File Card Shows**:
- Filename (truncated if long)
- Thumbnail preview (actual image, compressed)
- File size
- Remove button (trash icon)

**Bottom Actions**:
- **"Add More Files"** - Opens file picker again (max 3 total)
- **"Start Scanning →"** - Primary button, proceeds to STATE 2

**Animations**:
- Cards fade in with stagger (0.1s delay each)
- Smooth layout shift when removing files
- Thumbnail loads with fade (no jarring pop-in)

### Manual Entry Mode (Alternative)

**User Action**: Clicks "Manual Entry Instead"

**What Changes**:
- Upload dropzone **swaps out** (AnimatePresence transition)
- **Text area appears** (ManualEntryBox.tsx):

```
┌──────────────────────────────────────────────┐
│  Paste your receipt text below:             │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Store: Trader Joe's                    │ │
│  │ Date: 2024-11-01                       │ │
│  │                                        │ │
│  │ Milk - $3.99                           │ │
│  │ Bread - $2.50                          │ │
│  │ ...                                    │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [Parse Text →]                              │
│                                              │
│  [Back to Upload]                            │
└──────────────────────────────────────────────┘
```

**Features**:
- Large text area (200px tall, resizable)
- Placeholder text shows expected format
- **"Parse Text →"** button attempts to extract items
- **"Back to Upload"** toggles back to dropzone

**Current Status**: 🚧 Parsing logic has TODO comment (not fully implemented)

---

## ⏳ STATE 2: AI Scanning Animation

**File**: `AIScanAnimation.tsx`

**Status**: ✅ Fully implemented with Lottie animation

**Trigger**: User clicks "Start Scanning" from file preview

### What You See

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│           [Lottie Animation]                 │
│        (Receipt being scanned)               │
│                                              │
│         Scanning 2 receipts...               │
│                                              │
│            ●●●○○○○○                          │
│         (Progress Dots)                      │
│                                              │
└──────────────────────────────────────────────┘
```

### The Animation

**Visual**: Lottie animation (JSON-based, vector animation)
- **Source**: `src/animations/hero-scan-receipt.json`
- **Library**: `lottie-react` package (2.4.1)
- **Style**: Minimalist receipt with scanning line moving down
- **Loop**: Yes (repeats while scanning)
- **Size**: ~300px on desktop, scales on mobile

**Text Below Animation**:
- "Scanning {count} receipt(s)..." (dynamic count)
- Shows plural/singular correctly

**Progress Indicator**:
- Row of dots (●●●○○○○○)
- Filled dots = progress
- Animates filling from left to right

### What's Happening Behind the Scenes

**Real Actions**:
1. Images compressed via `browser-image-compression` library
2. Sent to Google Gemini 1.5 Flash API
3. AI extracts:
   - Store name, date
   - Item names, prices, quantities
   - Tax, tip amounts
   - Category codes (GROC.DAIRY, ALCO.BEER, etc.)
4. Results sanitized with `sanitizeInput()` (XSS prevention)
5. Stored in Zustand state

**Duration**:
- Typically 2-5 seconds per receipt
- Depends on image size and API response time
- Minimum 2 seconds shown (even if faster, for UX)

### Transition to STATE 3

**Trigger**: AI scanning completes successfully

**What Happens**:
1. Lottie animation fades out
2. DataHub fades in (0.3s transition)
3. User now sees extracted data

**Error Handling**:
- If API fails: Error toast appears, returns to STATE 1
- If partial success: Shows what was extracted, toast warns about errors
- User can always return to upload and try again

---

## ✅ STATE 3: DataHub - Review & Edit

**File**: `DataHub.tsx` (163 lines)

**Status**: ✅ Premium upgrade completed Nov 5, 2025

**Purpose**: Review extracted items, add/edit participants, verify bill details

### The Layout Structure

**Desktop** (≥768px):
```
┌──────────────────────────────────────────────────────────┐
│  ← Back to Upload                                        │
│                                                          │
│              Your Bill Details                           │
│       Review items and add participants                  │
│                                                          │
│  ┌─────────────────┐      ┌────────────────────────────┐│
│  │                 │      │                            ││
│  │  ITEMS SECTION  │      │   PARTICIPANTS SECTION     ││
│  │                 │      │                            ││
│  │  • 12 items     │      │  • Add people              ││
│  │  • Edit prices  │      │  • Set who paid            ││
│  │  • Categories   │      │  • Create groups           ││
│  │                 │      │                            ││
│  └─────────────────┘      └────────────────────────────┘│
│                                                          │
│              [Assign Items →]                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Mobile** (<768px):
```
┌──────────────────────────────────────────┐
│  ← Back to Upload                        │
│                                          │
│          Your Bill Details               │
│   Review items and add participants      │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │ [Items] | [Participants]             ││ (Tabs)
│  └──────────────────────────────────────┘│
│                                          │
│  ┌──────────────────────────────────────┐│
│  │                                      ││
│  │  (Active Tab Content)                ││
│  │                                      ││
│  └──────────────────────────────────────┘│
│                                          │
│          [Assign Items →]                │
│                                          │
└──────────────────────────────────────────┘
```

### Header Section

**Back Button**:
- Ghost style (transparent, becomes visible on hover)
- Arrow icon (←) + "Back to Upload"
- Returns to STATE 1 (ScanPortal)
- Preserves current data (doesn't clear)

**Title & Subtitle**:
- Title: "Your Bill Details" (typography.display.md)
- Subtitle: "Review items and add participants" (typography.body.lgMuted)
- Centered text, generous spacing (py-12)

### Items Section (Left Side / First Tab)

**Component**: `ItemsManagementSection.tsx`

**What You See**:

```
┌──────────────────────────────────────────┐
│  📦 Items (12)                           │
│                                          │
│  [Search items...]          [+ Add Item] │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🥛 Whole Milk                      │  │
│  │ GROC.DAIRY • $3.99 × 1             │  │
│  │ [Edit] [Delete]                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🍞 Sourdough Bread                 │  │
│  │ GROC.BAKERY • $5.50 × 1            │  │
│  │ [Edit] [Delete]                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  (12 items total)                        │
│                                          │
│  Subtotal: $45.67                        │
│  Tax: $3.65                              │
│  Tip: $8.00                              │
│  ──────────────                          │
│  Total: $57.32                           │
└──────────────────────────────────────────┘
```

**Section Header** (PremiumSectionHeader.tsx):
- Icon: Package (📦)
- Title: "Items"
- Count badge: Number of items in blue circle
- Premium typography from `typography.ts`

**Search Bar**:
- Icon: Search magnifying glass
- Placeholder: "Search items..."
- Live filtering (updates as you type)
- Debounced input (waits 300ms before filtering)

**Add Item Button**:
- Secondary style (outline)
- Plus icon (+)
- Opens dialog for manual item entry

**Item Cards** (PremiumItemCard.tsx):
- **Glass morphism design**: `bg-card/50 backdrop-blur-sm`
- **Hover effect**: Border brightens, shadow increases (cardTactile)
- **Layout**:
  - Top: Item emoji + name (bold)
  - Middle: Category badge + price × quantity
  - Bottom: Edit and Delete icon buttons

**Bill Summary** (bottom of list):
- Subtotal, Tax, Tip shown in lighter text
- Grand total in bold, larger text
- Horizontal line separator above total

**Separate Bills Mode** (if multiple receipts):
- Groups items by receipt in accordion sections
- Each section shows store name + date
- Expand/collapse per receipt

### Participants Section (Right Side / Second Tab)

**Component**: `ParticipantsSection.tsx`

**What You See**:

```
┌──────────────────────────────────────────┐
│  👥 Participants (4)                     │
│                                          │
│  [Search people...]      [+ Add Person]  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 👤 Alice                           │  │
│  │ email@example.com                  │  │
│  │ [Edit] [Delete]                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 👤 Bob                             │  │
│  │ No email                           │  │
│  │ [Edit] [Delete] [Set as Payer]     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  (4 participants total)                  │
│                                          │
│  💡 Add at least 2 people to continue    │
└──────────────────────────────────────────┘
```

**Section Header**:
- Icon: Users (👥)
- Title: "Participants"
- Count badge: Number of people

**Add Person Button**:
- Primary style (filled)
- Plus icon (+)
- Opens dialog for name/email entry

**Participant Cards** (ParticipantCard.tsx):
- **Avatar circle**: First initial or emoji
- **Name**: Bold, larger text
- **Email/Phone**: Optional, smaller gray text
- **Payer Badge**: "Paid Bill" badge if person paid (merged mode)
- **Hover effect**: Subtle scale + shadow (cardTactile)

**Validation Message**:
- Shows if < 2 participants
- Light bulb icon (💡)
- Text: "Add at least 2 people to continue"
- Yellow/amber tint (warning color)

### Navigation Actions (Bottom)

**Button**: "Assign Items →"
- Large size, full width on mobile
- Primary color (blue)
- Arrow icon on right
- Disabled if:
  - No items exist
  - Less than 2 participants
- Enabled state: Hover effect with shadow

**Validation Feedback**:
- If button disabled, shows helper text below:
  - "Add at least 1 item and 2 participants to continue."
  - Specific message depending on what's missing

---

## 🎨 Design Language Throughout Setup

### Glass Morphism (Premium Upgrade Nov 5, 2025)

**Visual Style**:
- Cards: `bg-card/50` (50% opacity) + `backdrop-blur-sm`
- Borders: `border-border/40` (40% opacity)
- Shadows: Subtle, soft (`shadow-sm` on Tailwind)

**Effect**: Cards feel "floating" above background, frosted glass look

### Tactile Feedback

**Interactive Elements**:
- Buttons: Scale on hover (1.02x), press (0.98x)
- Cards: Slight elevation on hover
- Icons: Brighten on hover
- All animations: Smooth spring physics (stiffness: 300)

**Accessibility**:
- **useReducedMotion()** hook checks OS preference
- If user prefers reduced motion: Animations skip
- **safeTactile()** wrapper disables hover/tap effects

### Typography Hierarchy

**Levels Used**:
- Page title: `typography.display.md` (48-60px)
- Section headers: `typography.heading.h3` (24-30px)
- Body text: `typography.body.lg` (18px)
- Labels: `typography.body.sm` (14px)
- Muted text: `typography.body.lgMuted` (18px, gray)

**Consistency**: All text uses named presets from `typography.ts`

### Spacing System

**Padding/Margins**:
- Page container: `py-12` (48px vertical padding)
- Section gaps: `space-y-8` (32px between sections)
- Card padding: `p-6` (24px inside cards)
- Element gaps: `gap-4` (16px between buttons)

**Philosophy**: Generous whitespace = premium feel

### Animation Timing

**Stagger Pattern**:
- Container fades in: 0s
- First child: 0.1s delay
- Second child: 0.2s delay
- Third child: 0.3s delay
- (0.1s increment per child)

**Transition Duration**:
- Fast: 0.15s (hover effects)
- Normal: 0.3s (page transitions)
- Slow: 0.5s (complex animations)

---

## 📱 Responsive Behavior

### Mobile Optimizations (414px)

**Layout Changes**:
- DataHub: Tabs instead of side-by-side
- Buttons: Full width (not side-by-side)
- Cards: More padding, larger tap targets
- Text: Scales down slightly (but still readable)

**Touch Interactions**:
- File upload: Click only (no drag-and-drop)
- Swipe to delete: Possible future enhancement
- Haptic feedback: Vibration on button taps

### Tablet (768px)

**Layout Changes**:
- DataHub: Side-by-side at this breakpoint
- Search bars: Full width in their columns
- Typography: Slightly larger than mobile

### Desktop (1366px+)

**Layout Changes**:
- Maximum content width: 1280px (centered)
- Even more generous spacing
- Hover effects more visible

### Foldable Phones (280px)

**Special Handling**:
- Custom breakpoint: `fold-v`
- Reduced padding to prevent overflow
- Smaller font sizes
- Still fully functional

---

## 🚦 Error States & Edge Cases

### No Items Found

**Scenario**: AI scanning completes but found 0 items

**What Happens**:
- Toast error: "No items detected. Please try again or enter manually."
- Returns to STATE 1 (ScanPortal)
- User can re-upload or switch to manual entry

### API Error

**Scenario**: Gemini API fails or times out

**What Happens**:
- Toast error: "Scanning failed. Check internet connection."
- Returns to STATE 1
- Files remain selected (user can retry)

### Invalid Receipt Format

**Scenario**: Image is not a receipt (e.g., selfie, landscape photo)

**What Happens**:
- AI returns empty or invalid data
- Toast warning: "This doesn't look like a receipt. Try another image."
- User can add items manually in DataHub

### Demo Data Already Loaded

**Scenario**: User clicks "Try Demo" but demo is already active

**What Happens**:
- Confirmation dialog: "Replace current data with demo?"
- User can confirm or cancel
- Prevents accidental data loss

---

## 🎯 User Journey Success Metrics

### Ideal Path (Happy Flow)

1. Click "Get Started" from landing (0s)
2. Drag-drop receipt image (5s)
3. Click "Start Scanning" (7s)
4. AI processes receipt (10s total)
5. Review items in DataHub (20s)
6. Add 2-3 participants (40s)
7. Click "Assign Items →" (42s)

**Total Time**: ~40-60 seconds from landing to assignment

### Conversion Points

**Critical Actions**:
- Upload at least 1 file (STATE 1 → STATE 2)
- Wait for scanning completion (STATE 2 → STATE 3)
- Add at least 2 participants (STATE 3 → Assignment)

**Drop-off Risks**:
- Scanning too slow (>10s) - user abandons
- Too many items to review (>30) - overwhelming
- No participant email option - confusion

---

## 🔑 Key Takeaways

### What Makes This Flow Special

1. **3-state machine** - Clear, focused progression (ScanPortal → Scanning → DataHub)
2. **Lottie animation** - Engaging visual during AI processing
3. **Glass morphism** - Premium card designs throughout
4. **Returning user detection** - Banner offers to continue or restart
5. **Alternative entry modes** - Upload OR manual OR demo
6. **Responsive layout** - Tabs on mobile, side-by-side on desktop
7. **Real-time validation** - Button disables if data incomplete
8. **Spring animations** - Everything feels smooth and alive

### Implementation Status

- ✅ **ScanPortal**: Fully functional (183 lines, refactored Nov 4)
- ✅ **AIScanAnimation**: Lottie animation implemented
- ✅ **DataHub**: Premium upgrade complete (glass morphism, Nov 5)
- ✅ **File upload**: Drag-drop + click, preview, validation
- ✅ **Demo data**: One-click sample bill loading
- 🚧 **Manual entry parsing**: Toggle exists, parsing incomplete
- ✅ **Returning user**: Banner with continue/clear options

### Technical Highlights

- **Lazy loading**: AI scanning logic only loads when needed (~27 kB chunk)
- **Image compression**: Large photos compressed before API upload
- **XSS prevention**: All AI results sanitized before storage
- **State persistence**: Zustand + localStorage preserves progress
- **Error recovery**: Graceful failures return to upload state
