# Responsive Storytelling Landing Page - Master Plan

## 🎯 **Vision**
Transform the landing page into a cinematic, chapter-based storytelling experience that works flawlessly across all devices, including folding phones.

---

## 📱 **Device Matrix & Breakpoints**

### **Breakpoint Strategy**
```javascript
{
  // Phone - Folded (Cover Screen)
  phoneFoldedCover: '< 280px',      // Galaxy Z Flip cover (260x512)
  
  // Phone - Portrait
  phoneSmall: '280-374px',          // iPhone SE, small Android
  phone: '375-639px',               // iPhone 12-15 Pro (393px)
  phoneLarge: '640-767px',          // iPhone Pro Max, large Android
  
  // Folding Phones - Unfolded
  foldableSquare: '768-884px',      // Galaxy Z Flip unfolded (~854px wide)
  foldableWide: '885-1023px',       // Galaxy Z Fold unfolded (~884px)
  
  // Tablets
  tablet: '1024-1365px',            // iPad (1024/1180/1194), Android tablets
  tabletLarge: '1366-1919px',       // iPad Pro (1366/1668)
  
  // Desktop
  desktop: '1920-2559px',           // Standard monitors
  desktopLarge: '≥ 2560px'          // 4K, ultrawide
}
```

### **Special Considerations**

#### **Folding Phones:**
1. **Galaxy Z Fold (Unfolded: 7.6" - 884x2208px)**
   - Nearly square aspect ratio
   - Can run in multi-window mode
   - Needs tablet-like layout but narrower

2. **Galaxy Z Flip (Unfolded: 6.7" - 1080x2640px)**
   - Standard phone aspect when unfolded
   - Very tall (22:9 ratio)
   - Needs optimized vertical scrolling

3. **Cover Screens:**
   - Z Flip cover: 260x512px
   - Show minimal teaser or "Open phone to continue"

---

## 📖 **Chapter Structure**

### **6 Focused Chapters**

#### **Chapter 1: Hero - "The Hook"**
**Message:** Split bills instantly with AI  
**Duration:** 3-4 seconds attention grab  
**Layout:**
- Desktop: Center-aligned, full viewport
- Tablet: Same, slightly smaller text
- Phone: Vertical stack, larger CTA
- Foldable: Optimize for square aspect

**Elements:**
- Headline (animated word-by-word)
- Subheadline
- Primary CTA "Scan Your First Bill"
- Scroll hint (desktop) / Swipe hint (mobile)

---

#### **Chapter 2: The Problem - "Manual Splitting Sucks"**
**Message:** Show the pain of traditional splitting  
**Visual:** Before/after comparison

**Layouts:**
- Desktop: Split screen (pain left, solution right)
- Tablet: Vertical, pain above
- Phone: Swipeable cards (pain → solution)
- Foldable unfolded: Side-by-side like desktop

---

#### **Chapter 3: The Magic - "AI That Understands"**
**Message:** Watch AI scan and extract  
**Visual:** Animated receipt → clean list

**Layouts:**
- Desktop: Sticky scroll (current implementation)
- Tablet: Scroll-triggered fade
- Phone: Auto-play animation on enter
- Foldable: Hybrid (animation + scroll)

**States:**
1. Raw receipt (1s)
2. Scanning animation (2s)
3. AI processing (1s)
4. Clean list appears (hold)

---

#### **Chapter 4: The Power - "Advanced Splitting"**
**Message:** Multi-bill, custom splits, habit learning  
**Visual:** Interactive demo

**Layouts:**
- Desktop: Feature carousel (3 tabs)
- Tablet: Stacked cards
- Phone: Horizontal swipe between features
- Foldable unfolded: 2-column grid

**Sub-features:**
1. Multi-bill management
2. Custom split methods
3. Habit recognition

---

#### **Chapter 5: The Trust - "Social Proof"**
**Message:** Real users love it  
**Visual:** Testimonial cards

**Layouts:**
- Desktop: 3-column grid
- Tablet: 2-column grid
- Phone: Vertical stack or carousel
- Foldable: 2-column (compact cards)

---

#### **Chapter 6: The Closer - "Get Started"**
**Message:** 100% free, no friction  
**Visual:** Final CTA with benefits list

**Layouts:**
- All devices: Center-aligned, full-width CTA
- Desktop: Benefits in horizontal row
- Mobile: Benefits in vertical list

---

## 🎨 **Navigation System**

### **Desktop (≥1024px)**
```
Navigation: Scroll-based with snap
- Smooth scroll between chapters
- Dot navigation (fixed right sidebar)
- Keyboard arrows (↑/↓)
- Progress indicator (1 of 6)
- Auto-scroll on idle (subtle hint)
```

### **Tablet (768-1023px)**
```
Navigation: Hybrid
- Scroll with gentle snap
- Touch-friendly dots (bottom)
- Swipe gestures enabled
- Larger touch targets (min 48px)
```

### **Phone (< 768px)**
```
Navigation: Swipe-first
- Horizontal swipe between chapters
- Large "Next" button (bottom)
- Story-style progress (top bar)
- Optional vertical scroll within chapter
- Haptic feedback on chapter change
```

### **Foldable Unfolded**
```
Navigation: Device-aware
- Z Fold: Desktop-like (scroll)
- Z Flip: Phone-like (swipe)
- Orientation change handling
```

### **Foldable Cover Screen**
```
Content: Teaser only
- App logo
- Tagline
- "Open to explore →"
```

---

## 🏗️ **Component Architecture**

```
src/
├── features/
│   └── landing-v2/                    # New responsive landing
│       ├── LandingPageResponsive.tsx  # Main container
│       ├── hooks/
│       │   ├── useDeviceType.ts       # Detect device & breakpoint
│       │   ├── useChapterNavigation.ts # Navigate between chapters
│       │   ├── useScrollProgress.ts   # Track scroll position
│       │   └── useFoldableDetection.ts # Detect folding phones
│       ├── components/
│       │   ├── ChapterContainer.tsx   # Scroll/swipe wrapper
│       │   ├── ProgressIndicator.tsx  # Visual progress
│       │   ├── NavigationControls.tsx # Arrows, dots, buttons
│       │   └── ScrollHint.tsx         # Animated scroll prompt
│       └── chapters/
│           ├── Chapter1Hero/
│           │   ├── index.tsx
│           │   ├── HeroDesktop.tsx
│           │   ├── HeroTablet.tsx
│           │   ├── HeroMobile.tsx
│           │   └── HeroFoldable.tsx
│           ├── Chapter2Problem/
│           ├── Chapter3Magic/
│           ├── Chapter4Power/
│           ├── Chapter5Trust/
│           └── Chapter6Closer/
```

---

## 🎬 **Animation Strategy**

### **Chapter Transitions**

**Desktop:**
```javascript
{
  type: 'scroll-linked',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  duration: 800, // ms
  effect: 'fade + slide',
  direction: 'vertical'
}
```

**Mobile:**
```javascript
{
  type: 'gesture-based',
  easing: 'spring',
  stiffness: 350,
  damping: 30,
  effect: 'slide',
  direction: 'horizontal'
}
```

### **Within Chapter Animations**

**Entry (when chapter becomes active):**
```javascript
- Headline: Stagger words (0.05s delay each)
- Visual: Scale + fade (0.3s delay)
- CTA: Gentle bounce (0.5s delay)
```

**Exit (when leaving chapter):**
```javascript
- All: Fade out (0.2s)
- No complex exit animations (performance)
```

### **Reduced Motion Support**
```javascript
// All animations become instant fades
if (prefersReducedMotion) {
  transitions = { duration: 0.01 }
  springs = { type: 'tween', duration: 0.01 }
}
```

---

## 📐 **Layout Patterns**

### **Chapter Layout Grid**

**Desktop (≥1920px):**
```
┌────────────────────────────────────┐
│         Chapter Container          │
│  Max-width: 1400px                │
│  ┌──────────────┬───────────────┐ │
│  │   Content    │    Visual     │ │
│  │   (40%)      │    (60%)      │ │
│  │              │               │ │
│  └──────────────┴───────────────┘ │
└────────────────────────────────────┘
```

**Tablet (768-1023px):**
```
┌──────────────────┐
│     Chapter      │
│  Max-width: 90% │
│  ┌────────────┐ │
│  │  Content   │ │
│  └────────────┘ │
│  ┌────────────┐ │
│  │   Visual   │ │
│  └────────────┘ │
└──────────────────┘
```

**Phone (<768px):**
```
┌──────────┐
│ Chapter  │
│ Padding: │
│   24px   │
│ ┌──────┐ │
│ │ Text │ │
│ └──────┘ │
│ ┌──────┐ │
│ │Visual│ │
│ └──────┘ │
└──────────┘
```

**Foldable Unfolded (884px):**
```
┌──────────────┐
│   Chapter    │
│ ┌─────┬────┐ │
│ │Text │Vis │ │
│ │50%  │50% │ │
│ └─────┴────┘ │
└──────────────┘
```

---

## ⚡ **Performance Optimization**

### **Lazy Loading Strategy**
```javascript
// Only load current + adjacent chapters
{
  loaded: [currentChapter - 1, currentChapter, currentChapter + 1],
  preload: currentChapter + 2,
  unload: < currentChapter - 2
}
```

### **Image Optimization**
```javascript
// Responsive images per device
<picture>
  <source media="(max-width: 640px)" srcSet="receipt-mobile.webp" />
  <source media="(max-width: 1024px)" srcSet="receipt-tablet.webp" />
  <source media="(min-width: 1025px)" srcSet="receipt-desktop.webp" />
  <img src="receipt-fallback.jpg" alt="Receipt" />
</picture>
```

### **Animation Performance**
- Hardware acceleration: `transform: translateZ(0)` on animated elements ONLY
- `will-change` sparingly (add on interaction, remove after)
- Avoid animating: `width`, `height`, `margin`, `padding`
- Only animate: `transform`, `opacity`

---

## 🔧 **Technical Implementation**

### **Core Technologies**
1. **React Router** - URL-based navigation (`/#chapter-2`)
2. **Framer Motion** - Gestures, animations, layout
3. **React Intersection Observer** - Scroll triggers
4. **CSS Container Queries** - Component-level responsiveness
5. **View Transition API** - Smooth theme changes

### **Custom Hooks**

#### `useDeviceType()`
```typescript
return {
  type: 'phone' | 'foldableSquare' | 'foldableWide' | 'tablet' | 'desktop',
  breakpoint: string,
  isFoldable: boolean,
  isCoverScreen: boolean,
  orientation: 'portrait' | 'landscape',
  aspectRatio: number
}
```

#### `useChapterNavigation()`
```typescript
return {
  currentChapter: number,
  totalChapters: number,
  goToChapter: (n: number) => void,
  nextChapter: () => void,
  prevChapter: () => void,
  progress: number (0-100),
  canGoNext: boolean,
  canGoPrev: boolean
}
```

#### `useFoldableDetection()`
```typescript
return {
  isFoldable: boolean,
  foldState: 'folded' | 'unfolded' | 'half-folded',
  screenType: 'cover' | 'main',
  dimensions: { width, height },
  model: 'z-fold' | 'z-flip' | 'other'
}
```

---

## 🎯 **Accessibility Requirements**

### **Keyboard Navigation**
- `↑/↓` arrows: Navigate chapters (desktop)
- `Tab`: Focus interactive elements
- `Enter/Space`: Activate buttons
- `Esc`: Close modals/overlays

### **Screen Readers**
- `role="region"` on each chapter
- `aria-label` for navigation controls
- `aria-live="polite"` for chapter changes
- Skip navigation links

### **WCAG 2.1 AA Compliance**
- Contrast ratio ≥ 4.5:1 for text
- Touch targets ≥ 44x44px
- No animations if `prefers-reduced-motion`
- Focusable elements have visible focus ring

---

## 📊 **Success Metrics**

### **Performance Targets**
- Lighthouse Performance: ≥ 95
- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: < 0.1

### **User Experience**
- Bounce rate: < 30%
- Average time on page: > 45s
- Chapter completion rate: > 70%
- CTA click rate: > 15%

---

## 📝 **Implementation Phases**

### **Phase 1: Foundation (Days 1-2)**
✅ Create breakpoint system  
✅ Build device detection hooks  
✅ Set up chapter routing  
✅ Implement base ChapterContainer

### **Phase 2: Chapter Layouts (Days 3-4)**
✅ Build all 6 chapters (desktop layouts first)  
✅ Create responsive variants  
✅ Optimize for foldables  
✅ Add placeholder content

### **Phase 3: Navigation (Day 5)**
✅ Scroll-based navigation (desktop)  
✅ Swipe gestures (mobile)  
✅ Progress indicators  
✅ Keyboard controls

### **Phase 4: Animations (Day 6)**
✅ Chapter transitions  
✅ Content entrance animations  
✅ Interactive states  
✅ Reduced motion support

### **Phase 5: Polish (Days 7-8)**
✅ Performance optimization  
✅ Accessibility audit  
✅ Cross-device testing  
✅ Edge case handling

---

## 🧪 **Testing Checklist**

### **Devices to Test**
- [ ] iPhone SE (375px)
- [ ] iPhone 15 Pro (393px)
- [ ] iPhone 15 Pro Max (430px)
- [ ] Galaxy Z Flip (folded cover: 260px, unfolded: 1080px)
- [ ] Galaxy Z Fold (cover: 832px, unfolded: 884px)
- [ ] iPad (1024px)
- [ ] iPad Pro (1366px)
- [ ] Desktop 1920px
- [ ] Desktop 4K (2560px)

### **Scenarios**
- [ ] Portrait → Landscape rotation
- [ ] Folding/unfolding mid-navigation
- [ ] Slow network (3G simulation)
- [ ] Touch-only navigation
- [ ] Keyboard-only navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] Dark mode switching mid-scroll

---

## 🚀 **Launch Readiness**

### **Pre-Launch**
1. Analytics setup (chapter view tracking)
2. Error boundary on each chapter
3. Fallback content for JS disabled
4. Meta tags for social sharing

### **Post-Launch**
1. Monitor performance metrics
2. A/B test chapter order
3. Collect user feedback
4. Iterate on problematic chapters

---

## 📱 **Foldable-Specific Optimizations**

### **CSS Media Queries**
```css
/* Detect foldable devices */
@media (max-width: 884px) and (min-aspect-ratio: 1/1) {
  /* Galaxy Z Fold unfolded - square aspect */
}

@media (min-height: 2640px) {
  /* Galaxy Z Flip unfolded - very tall */
}

/* Detect fold/flex state (experimental) */
@media (horizontal-viewport-segments: 2) {
  /* Device is in dual-screen mode */
}
```

### **JavaScript Detection**
```javascript
// Visual Viewport API for fold detection
const isFoldable = window.visualViewport?.segments?.length > 1;

// Screen size + aspect ratio heuristics
const isZFold = width >= 820 && width <= 900 && aspectRatio >= 0.9;
const isZFlip = height >= 2500 && aspectRatio <= 0.5;
```

### **Layout Adjustments**
- **Z Fold (Unfolded):** Use tablet-like 2-column layout
- **Z Flip (Unfolded):** Optimize for vertical scrolling, taller chapters
- **Cover screens:** Show teaser or app icon only

---

**Document Version:** 1.0  
**Last Updated:** October 29, 2025  
**Status:** Ready for Implementation
