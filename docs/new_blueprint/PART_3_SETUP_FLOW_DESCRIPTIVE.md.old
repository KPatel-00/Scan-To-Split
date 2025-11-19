# Part 3: Setup Page Experience (Descriptive)

**What This Covers**: The receipt upload journey and data review - where AI magic happens and users prepare their bill for splitting.

---

## 🚀 The Setup Flow: Two Acts

### Act 1: ScanPortal (Upload Receipt)
User uploads receipt photo → AI scans it (3-5 seconds) → Data extracted

### Act 2: DataHub (Review & Edit)
User reviews items → Adds participants → Makes corrections → Continues to assignment

---

## 📸 Act 1: ScanPortal - The Upload Experience

### When You First Arrive (/setup page)

**The Scene**: Clean, spacious page with one focus - upload your receipt.

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│          📁 Ready to Split a Bill?                │  ← Welcome headline
│                                                    │
│     ┌────────────────────────────────┐           │
│     │                                 │           │
│     │          ☁️  Upload            │  ← Upload card
│     │                                 │     (glass effect)
│     │  Drop receipt image here       │
│     │  or click to browse            │
│     │                                 │
│     └────────────────────────────────┘           │
│                                                    │
│    ⚡ Fast    🔒 Secure    🌍 Any Language       │  ← Trust badges
│                                                    │
└────────────────────────────────────────────────────┘
```

### Upload Card (The Star)

**Visual Design**:
- **Size**: 600px wide max, 400px tall
- **Background**: Subtle gradient (blue/3% → purple/2%)
- **Border**: Dashed line (2px, blue/30% opacity)
- **Border Style**: Dashes (8px dash, 4px gap)
- **Border Radius**: 24px (very rounded)
- **Padding**: 64px all around

**Center Content**:
- **Icon**: Cloud with up arrow (☁️↑) at 48px size
- **Text**: "Drop receipt image here" (20px, semi-bold)
- **Subtext**: "or click to browse" (14px, muted gray)
- **Hidden Input**: File picker (accepts images only)

**States & Animations**:

**1. Default State** (waiting for file):
- Border: Dashed blue/30%
- Background: Subtle gradient
- Icon: Gray (#9CA3AF)
- **Feel**: Empty canvas, inviting

**2. Hover State** (mouse over):
- Border: Solid blue/60% (dashes disappear)
- Background: Blue/5% (brighter)
- Icon: Blue (#4F8EF7)
- Cursor: Pointer
- Transition: 0.2s smooth
- **Feel**: "Yes, drop it here!"

**3. Drag Over State** (file being dragged):
- Border: Solid blue/100% (thick, 3px)
- Background: Blue/10% (bright)
- Icon: Scales to 56px
- Gentle scale pulse (1.0 → 1.05 → 1.0)
- **Feel**: "Drop now!"

**4. Uploading State** (after file dropped):
- Border disappears
- Progress bar appears
- Loading text: "Scanning receipt..."
- **Feel**: "Working on it..."

### Progress Bar (During AI Scan)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│             🔍 Scanning Receipt...                │  ← Status text
│                                                    │
│     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │  ← Progress bar
│     ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │     (60% full)
│                                                    │
│              Extracting items...                  │  ← Sub-status
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual Design**:
- **Bar**: Full width, 8px height
- **Fill Color**: Blue gradient (light → dark)
- **Background**: Gray/10%
- **Border Radius**: 4px (slightly rounded)
- **Animation**: Smooth fill (0 → 100% over 3-5 seconds)

**Status Messages** (change during scan):
- 0-20%: "Analyzing image..."
- 20-40%: "Detecting text..."
- 40-60%: "Extracting items..."
- 60-80%: "Identifying prices..."
- 80-100%: "Finalizing..."

**Leading Edge Effect**:
- Shimmer animation on fill edge
- Light sweep effect (left to right)
- **Feel**: Like water filling a glass - smooth, continuous

### Trust Badges (Below Upload Card)

Three small badges in a row:

**Badge 1: Speed**
```
⚡ AI extracts items in seconds
```

**Badge 2: Security**
```
🔒 Images deleted after processing
```

**Badge 3: Compatibility**
```
🌍 Works with any language
```

**Visual Style**:
- Each badge: Icon + Text
- Icon size: 16px
- Text: 14px, gray
- Gap between badges: 24px
- Centered horizontally

**Purpose**: Addresses common concerns BEFORE user uploads
- Concern: "Will this be slow?" → ⚡ Fast
- Concern: "Is my data safe?" → 🔒 Secure
- Concern: "Will it work with my receipt?" → 🌍 Universal

### Returning User Banner (If Data Exists)

If user has unfinished bill, show this ABOVE upload card:

```
┌────────────────────────────────────────────────────┐
│  ℹ️  You have an unfinished bill from earlier.    │
│                                                    │
│  [Continue Editing]  [Start Fresh]                │
└────────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Info blue (blue/10%)
- **Border**: Blue/30% left border (4px thick)
- **Icon**: Info symbol (ℹ️)
- **Buttons**: Side by side
  - "Continue Editing": Primary (blue)
  - "Start Fresh": Secondary (white with border)

**Animation**: Slides down from top (0.5s) on page load

**Purpose**: Prevent accidental data loss, show we remember

---

## 📊 Act 2: DataHub - The Review Experience

### The Big Reveal (After AI Scan Completes)

**Page Transition**: ScanPortal fades out (0.3s) → DataHub fades in (0.5s)

**What User Sees** (new layout):

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [← Back to Upload]                 [Continue →]  │  ← Action buttons
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  🏪 Store Name      📅 Nov 18, 2025      │    │  ← Bill info
│  │                                           │    │
│  │  Total: $127.45                          │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  📦 Items (12)                   [+ Add] │    │  ← Items section
│  │                                           │    │
│  │  [Item Card 1]                           │    │
│  │  [Item Card 2]                           │    │
│  │  [Item Card 3]                           │    │
│  │  ...                                      │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  👥 Participants (0)         [+ Add]     │    │  ← Participants
│  │                                           │    │
│  │  Add people to split this bill           │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Bill Information Card (Top Section)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🏪 Olive Garden          📅 Nov 18, 2025      │  ← Store + Date
│  📍 123 Main St, City                          │  ← Address (if detected)
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← Divider line
│                                                 │
│  Subtotal              $110.00                 │  ← Breakdown
│  Tax (8.5%)             $9.35                  │
│  Tip (15%)             $16.50                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total                $127.45                  │  ← Big total (32px)
│                                                 │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Gradient (card/50% → primary/5%)
- **Glass effect**: Backdrop blur, semi-transparent
- **Padding**: 32px
- **Border**: 1px, border/40%
- **Border radius**: 16px
- **Shadow**: Soft drop shadow

**Entrance Animation**:
1. Fades in from 0% → 100% opacity
2. Scales from 0.95 → 1.0
3. Duration: 0.5s with spring easing
4. Slight upward movement (20px)

**Info Icons**:
- Store: 🏪 (20px emoji)
- Date: 📅 (20px emoji)
- Location: 📍 (20px emoji)

**Numbers**:
- Subtotal/Tax/Tip: 18px, regular weight
- Total: 32px, bold, blue color
- Right-aligned for easy scanning

### Items Section (The Main Content)

**Section Header**:

```
┌─────────────────────────────────────────────────┐
│  📦 Items (12)                        [+ Add]   │  ← Header bar
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Glass morphism (muted/30%)
- **Padding**: 24px
- **Border radius**: 12px (top only)
- **Left**: Icon + count (📦 Items (12))
- **Right**: Add button (white with border)

**Add Button**:
- Size: 36px height
- Icon: Plus symbol (+)
- Hover: Grows 5%, border glows blue
- Click: Opens "Add Item" dialog

### Individual Item Cards

Each item appears as a card:

```
┌─────────────────────────────────────────────────┐
│  🍝  Caesar Salad                     $12.99   │  ← Category emoji + name + price
│      Food > Salad                              │  ← Category breadcrumb
│                                          [⋮]   │  ← Menu (edit/delete)
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Card/50% (glass effect)
- **Padding**: 16px
- **Border**: 1px, border/40%
- **Border radius**: 12px
- **Shadow**: Soft (0 2px 4px)
- **Gap between cards**: 12px

**Layout**:
- **Left**: Category emoji (32px) in circle background
  - Circle: 48px diameter
  - Background: Primary/10%
  - Emoji centered
  
- **Middle**: Item details
  - **Name**: 18px, semi-bold, truncated if long
  - **Category**: 14px, muted gray
  
- **Right**: Price + menu
  - **Price**: 24px, bold, blue
  - **Menu**: Three dots (⋮), opens dropdown

**Hover Effect**:
- Card lifts 2% (scale 1.02)
- Shadow deepens
- Border glows slightly
- Transition: 0.2s

**Tap Effect** (mobile):
- Card shrinks 1% (scale 0.99)
- Springs back
- Tactile feedback

**Category Emojis** (Examples):
- Food: 🍝
- Drinks: 🥤
- Alcohol: 🍺
- Dessert: 🍰
- Grocery: 🛒
- Dairy: 🥛

### Item Card Menu (Three Dots)

**Click three dots** → Dropdown opens:

```
┌─────────────┐
│  ✏️ Edit     │  ← Edit item details
│  🗑️ Delete   │  ← Remove item
│  📋 Duplicate│  ← Copy this item
└─────────────┘
```

**Visual Design**:
- **Background**: White (light) / Dark (#1A1A1A) in dark mode
- **Border**: 1px, border color
- **Shadow**: Deep (0 4px 16px rgba(0,0,0,0.15))
- **Border radius**: 8px
- **Each option**: 36px height, 16px padding

**Hover on option**:
- Background: Muted/10%
- Cursor: Pointer

**Click behavior**:
- **Edit**: Opens dialog pre-filled with item data
- **Delete**: Shows confirmation ("Delete Caesar Salad?")
- **Duplicate**: Creates copy immediately

### Entrance Animation (Items List)

**Staggered Appearance**:
1. Section header fades in first (0.3s)
2. Item 1 slides up + fades in (0s delay)
3. Item 2 slides up + fades in (0.1s delay)
4. Item 3 slides up + fades in (0.2s delay)
5. ... continues for all items

**Effect**: Like dealing cards - smooth, rhythmic, professional

**Total time**: If 12 items → 1.2s for all to appear

### Add Item Dialog (Click "+ Add" Button)

**Dialog Appearance**:
- Slides up from bottom (mobile)
- Fades in from center (desktop)
- Backdrop: Dark overlay (80% opacity)
- Duration: 0.3s

**Dialog Content**:

```
┌─────────────────────────────────────────────────┐
│  ✖️  Add Item                                   │  ← Header with close
│                                                 │
│  Item Name                                      │  ← Label
│  [                                    ]         │  ← Input field
│                                                 │
│  Price                                          │
│  [$                                  ]          │  ← $ prefix
│                                                 │
│  Category                                       │
│  [Select category ▼]                           │  ← Dropdown
│                                                 │
│  [Cancel]                  [Add Item]          │  ← Buttons
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Size**: 500px wide, auto height
- **Background**: Card background (glass effect)
- **Padding**: 32px
- **Border radius**: 16px
- **Shadow**: Deep (0 8px 24px)

**Input Fields**:
- **Height**: 48px
- **Border**: 1px gray, becomes blue on focus
- **Border radius**: 8px
- **Padding**: 12px
- **Font**: 16px (prevents zoom on mobile)

**Category Dropdown**:
- Shows all 51 categories
- Searchable (type to filter)
- Icons for each category
- Scrollable list (max 300px height)

**Add Button**:
- **Disabled** until name + price filled
- **Gray** when disabled
- **Blue** when ready
- **Hover**: Grows 5%

### Participants Section (Bottom)

**Empty State** (no participants yet):

```
┌─────────────────────────────────────────────────┐
│  👥 Participants (0)                  [+ Add]   │
│                                                 │
│        👤 Add people to split this bill        │  ← Empty state
│           [+ Add Participant]                  │  ← Big add button
│                                                 │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Gradient (muted/30% → transparent)
- **Glass effect**: Backdrop blur
- **Padding**: 48px
- **Text**: Center-aligned, muted gray
- **Empty icon**: Large (48px), gray

**Filled State** (with participants):

```
┌─────────────────────────────────────────────────┐
│  👥 Participants (3)                  [+ Add]   │
│                                                 │
│  [Participant Card: Sarah]                     │
│  [Participant Card: Mike]                      │
│  [Participant Card: Anna]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Participant Card

```
┌─────────────────────────────────────────────────┐
│  👤 S    Sarah Johnson                   [⋮]   │  ← Avatar + name + menu
│          sarah@email.com                        │  ← Email (optional)
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Avatar**: 
  - Circle: 48px diameter
  - Initial: "S" in white text (24px)
  - Background: Random color (from palette)
    - Blues: #4F8EF7, #2563EB
    - Greens: #10B981, #059669
    - Purples: #8B5CF6, #7C3AED
    - Pinks: #EC4899, #DB2777
  
- **Name**: 18px, semi-bold
- **Email**: 14px, muted (if provided)
- **Menu**: Three dots → Edit / Delete

**Hover Effect**:
- Lifts slightly (translateY: -2px)
- Border glows in avatar color
- Transition: 0.2s

**Color Assignment**:
- Each participant gets unique color
- Used later in assignment chips/badges
- Helps visual distinction

### Add Participant Dialog

**Dialog Content**:

```
┌─────────────────────────────────────────────────┐
│  ✖️  Add Participant                            │
│                                                 │
│  Name *                                         │
│  [                                    ]         │
│                                                 │
│  Email (optional)                               │
│  [                                    ]         │
│                                                 │
│  [Cancel]              [Add Participant]       │
└─────────────────────────────────────────────────┘
```

**Validation**:
- Name required (red border if empty)
- Email validated (must be valid format if provided)
- Add button disabled until valid

**Entrance**:
- Same slide-up animation as Add Item dialog
- Auto-focus on Name field

### Continue Button (Bottom Right)

```
┌─────────────────────────┐
│  Continue to Assignment │
│            →            │
└─────────────────────────┘
```

**Visual Design**:
- **Size**: Large (56px height)
- **Color**: Blue (primary)
- **Position**: Fixed bottom-right (sticky)
- **Shadow**: Deep (floats above content)
- **Arrow**: Right arrow symbol (→)

**States**:

**Disabled** (requirements not met):
- Gray color
- 50% opacity
- Cursor: not-allowed
- Tooltip: "Add at least 1 item and 2 participants"

**Enabled** (ready to continue):
- Blue color
- Full opacity
- Gentle pulse animation
- Hover: Grows 5%
- Click: Navigate to /assignment with transition

**Requirements to Enable**:
- ✅ At least 1 item in list
- ✅ At least 2 participants added
- ✅ All items have valid prices

### Special Lines (Tax, Tip, Discounts)

**Collapsible Section** (below items):

```
┌─────────────────────────────────────────────────┐
│  💰 Special Lines (3)                    [▼]   │  ← Collapsible header
│                                                 │
│  [Show when expanded:]                         │
│                                                 │
│  💵 Tax (8.5%)                         $9.35   │
│  💵 Tip (15%)                         $16.50   │
│  🏷️ Discount (Happy Hour)            -$5.00   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Header**: Same style as Items section
- **Default**: Collapsed (saves space)
- **Expand icon**: Rotates 180° when opened
- **Special line cards**: Smaller than item cards (32px height)

**Why Separate?**:
- Not assigned to individuals (split proportionally)
- Less frequently edited
- Keeps main items list clean

---

## 🎭 User Experience Flow (Step by Step)

### Step 1: Arrive at Setup Page
**See**: Empty upload card  
**Feel**: Clean, inviting, clear what to do  
**Action**: Click or drag receipt image

### Step 2: Upload Receipt
**See**: File picker OR drag-drop zone activates  
**Feel**: Responsive, gives visual feedback  
**Action**: Select/drop image file

### Step 3: AI Scanning
**See**: Progress bar, status messages  
**Feel**: Something is happening, be patient  
**Duration**: 3-5 seconds  
**Action**: Wait (can't interact during this)

### Step 4: Review Items
**See**: 12 item cards appear in stagger  
**Feel**: Impressive, AI extracted everything!  
**Action**: Check for errors, edit if needed

### Step 5: Add Participants
**See**: Empty participants section  
**Feel**: Next logical step, can't continue without  
**Action**: Click "+ Add Participant", enter names

### Step 6: Verify & Continue
**See**: Continue button enables (no longer gray)  
**Feel**: Ready to move forward  
**Action**: Click "Continue to Assignment"

### Step 7: Page Transition
**See**: DataHub fades out, Assignment fades in  
**Feel**: Smooth, directional, clear progress  
**Arrives**: /assignment page

---

## 💡 Why The Setup Page Works

### Psychology Principles

**1. Progressive Disclosure**:
- Show upload first (simple)
- Reveal complexity after (items, participants)
- User never overwhelmed

**2. Instant Gratification**:
- AI scan completes in seconds
- Immediate visible result (items appear)
- Feels productive quickly

**3. Clear Progress**:
- Two distinct stages (upload → review)
- Continue button only enables when ready
- User always knows what's next

### Design Principles

**1. Hierarchy**:
- Bill info at top (context)
- Items in middle (main content)
- Participants at bottom (supporting)

**2. Feedback**:
- Every action has visible response
- Hover states on clickable elements
- Success states (checkmarks, green)
- Error states (red borders, helpful text)

**3. Forgiveness**:
- Undo available for delete actions
- Edit anytime (not locked after continue)
- "Back to Upload" button always visible

### Result: High Task Completion

**User Research** (imagined, based on UX best practices):
- 95% of users who upload successfully complete setup
- Average setup time: 90 seconds (fast!)
- Error rate: <5% (AI accuracy high, easy to correct)
- Satisfaction: 4.7/5 (intuitive, smooth, effective)

---

## 🎨 Visual Summary

**Setup Page = Two Acts**:

**Act 1 (ScanPortal)**:
- Clean upload card
- Progress bar during scan
- Trust badges for reassurance

**Act 2 (DataHub)**:
- Bill info card (glass effect, gradient)
- Items list (staggered cards with emoji categories)
- Participants section (colored avatars)
- Continue button (sticky, pulse animation)

**Overall Feel**: Like using a premium banking app - smooth, intelligent, trustworthy.

---

**Next**: Part 4 covers Assignment Page - where users assign items to people with visual, tactile interactions.
