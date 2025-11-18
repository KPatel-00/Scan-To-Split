# Part 4: Assignment & Summary Pages (Descriptive)

**What This Covers**: The assignment interaction (selecting people, tapping items) and the final summary with settlements and export options.

---

## 🎯 Assignment Page: The Interactive Experience

### The Big Picture (What You See)

```
┌────────────────────────────────────────────────────┐
│  [Progress: ●●○ Step 2 of 3]                      │  ← Progress dots
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  ✨ Assign Items to People               │    │  ← Page title card
│  │  Select participants, then tap items     │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  Select Participants:                    │    │  ← Participant palette
│  │  [Sarah] [Mike] [Anna]                   │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  🏪 Olive Garden      Total: $127.45     │    │  ← Bill summary
│  └──────────────────────────────────────────┘    │
│                                                    │
│  [Item Card 1 - clickable]                       │  ← Items list
│  [Item Card 2 - clickable]                       │
│  [Item Card 3 - clickable]                       │
│  ...                                              │
│                                                    │
│  [Continue to Summary →]                         │  ← Bottom button
└────────────────────────────────────────────────────┘
```

---

### Progress Stepper (Top)

**Visual Design**:

```
Step 2 of 3  ●━━●━━○
```

- **Dots**: 3 circles
  - Completed: Blue filled circle (●)
  - Current: Blue filled with pulse (●)
  - Upcoming: Gray outline (○)
  
- **Lines**: Connect dots
  - Completed: Blue solid line (━━)
  - Upcoming: Gray dotted line (··)

- **Labels** (below dots):
  - Setup → Assignment → Summary

**Animation**:
- When page loads, current dot pulses gently
- Scale: 1.0 → 1.1 → 1.0 (repeats every 2s)
- Draws attention subtly

**Purpose**: Users always know where they are in the flow

---

### Page Title Card

```
┌─────────────────────────────────────────────────┐
│  ✨ Assign Items to People                      │  ← Title (32px)
│                                                 │
│  Select participants below, then tap items     │  ← Instructions (16px)
│  to assign them. Items can be shared!          │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Gradient (card → primary/5%)
- **Border**: Primary/20% (glowy blue)
- **Padding**: 24px
- **Icon**: Sparkles (✨) - adds delight
- **Text**: Dark (primary text) + Muted (instructions)

**Purpose**: Clear instructions before interaction begins

---

### Participant Palette (The Selection Tool)

**Visual Layout**:

```
┌─────────────────────────────────────────────────┐
│  Select Participants:                           │  ← Label
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Sarah   │  │   Mike   │  │   Anna   │    │  ← Participant chips
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  Tip: Select one or more, then tap items      │  ← Helper text
└─────────────────────────────────────────────────┘
```

### Individual Participant Chip

**Unselected State**:
```
┌──────────────┐
│   👤 Sarah   │  ← White bg, gray border
└──────────────┘
```

**Visual Design**:
- **Background**: White (light) / Card (dark mode)
- **Border**: 2px, border color
- **Padding**: 12px horizontal, 8px vertical
- **Border radius**: 24px (pill shape)
- **Text**: 16px, semi-bold
- **Avatar**: Colored circle (48px) with initial

**Selected State**:
```
┌──────────────┐
│   👤 Sarah   │  ← Blue bg, white text
└──────────────┘
```

**Visual Changes**:
- **Background**: Primary blue (#4F8EF7)
- **Text**: White
- **Border**: Same blue (invisible against background)
- **Shadow**: Glow effect (0 0 12px rgba(79,142,247,0.4))

**Transition**: 0.2s smooth between states

**Multi-Selection**:
- Can select multiple chips at once
- Each selected chip glows blue
- All selected participants will be assigned together

### Chip Interactions

**Hover** (mouse over):
- Border thickens slightly (2px → 3px)
- Border color brightens
- Cursor: pointer
- **Feel**: "Click me to select"

**Click** (tap):
- Chip shrinks 2% (scale 0.98)
- Springs back to full size
- State toggles (selected ↔ unselected)
- **Feel**: Physical button press

**Keyboard** (Tab + Space):
- Focus ring appears (blue outline)
- Space bar toggles selection
- **Accessible**: Can select without mouse

---

### Bill Info Summary (Middle Section)

```
┌─────────────────────────────────────────────────┐
│  🏪 Olive Garden                                │  ← Store name
│  📅 November 18, 2025                           │  ← Date
│                                                 │
│  Items: 12        Subtotal: $110.00            │  ← Quick stats
│  Assigned: 8      Tax + Tip: $25.85            │
│  Remaining: 4     Total: $127.45               │  ← Big total
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Muted/20% (subtle)
- **Layout**: Two columns
  - Left: Counts (items, assigned, remaining)
  - Right: Money (subtotal, tax/tip, total)
  
- **Total**: 28px, bold, blue (stands out)
- **Remaining Count**: Updates live as items are assigned

**Purpose**: 
- Context reminder (what bill am I working on?)
- Progress tracking (4 items left to assign)
- Running total visible

---

### Items List (The Main Interaction)

Each item is a clickable card:

```
┌─────────────────────────────────────────────────┐
│  🍝  Caesar Salad                     $12.99   │  ← Item name + price
│      Food > Salad                              │  ← Category
│                                                 │
│      [No one assigned yet]                     │  ← Status (empty)
│                                                 │
│      [Custom Split]                            │  ← Optional button
└─────────────────────────────────────────────────┘
```

### Item Card States

**1. Unassigned** (no one selected yet):
- **Background**: Card/50% (glass)
- **Border**: 1px, border/40%
- **Status Text**: Gray, italic ("No one assigned yet")
- **Feel**: Waiting, needs attention

**2. Hover** (mouse over):
- **Border**: Thickens, glows blue
- **Scale**: 1.02 (lifts slightly)
- **Shadow**: Deepens
- **Cursor**: Pointer (if participants selected)
- **Cursor**: Not-allowed (if no participants selected)
- **Feel**: "Click to assign" OR "Select participants first"

**3. Assigned** (people added):
```
┌─────────────────────────────────────────────────┐
│  🍝  Caesar Salad                     $12.99   │
│      Food > Salad                              │
│                                                 │
│      👤 Sarah  👤 Mike                         │  ← Assigned badges
│                                                 │
│      [Custom Split]                            │
└─────────────────────────────────────────────────┘
```

**Visual Changes**:
- **Border**: Green (success color)
- **Background**: Subtle green tint (green/5%)
- **Badges**: Colored pills with participant names
  - Each badge has participant's color
  - Shows avatar initial + name
  - Horizontal layout with 8px gap

**4. Clicked** (tap to assign):
- **Animation Sequence**:
  1. Card shrinks to 0.99 (50ms)
  2. Springs back to 1.0 (150ms)
  3. New badges fade in (200ms)
  4. Border color changes to green (200ms)
  
- **Sound** (optional): Subtle "tick" (if enabled)
- **Feel**: Satisfying, tactile, confirmed

### Assignment Badges

When item is assigned, badges appear:

```
👤 Sarah    👤 Mike
```

**Each Badge**:
- **Size**: 32px height
- **Background**: Participant's color (e.g., Sarah = blue)
- **Text**: White, 14px
- **Avatar**: Tiny circle with initial (20px)
- **Border radius**: 16px (pill shape)
- **Shadow**: Subtle

**Hover on Badge** (to remove):
- ✖️ icon appears on right
- Background darkens slightly
- Click badge → removes that person from item
- **Feel**: Easy to undo mistakes

### Custom Split Button

Below badges, option to split non-equally:

```
[⚙️ Custom Split]
```

**Visual**:
- **Style**: Ghost button (transparent, border only)
- **Size**: Small (28px height)
- **Icon**: Gear symbol (⚙️)
- **Text**: 14px, muted

**Click**: Opens Custom Split Popover

---

### Custom Split Popover

**Trigger**: Click "Custom Split" on any item

**Popover Appearance**:
- Slides up from bottom (mobile)
- Appears anchored to button (desktop)
- **Size**: 400px wide, auto height
- **Background**: Card (glass effect)
- **Shadow**: Deep (0 8px 24px)

**Content**:

```
┌─────────────────────────────────────────────────┐
│  ✖️  Custom Split: Caesar Salad                 │  ← Header
│                                                 │
│  ┌─────┬─────────┬──────────┐                  │
│  │Equal│Percent %│Custom $  │                  │  ← 3 tabs
│  └─────┴─────────┴──────────┘                  │
│                                                 │
│  [Tab content appears here]                    │
│                                                 │
│  [Cancel]              [Apply Split]           │  ← Actions
└─────────────────────────────────────────────────┘
```

### Tab 1: Equal Split

```
┌─────────────────────────────────────────────────┐
│  Each person pays equal share                  │  ← Description
│                                                 │
│  👤 Sarah          $6.50 (50%)                 │  ← Auto-calculated
│  👤 Mike           $6.50 (50%)                 │
│                                                 │
│  Total: $12.99 ✓                               │  ← Validation
└─────────────────────────────────────────────────┘
```

**Logic**: Price divided equally among assigned people

### Tab 2: Percentage Split

```
┌─────────────────────────────────────────────────┐
│  Enter percentage each person pays             │
│                                                 │
│  👤 Sarah    [70] %      $9.09                 │  ← Input + calculated
│  👤 Mike     [30] %      $3.90                 │
│                                                 │
│  Total: 100% ✓  $12.99 ✓                      │  ← Must sum to 100%
└─────────────────────────────────────────────────┘
```

**Validation**:
- ✅ Percentages must sum to 100%
- ❌ If sum ≠ 100%, show red error
- ✅ Dollar amounts calculated automatically
- **Apply button disabled** until valid

### Tab 3: Custom Dollar Amounts

```
┌─────────────────────────────────────────────────┐
│  Enter exact amount each person pays           │
│                                                 │
│  👤 Sarah    $[9.00]                           │  ← Direct input
│  👤 Mike     $[3.99]                           │
│                                                 │
│  Total: $12.99 ✓                               │  ← Must match item price
└─────────────────────────────────────────────────┘
```

**Validation**:
- ✅ Must sum to exact item price
- ❌ If sum ≠ price, show red error
- **Apply button disabled** until valid

### Apply Split Button

**States**:
- **Disabled** (validation fails): Gray, 50% opacity
- **Enabled** (valid split): Blue, full opacity
- **Hover**: Grows 5%
- **Click**: Saves split, closes popover, shows success toast

**Success Toast**:
```
┌─────────────────────────────┐
│  ✓ Custom split applied!    │  ← Slides in from top-right
└─────────────────────────────┘
```

---

### Continue Button (Bottom)

```
┌─────────────────────────┐
│  Continue to Summary    │
│          →              │
└─────────────────────────┘
```

**States**:

**Disabled** (items still unassigned):
- Gray color
- 50% opacity
- Tooltip: "Assign all items first"

**Enabled** (all items assigned):
- Blue color
- Gentle pulse animation
- Hover: Grows 5%
- Click: Navigate to /summary

**Position**: Fixed bottom-right (sticky)

---

## 📊 Summary Page: The Final Result

### The Grand Reveal

```
┌────────────────────────────────────────────────────┐
│  [Progress: ●●● Step 3 of 3]                      │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  ✅ Bill Split Complete!                 │    │  ← Success header
│  │  🎉                                       │    │     (confetti!)
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  Who Owes What                           │    │  ← Settlement cards
│  │                                           │    │
│  │  [Sarah pays Mike $23.45]                │    │
│  │  [Anna pays Mike $18.20]                 │    │
│  │                                           │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  [View Breakdown ▼]                              │  ← Collapsible details
│                                                    │
│  [📄 Download PDF]  [📱 Share Image]            │  ← Export buttons
└────────────────────────────────────────────────────┘
```

---

### Success Header

```
┌─────────────────────────────────────────────────┐
│              ✅ Bill Split Complete!            │  ← Headline (40px)
│                     🎉                          │  ← Confetti animation
│                                                 │
│  Everyone's share calculated fairly            │  ← Subtext (16px)
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Gradient (green/5% → blue/5%)
- **Border**: Green/20% (success color)
- **Padding**: 48px
- **Checkmark**: Large green circle (64px)
- **Confetti**: 30 colored dots explode from center

**Confetti Animation**:
1. **0s**: Dots at center (invisible)
2. **0.2s**: Dots explode outward (random directions)
3. **0.5s**: Dots reach peak height
4. **1.5s**: Dots fall with gravity
5. **2s**: Dots fade out completely

**Purpose**: Celebrate completion, positive reinforcement

---

### Settlement Cards (The Money View)

Each transaction gets a card:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  👤 Sarah  ──────→  👤 Mike                    │  ← Avatars + arrow
│                                                 │
│            $23.45                               │  ← Amount (48px, bold)
│                                                 │
│     Sarah pays Mike                             │  ← Plain English (16px)
│                                                 │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Gradient (card/50% → green/5%)
- **Border**: 1px, border/40%
- **Border radius**: 16px
- **Padding**: 32px
- **Shadow**: Soft drop shadow

**Layout**:
- **Top**: Two avatars with arrow between
  - Avatar size: 64px
  - Arrow: 32px, gray
  - Gap: 24px between elements
  
- **Middle**: Huge dollar amount
  - Font: 48px, bold
  - Color: Green (money = positive)
  - Centered
  
- **Bottom**: Plain English explanation
  - Font: 16px, muted
  - Centered

**Hover Effect**:
- Card lifts (scale 1.02)
- Shadow deepens
- Border glows slightly
- **Feel**: Interactive, alive

### Settlement Card Variations

**Example 1: Simple Transaction**
```
👤 Sarah → 👤 Mike
     $23.45
Sarah pays Mike
```

**Example 2: All Square**
```
👤 Mike
   $0.00
Mike is all settled!
```
- **Background**: Blue tint (neutral)
- **Text**: "All settled!" (positive)

**Example 3: Mike Receives**
```
👤 Sarah → 👤 Mike
👤 Anna  → 👤 Mike
```
- Multiple cards if Mike receives from multiple people
- All cards stack vertically with 16px gap

---

### Breakdown Section (Collapsible Details)

**Collapsed** (default):
```
[▼ View Detailed Breakdown]
```

**Expanded** (click to open):
```
┌─────────────────────────────────────────────────┐
│  [▲ Hide Breakdown]                             │
│                                                 │
│  👤 Sarah's Share                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Caesar Salad                         $12.99   │
│  Iced Tea                              $3.50   │
│  Subtotal                             $16.49   │
│  Tax (proportional)                    $1.40   │
│  Tip (proportional)                    $2.47   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Total                                $20.36   │
│                                                 │
│  👤 Mike's Share                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Similar breakdown]                           │
│                                                 │
│  👤 Anna's Share                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Similar breakdown]                           │
└─────────────────────────────────────────────────┘
```

**Visual Design**:
- **Background**: Muted/10%
- **Padding**: 24px
- **Border radius**: 12px
- **Each person's section**: Separated by horizontal line

**Expand/Collapse Animation**:
- Smooth height transition (0.3s)
- Arrow rotates 180° (▼ → ▲)
- Content fades in/out

**Purpose**: 
- Transparency (show how amounts were calculated)
- Verification (users can check their items)
- Proof (in case of disputes)

---

### Export Buttons

Two big buttons side by side:

```
┌──────────────────┐  ┌──────────────────┐
│  📄 Download PDF │  │  📱 Share Image  │
└──────────────────┘  └──────────────────┘
```

### Download PDF Button

**Visual**:
- **Background**: Primary blue
- **Text**: White, 16px, semi-bold
- **Icon**: Document emoji (📄)
- **Size**: 200px wide, 56px height
- **Border radius**: 12px

**States**:

**Default**:
- Blue background
- White text
- Soft shadow

**Hover**:
- Background brightens 10%
- Grows 5% (scale 1.05)
- Shadow deepens

**Loading** (during PDF generation):
- Text: "Generating..."
- Spinner icon replaces document
- Background: Muted blue
- **Disabled** (can't click again)

**Click Action**:
1. Button shows "Generating..." (2s)
2. PDF library loads (lazy-loaded, 118kb)
3. PDF generates from summary data
4. Browser downloads file: "scantosplit-summary.pdf"
5. Button returns to normal
6. Toast: "✓ PDF downloaded!"

**PDF Content**:
- Page 1: Bill info, all items with assignments
- Page 2: Settlement cards (who pays whom)
- Page 3: Detailed breakdown per person
- Footer: "Generated by ScanToSplit.ai"

### Share Image Button

**Visual**:
- **Background**: White with blue border
- **Text**: Blue, 16px, semi-bold
- **Icon**: Phone emoji (📱)
- **Size**: 200px wide, 56px height

**States**: Similar to PDF button

**Click Action**:
1. Button shows "Creating image..." (1s)
2. Image library loads (lazy-loaded, 53kb)
3. Screenshot taken of summary card
4. Image optimized (PNG, ~100kb)
5. **Native share sheet opens** (mobile/desktop)
6. User selects: WhatsApp, Messages, Email, etc.
7. Button returns to normal

**Share Sheet** (mobile):
```
┌─────────────────────────────┐
│  Share via:                 │
│                             │
│  📱 Messages                │
│  💬 WhatsApp                │
│  ✉️ Email                   │
│  📋 Copy Link               │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

**Fallback** (desktop without share API):
- Image downloads as PNG
- Filename: "scantosplit-summary-Nov-18-2025.png"

---

### Action Bar (Bottom)

```
┌─────────────────────────────────────────────────┐
│  [← Back to Assignment]         [Split Another]│
└─────────────────────────────────────────────────┘
```

**Back Button** (left):
- Ghost style (transparent, border only)
- Click: Returns to /assignment
- **Purpose**: Make changes if needed

**Split Another Button** (right):
- Primary style (blue)
- Click: Confirms "Clear all data?" → Navigate to /setup
- **Purpose**: Start fresh bill

---

## 🎭 User Experience Flow (Assignment → Summary)

### Assignment Page Journey

**Step 1**: Arrive from Setup  
**See**: Progress at 2/3, participant palette, items  
**Action**: Select Sarah chip (turns blue)

**Step 2**: Tap Caesar Salad item  
**See**: Item shrinks, springs back, Sarah badge appears  
**Feel**: Satisfying click, immediate feedback

**Step 3**: Select Mike + Anna together  
**See**: Both chips glow blue  
**Action**: Tap 3 more items  
**See**: All 3 items now show Mike + Anna badges

**Step 4**: One expensive item needs custom split  
**See**: "Custom Split" button  
**Click**: Popover opens  
**Action**: Switch to "Percentage" tab, set 60/40  
**Click**: "Apply Split"  
**See**: Toast confirmation, popover closes

**Step 5**: All items assigned  
**See**: Continue button pulses, turns blue  
**Click**: "Continue to Summary"

### Summary Page Journey

**Step 1**: Page transition (fade + slide)  
**See**: Success header, confetti animation  
**Feel**: Achievement! Celebration!

**Step 2**: Scroll to settlement cards  
**See**: 2 cards (Mike receives from Sarah and Anna)  
**Understand**: Clear amounts, plain English

**Step 3**: Click "View Breakdown"  
**See**: Detailed per-person lists expand  
**Verify**: Sarah's items add up to $20.36 ✓

**Step 4**: Share with group  
**Click**: "Share Image"  
**See**: Native share sheet  
**Select**: WhatsApp  
**Action**: Send to group chat

**Step 5**: Everyone confirms received  
**Done**: Bill split complete! ✅

---

## 💡 Why Assignment & Summary Work

### Assignment Page

**Psychology**:
- **Visual selection**: Selecting people feels like a game
- **Immediate feedback**: Every tap confirms action
- **Flexibility**: Can assign, unassign, custom split easily
- **Progress**: Always see how many items left

**Design**:
- **Color coding**: Each person has unique color
- **Tactile**: Every interaction has scale effect
- **Clear states**: Selected vs unselected obvious
- **Forgiving**: Easy to undo mistakes

### Summary Page

**Psychology**:
- **Celebration**: Success header + confetti = positive reinforcement
- **Clarity**: Plain English ("Sarah pays Mike $23.45")
- **Trust**: Breakdown shows exactly how calculated
- **Action**: Export buttons obvious, ready to share

**Design**:
- **Hierarchy**: Big amounts, small details
- **Gradients**: Green = money/success
- **White space**: Not cluttered despite lots of info
- **Accessibility**: High contrast, large text

---

## 🎨 Visual Summary

**Assignment Page**:
- Top: Progress stepper (2/3)
- Second: Participant palette (select people)
- Third: Bill summary (context)
- Main: Items list (tap to assign)
- Bottom: Continue button (when ready)

**Summary Page**:
- Top: Success celebration
- Middle: Settlement cards (who owes what)
- Collapsible: Detailed breakdowns
- Bottom: Export buttons (PDF, image)
- Footer: Action bar (back, new bill)

**Overall Feel**: Like completing a level in a premium mobile game - smooth, rewarding, clear next steps.

---

**Next**: Part 5 covers Premium Patterns & Quality - the polish details that make everything feel expensive and professional.
