# ScanToSplit.ai - Project Vision & Product Specification

**Last Updated**: November 18, 2025  
**Project Type**: Premium Bill Splitting Web Application  
**Target Audience**: Friends, roommates, colleagues splitting bills together

---

## 📖 What We're Building

### The Problem We Solve

Imagine you're at a restaurant with 5 friends. The bill arrives with 20+ items. Some people had appetizers, some didn't drink alcohol, and someone is vegetarian. Now you need to figure out who owes what - including tax and tip split fairly.

**Current solutions are painful**:
- ❌ Manual calculator math (error-prone, takes forever)
- ❌ Splitting equally (unfair if people ordered different amounts)
- ❌ Existing apps (cluttered interfaces, confusing flows, no AI)

**Our solution**: Snap a photo of the receipt. AI reads everything. Tap items to assign them to people. Instantly see who owes what with tax and tip split fairly.

### The Magic Moment

1. **Snap**: Take photo of restaurant bill
2. **Wait 3 seconds**: AI extracts all items with prices
3. **Tap tap tap**: Select friends, tap items to assign them
4. **Done**: See exact amounts everyone owes, share via text/WhatsApp

**Total time**: 60 seconds instead of 10 minutes of awkward math.

---

## 🎯 Core Features

### 1. AI Receipt Scanning (The "Wow" Feature)

**What it does**: Upload a photo of any receipt (restaurant, grocery store, bar tab). AI instantly recognizes:
- Every item name ("Caesar Salad", "Heineken Beer")
- Every price ($12.99, $8.50)
- Store name and date
- Categories (food, drinks, alcohol)

**Why it's special**: No typing. No manual entry. Just snap and go. Works with receipts in any language, messy handwriting, crumpled paper.

**Technical magic**: Uses Google's latest AI (Gemini 1.5) that can understand images. Trained on millions of receipts.

### 2. Visual Assignment (The "Easy" Feature)

**What it does**: After scanning, you see all items as cards. You:
1. Add participant names ("Sarah", "Mike", "Anna")
2. Click participant chips to select them
3. Tap items to assign to selected people
4. Items show colored badges for who's assigned

**Why it's special**: No forms, no dropdowns. Pure visual interaction - like playing a game. See everything at a glance.

**Smart features**:
- Custom splits: Share one item 30-70% between two people
- Quick assignment: Select 3 people, tap 5 items = all assigned instantly
- Visual feedback: Items glow when you hover, shrink when you tap

### 3. Fair Settlement (The "Smart" Feature)

**What it does**: Calculates exactly who owes what, including:
- Proportional tax split (based on what you ordered)
- Proportional tip split (fair share based on food cost)
- Minimum transactions (if Mike owes Sarah $10, and Sarah owes Anna $10, we show Mike pays Anna directly)

**Why it's special**: Actually fair. If you only ordered a $15 salad, you don't pay the same tax as someone who had a $60 steak.

**Output**: Simple cards showing:
- "Sarah pays Mike $23.45"
- "Anna pays Mike $18.20"

### 4. Easy Sharing (The "Practical" Feature)

**What it does**: 
- Download PDF with full breakdown (for records)
- Share image via WhatsApp/text (visual summary everyone understands)
- Works on mobile and desktop

**Why it's special**: One tap to share. Everyone in the group gets the same info instantly. No screenshots, no typing.

---

## 🌟 The Premium Experience

### What Makes This "Premium"?

Think **Apple iPhone** meets **Revolut banking app**. Every detail is polished.

#### Visual Design: Glass & Light

**Glass Morphism** - Modern transparent cards that look like frosted glass:
- Semi-transparent backgrounds (you can see through slightly)
- Soft blur effect behind cards
- Subtle borders that glow on hover
- Smooth shadows that respond to light

**Example**: Item cards look like they're floating above the page. When you hover, they glow and lift slightly (like touching an iPhone button).

#### Smooth Animations: Everything Flows

**No sudden jumps** - every action has a smooth transition:
- Page changes fade smoothly (0.5 seconds)
- Items slide up when they appear (gentle bounce)
- Buttons scale when you hover (grow 5%, shrink 2% when pressed)
- Loading screens have elegant progress bars

**Feel**: Like using an iPhone - every interaction feels alive and responsive. Nothing jarring or robotic.

#### Generous Spacing: Room to Breathe

**Not cramped** - lots of white space:
- 48 pixels between sections (spacious)
- Cards have 24-32 pixel padding (comfortable)
- Text sizes scale from tiny (12px) to massive (72px headlines)

**Result**: Feels luxurious and easy to read. Never cluttered or overwhelming.

#### Smart Typography: Hierarchy That Guides You

**Different text sizes for different purposes**:
- **Massive hero titles** (72px) - "Split Bills Instantly with AI"
- **Big section headers** (48px) - "Bill Information"
- **Medium card titles** (24px) - Item names
- **Small helper text** (14px) - Instructions, hints

**Result**: Your eye naturally flows to important things first. Never confused about what's clickable or what's information.

#### Tactile Feedback: Feels Physical

**Every button responds to touch**:
- Hover: Grows 5% larger, shadow deepens
- Press: Shrinks 2% (like a real button being pushed)
- Release: Springs back to normal

**Accessibility**: If user has motion sensitivity (gets dizzy from animations), all motion automatically turns off.

#### Responsive Design: Works Everywhere

**Adapts to screen size**:
- **Phone** (iPhone): Single column, big touch targets
- **Tablet** (iPad): Two columns, more info visible
- **Laptop**: Three columns, full dashboard view
- **TV/Monitor**: Scales up beautifully

**No compromises**: Every screen size gets a perfect experience, not just "squeezed to fit".

---

## 🎨 Visual Style Guide (For Non-Technical People)

### Color Palette

**Light Mode** (daytime use):
- Pure white backgrounds
- Soft gray text (#4A4A4A)
- Vibrant blue accents (#4F8EF7) - for buttons, links
- Gentle shadows (barely visible, adds depth)

**Dark Mode** (nighttime use):
- Deep charcoal backgrounds (#0A0A0A)
- Crisp white text (#F5F5F5)
- Electric blue accents (#6BA4FF) - pops against dark
- Glowing shadows (subtle neon effect)

**Theme Switch**: One tap in header. Instant smooth transition between modes.

### Typography Philosophy

**"Scannable at a glance"** - inspired by Apple's marketing:
- Headlines: Bold, huge, impossible to miss
- Body text: Clear, comfortable to read (16-18px)
- Helper text: Small but not tiny (14px minimum)
- Numbers (prices): Big and bold - this is what matters

### Component Examples (Explained Simply)

#### Item Card
```
┌─────────────────────────────────────┐
│  🍔  Caesar Salad            $12.99 │  ← Glass effect card
│      Food > Salad                   │  ← Category tag
│      [Sarah] [Mike]                 │  ← Who's sharing it
│                              [⋮]    │  ← Edit menu
└─────────────────────────────────────┘
```
- Floats above page (glass effect)
- Emoji shows category visually
- Colored badges for people
- Hover = glows and lifts
- Tap = shrinks slightly (tactile)

#### Participant Chip
```
┌────────────┐
│   Sarah    │  ← Looks like a pill shape
└────────────┘
```
- Unselected: White with gray border
- Selected: Blue background, white text (clear visual state)
- Tap to toggle on/off
- Smooth color transition (0.2 seconds)

#### Settlement Card
```
┌─────────────────────────────────────┐
│  👤 Sarah  →  👤 Mike               │
│                                     │
│          $23.45                     │
│  Sarah pays Mike                    │
└─────────────────────────────────────┘
```
- Green gradient background (money/success)
- Huge price number (32px)
- Clear arrow showing direction
- Avatar images for people (optional)

---

## 📱 User Journey (Step by Step)

### Act 1: Landing Page (First Impression)

**User arrives at scantosplit.ai**

**What they see**:
1. **Massive headline**: "Split Bills Instantly with AI"
2. **Animated receipt**: Lottie animation showing a receipt being scanned (auto-plays)
3. **One big button**: "Get Started" (blue, prominent)
4. **Three feature cards**:
   - 🤖 AI Scanning - "Snap a photo, AI does the rest"
   - 👥 Smart Assignment - "Tap items to assign to people"
   - 💰 Fair Splits - "Tax and tip divided fairly"

**User action**: Clicks "Get Started" → Goes to Setup page

**Feel**: Confident. Clear value proposition. Sees it works in 3 seconds via animation.

### Act 2: Setup Page (The Work Happens)

**User lands on blank canvas**

#### Stage 1: Upload Receipt

**What they see**:
- Large dashed border area (looks like a drop zone)
- Cloud upload icon (24px, gray)
- Text: "Drop receipt image or click to browse"
- Three trust badges below:
  - ⚡ "AI extracts items in seconds"
  - 🔒 "Images deleted after processing"
  - 🌍 "Works with any language"

**User action**: 
- Drags receipt photo from phone/computer
- OR taps to open file picker

**What happens**:
1. Progress bar appears (smooth 0→100%)
2. Takes 3-5 seconds
3. Page smoothly transitions to Data Review

#### Stage 2: Review Data

**What they see** (after AI scan completes):

**Bill Information Card** (top):
- Store name (if detected): "Olive Garden"
- Date: "November 18, 2025"
- Big total: "$127.45"
- Glass effect, gradient background

**Items Section** (middle):
- Header: "Items (12)" with package icon
- 12 item cards in a list:
  - Each shows emoji, name, price
  - Category tag below name
  - Edit/delete menu (three dots)
- Smooth stagger animation (items appear one by one, 0.1s delay)

**Participants Section** (bottom):
- Header: "Participants (0)" with users icon
- Empty state: "Add people to split this bill"
- Big "+" button: "Add Participant"

**User action**: 
1. Reviews items (corrects any AI mistakes by tapping edit)
2. Clicks "+ Add Participant"
3. Types names: "Sarah", "Mike", "Anna"
4. Each appears as a card with colored avatar

**What happens**:
- Dialog pops up smoothly (slides from bottom on mobile)
- Keyboard auto-focuses in name field
- After typing, dialog closes with fade animation
- New participant card appears with smooth slide-up

**Continue Button** (bottom right):
- Big blue button: "Continue to Assignment"
- Disabled (gray) until at least 1 item and 2 participants exist
- Smooth color transition when it enables

### Act 3: Assignment Page (The Fun Part)

**What they see**:

**Top**: Progress stepper showing "Step 2 of 3" (colored dots)

**Participant Palette** (just below progress):
```
Select participants:
[Sarah]  [Mike]  [Anna]
```
- All chips start unselected (white background)
- User taps to select (turns blue)
- Can select multiple at once

**Bill Info Summary** (middle):
- Smaller version of bill info
- Shows subtotal, tax, tip

**Items List** (bottom):
- Same items as before
- But now clickable (cursor changes to pointer)
- Instructions: "Select participants above, then tap items to assign them"

**User action**:
1. Taps "Sarah" chip (turns blue)
2. Taps 3 items (each now shows [Sarah] badge)
3. Taps "Mike" and "Anna" chips together (both blue)
4. Taps 2 items (both now show [Mike] [Anna] badges)
5. For one expensive item ($45 steak), clicks "Custom Split" button:
   - Popover opens with 3 tabs: Equal / Percentage / Custom
   - Chooses "Percentage"
   - Sets Mike: 70%, Anna: 30%
   - Clicks "Apply Split"

**What happens**:
- Every tap has smooth feedback (item shrinks 1%, bounces back)
- Badges appear with smooth fade-in
- Item cards re-organize if needed (smooth layout animation)
- Custom split popover slides in from bottom (mobile) or appears below item (desktop)

**Continue Button**: "Continue to Summary" (enables when all items assigned)

### Act 4: Summary Page (The Relief)

**What they see**:

**Big Success Message** (top):
- Green checkmark icon
- "Bill Split Complete!"
- Confetti animation (subtle, 2 seconds)

**Settlement Cards** (middle):
```
┌─────────────────────────────┐
│  👤 Sarah → 👤 Mike         │
│                             │
│       $23.45                │
│  Sarah pays Mike            │
└─────────────────────────────┘

┌─────────────────────────────┐
│  👤 Anna → 👤 Mike          │
│                             │
│       $18.20                │
│  Anna pays Mike             │
└─────────────────────────────┘
```
- Only 2 cards (algorithm minimized from potentially 6 transactions)
- Each card has green gradient (success color)
- Huge price numbers

**Breakdown Accordion** (below):
- Collapsible section: "View Detailed Breakdown"
- Shows each person's items with prices
- Tax/tip breakdown by person
- Total per person

**Export Buttons** (bottom):
- "Download PDF" (blue, prominent)
- "Share Image" (white with border)

**User action**: 
1. Reviews amounts (everyone agrees it's fair)
2. Taps "Share Image"
3. Native share sheet opens (WhatsApp, Messages, Email options)
4. Sends to group chat

**What happens**:
- Button shows loading spinner (2 seconds)
- Image generates (screenshot of summary card)
- Share sheet slides up from bottom
- After sharing, button returns to normal
- Toast notification: "Summary shared!"

**Final feel**: Relief. Done. Fair. Easy to prove to friends (PDF/image).

---

## 🎯 Success Metrics (How We Know It Works)

### Speed Benchmarks

- **Initial load**: Under 2 seconds on 4G connection
- **AI scan**: 3-5 seconds for typical receipt
- **Page transitions**: 0.5 seconds (feels instant)
- **Button interactions**: 0.2 seconds response

### User Experience Goals

- **Time to complete**: 60 seconds for typical 4-person, 10-item bill
- **Error rate**: Under 5% AI recognition errors (user corrects easily)
- **Mobile usage**: 80%+ of users on phones (design mobile-first)
- **Repeat usage**: 40%+ of users return within 30 days

### Visual Quality Standards

- **Animation frame rate**: Locked 60fps (smooth as butter)
- **Design consistency**: Every card uses same glass pattern
- **Accessibility score**: 95+ on Google Lighthouse
- **Dark mode**: Perfect contrast ratios (WCAG AAA)

---

## 🌍 Who Is This For?

### Primary Users

1. **Young professionals** (25-35 years old)
   - Go to restaurants with friends regularly
   - Comfortable with tech but hate complexity
   - Want fair splits without awkwardness

2. **Roommates** (20-30 years old)
   - Share grocery bills
   - Split utilities and household items
   - Need ongoing settlement tracking

3. **Travelers** (any age)
   - Group trips with shared expenses
   - Multiple currencies (future feature)
   - Need records for reimbursement

### What They Value

- ⚡ **Speed**: No one wants to spend 10 minutes doing math
- 🎯 **Fairness**: Everyone pays their actual share
- 📱 **Mobile-first**: Most bills are split on the spot (restaurant table)
- 🔒 **Privacy**: No account required, no data stored
- 🌟 **Polish**: Feels premium, not janky

---

## 🚀 Key Differentiators (Why We're Better)

### vs. Splitwise
- ❌ Splitwise: Complex, requires accounts, tracking debts over time
- ✅ Us: One-time splits, instant, no signup

### vs. Venmo Groups
- ❌ Venmo: Manual amount entry, no receipt scanning
- ✅ Us: AI extracts everything, visual assignment

### vs. Calculator
- ❌ Calculator: Manual math, error-prone, no record
- ✅ Us: Automated, accurate, shareable proof

### vs. Tab (YC Company)
- ❌ Tab: Restaurant-specific, requires integration
- ✅ Us: Works with any receipt, universal

### Our Unique Advantage

**AI + Premium UX + Mobile-First** = Nobody else has this combination.

Most competitors have 1 or 2 of these. We nail all 3.

---

## 🎨 Design Inspiration (Visual References)

### Apple iOS Design Language

**What we borrowed**:
- Glass morphism cards (like iOS Control Center)
- Spring animations (bouncy but not cartoonish)
- SF Pro font family (clean, readable)
- Generous padding (nothing cramped)
- Subtle gradients (not garish)

**Example**: Our item cards look like iOS widgets - frosted glass, subtle shadows, smooth hover states.

### Revolut Banking App

**What we borrowed**:
- Bold display typography (huge numbers)
- Smart data visualization (settlement cards)
- Premium gradients (from card background to accent color)
- Proactive guidance (helper text everywhere)

**Example**: Our summary page uses Revolut's approach - huge transaction amounts, clear sender/receiver, green success colors.

### Linear (Project Management)

**What we borrowed**:
- Keyboard shortcuts (power users love this)
- Command palette (Cmd+K to search)
- Smooth page transitions (slide + fade)
- Progress indicators that feel natural

**Example**: Our progress stepper (3 dots at top) mimics Linear's issue states - clear, minimalist, always visible.

---

## 💡 Future Enhancements (Not in v1, But Planned)

### Smart Features
- 🧠 **Learn user preferences**: "You usually split alcohol separately"
- 📊 **Spending insights**: "You spent $240 on restaurants this month"
- 🔗 **Payment integration**: "Pay Sarah via Venmo" button
- 📅 **Recurring splits**: Save groups for weekly dinners

### Social Features
- 👥 **Groups**: Save friend groups ("College Crew", "Work Friends")
- 📜 **History**: See past splits, track who owes whom long-term
- 💬 **Comments**: "This was Mike's birthday dinner, he doesn't pay"
- ⭐ **Favorites**: Save common restaurants/stores

### Advanced Capabilities
- 💱 **Multi-currency**: Travel groups with EUR + USD
- 🌐 **Offline mode**: Scan receipts without internet, sync later
- 🔐 **Accounts (optional)**: Cloud sync across devices
- 🧾 **Expense reports**: Export for business reimbursement

---

## ✅ Quality Standards (Non-Negotiable)

### Performance
- Must load in under 2 seconds on 4G
- Every animation must be 60fps (no stuttering)
- Works offline after first load (PWA capabilities)

### Accessibility
- Keyboard navigation for every action
- Screen reader support (blind users can split bills)
- High contrast mode for vision impaired
- Motion can be disabled (no dizziness)

### Security
- No user data stored on servers
- Images deleted after AI processing
- All user input sanitized (prevent hacking)
- HTTPS only (encrypted connection)

### Browser Support
- Latest Chrome, Safari, Firefox, Edge
- iOS Safari (most common mobile browser)
- Android Chrome
- No Internet Explorer (it's dead)

---

## 📊 Technical Architecture (Simplified)

### How It Actually Works (Non-Technical Explanation)

**Frontend Only** (no backend/server):
- Everything runs in your browser
- Data stored locally on your device (like saving a note)
- Nothing sent to our servers except receipt images (deleted after 30 seconds)

**AI Processing**:
- Receipt images sent to Google's AI (Gemini)
- AI reads text in image, returns JSON data
- We parse data and display it nicely
- Total time: 3-5 seconds

**Data Storage**:
- Uses browser's "localStorage" (like browser cookies)
- Persists between sessions (close browser, come back, data still there)
- Cleared when you click "Start New Bill"
- No cloud storage, no accounts, no login

**Export Features**:
- PDF: Generated in browser using jsPDF library
- Image: Screenshot taken of summary card
- Both happen instantly on your device

---

## 🎯 Project Goals Summary

### What Success Looks Like

**For Users**:
- "That was so easy!" (vs. 10 minutes of math)
- "The app is beautiful" (premium feel)
- "It actually split things fairly" (proportional tax/tip)

**For Business**:
- 10,000 bills split in first month
- 4.8+ star rating on Product Hunt
- Featured in tech blogs ("Best bill splitting app")
- 40% return user rate

### Core Principles

1. **Speed over features**: Rather do 3 things perfectly than 10 things poorly
2. **Mobile-first**: 80% of usage is on phones
3. **No compromises on design**: Every pixel matters
4. **Accessible to all**: Grandma and Gen-Z should both succeed
5. **Privacy-first**: No accounts, no tracking, no creepiness

---

## 🎨 Brand Personality

**If this app were a person**:
- **Friendly**: Warm, helpful, never condescending
- **Confident**: "I've got this, don't worry"
- **Premium**: High standards, attention to detail
- **Efficient**: Respects your time
- **Trustworthy**: Transparent, honest, fair

**Voice & Tone**:
- Use simple words ("Split" not "Allocate", "Fair" not "Proportional")
- Short sentences (7-12 words average)
- Active voice ("Tap items" not "Items can be tapped")
- Friendly but professional (no excessive emojis, but some 👍)

**Messaging Examples**:
- ✅ "All set! Here's who owes what."
- ❌ "Transaction settlement matrix computed successfully."
- ✅ "Scan your receipt to get started"
- ❌ "Please upload an image file containing receipt data"

---

## 📝 Final Notes

This is a **premium product** that solves a **real problem** with **delightful design**.

Every detail matters:
- Animations must be smooth (60fps)
- Colors must be accessible (contrast ratios)
- Copy must be clear (no jargon)
- Flows must be intuitive (no instructions needed)

**Goal**: User opens app, completes task, closes app, tells friend "You have to try this app."

**North Star**: Would Apple build it this way? If not, refine.

---

**Built with care. Designed for humans. Powered by AI.** ✨
