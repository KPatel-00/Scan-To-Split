# Part 5: Premium Patterns & Quality Assurance

**Last Updated**: November 18, 2025  
**Status**: ✅ Fully Implemented  
**Estimated Reading Time**: 35 minutes

---

## 5.1 Glass Morphism Design System

### Core Pattern

**Background Composition**:
```tsx
// ✅ Standard glass morphism card
className="bg-card/50 backdrop-blur-sm border border-border/40 shadow-sm"

// ✅ With gradient overlay
className="bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm"

// ✅ Muted glass container
className="bg-muted/30 backdrop-blur-sm border border-border/20"
```

**Token Breakdown**:
- `bg-card/50` - 50% opacity card background (semi-transparent)
- `backdrop-blur-sm` - 4px blur on content behind element
- `border border-border/40` - 40% opacity border (subtle outline)
- `shadow-sm` - Subtle drop shadow (0 1px 2px)

### Applied Contexts

**1. PremiumItemCard** (`src/features/setup/components/PremiumItemCard.tsx`)
```tsx
<div className={cn(
  "group flex items-center gap-4 rounded-xl border p-4",
  "bg-card/50 backdrop-blur-sm shadow-sm",
  "transition-all duration-200",
  "hover:shadow-md hover:border-border/60"
)}>
```

**2. ParticipantsSection** (`src/features/setup/ParticipantsSection.tsx`)
```tsx
<div className="rounded-xl border border-border/40 bg-gradient-to-b from-muted/30 to-transparent p-6 backdrop-blur-sm">
```

**3. DataHub Section Headers** (`src/features/setup/DataHub.tsx`)
```tsx
<Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
```

**Why Glass Morphism?**
- ✅ **Depth**: Creates visual hierarchy without harsh shadows
- ✅ **Premium**: Associated with modern iOS/macOS design
- ✅ **Flexibility**: Works in light/dark themes
- ✅ **Performance**: Hardware-accelerated backdrop-filter

---

## 5.2 Tactile Feedback System

**File**: `src/lib/motion/tactile.ts` (225 lines)

### Core Tactile Presets

**1. buttonTactile** - Primary interactive elements
```typescript
export const buttonTactile = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};
```

**2. cardTactile** - Cards and panels
```typescript
export const cardTactile = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.99,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};
```

**3. subtleTactile** - Minimal feedback (badges, chips)
```typescript
export const subtleTactile = {
  hover: {
    scale: 1.03,
    y: -2,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  tap: {
    scale: 0.97,
    y: 0,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};
```

**4. iconTactile** - Icon buttons
```typescript
export const iconTactile = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.9,
    rotate: 0,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};
```

### safeTactile Wrapper (Accessibility)

**File**: `src/lib/motion/tactile.ts`

```typescript
/**
 * Wrap tactile feedback with reduced motion support
 * Returns empty object if user prefers reduced motion
 */
export function safeTactile(
  tactilePreset: { hover?: any; tap?: any },
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return {}; // No animations
  }
  return tactilePreset;
}
```

**Usage Example**:
```tsx
import { cardTactile, safeTactile } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function MyCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      {...safeTactile(cardTactile, prefersReducedMotion)}
      className="..."
    >
      {/* Card content */}
    </motion.div>
  );
}
```

### Applied Examples

**ParticipantCard** (Setup flow)
```tsx
<motion.div
  whileHover={prefersReducedMotion ? undefined : cardTactile.hover}
  whileTap={prefersReducedMotion ? undefined : cardTactile.tap}
  className="flex items-center gap-3 rounded-lg border p-3"
>
```

**Participant Palette** (Assignment page)
```tsx
<motion.button
  whileHover={prefersReducedMotion ? undefined : buttonTactile.hover}
  whileTap={prefersReducedMotion ? undefined : buttonTactile.tap}
  className={cn(
    "relative flex flex-col items-center gap-2 rounded-xl p-4",
    isSelected && "border-primary bg-primary/10"
  )}
>
```

---

## 5.3 Typography Hierarchy

**File**: `src/lib/typography.ts` (40+ variants)

### Display Scale (Hero Headlines)

```typescript
export const typography = {
  display: {
    // Hero headlines (landing page)
    xl: 'text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
    lg: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl',
    md: 'text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl',
    sm: 'text-xl font-bold tracking-tight sm:text-2xl md:text-3xl',
  },
};
```

**Usage**:
```tsx
<h1 className={typography.display.xl}>
  Split Bills Instantly. Just Scan the Receipt.
</h1>
```

### Heading Scale (Section Headers)

```typescript
heading: {
  h1: 'text-3xl font-bold tracking-tight md:text-4xl',
  h2: 'text-2xl font-bold tracking-tight md:text-3xl',
  h3: 'text-xl font-semibold tracking-tight md:text-2xl',
  h4: 'text-lg font-semibold tracking-tight md:text-xl',
  h5: 'text-base font-semibold tracking-tight md:text-lg',
  h6: 'text-sm font-semibold tracking-tight md:text-base',
},
```

### Body Scale (Paragraphs)

```typescript
body: {
  xl: 'text-xl leading-relaxed',
  lg: 'text-lg leading-relaxed',
  lgMuted: 'text-lg leading-relaxed text-muted-foreground',
  base: 'text-base leading-normal',
  sm: 'text-sm leading-normal',
  xs: 'text-xs leading-tight',
},
```

### Responsive Pattern

**Mobile-First Progression**:
```
text-4xl (default - mobile 375px)
  ↓
sm:text-5xl (640px+)
  ↓
md:text-6xl (768px+)
  ↓
lg:text-7xl (1024px+)
```

**Why This Works**:
- ✅ **Readability**: Smaller on mobile (limited space), larger on desktop
- ✅ **Performance**: No JavaScript, pure CSS breakpoints
- ✅ **SSR-Safe**: Static classes at build time

---

## 5.4 Responsive Breakpoint Strategy

**File**: `tailwind.config.js`

### Custom Breakpoints

```javascript
screens: {
  'xs': '414px',    // Phone Standard (iPhone 14, Pixel 7)
  'sm': '640px',    // Phone Large (Pro Max)
  'md': '768px',    // Tablet Portrait / Fold Landscape
  'lg': '1024px',   // Tablet Landscape / Desktop
  'xl': '1366px',   // Desktop Standard
  '2xl': '1920px',  // Large Desktop / 4K
}
```

### Custom Variants (Orientation)

```javascript
plugin(function({ addVariant }) {
  addVariant('portrait', '@media (orientation: portrait)');
  addVariant('landscape', '@media (orientation: landscape)');
  
  // Fold-specific (Samsung Galaxy Z Fold)
  addVariant('fold-v', '@media (max-width: 884px) and (orientation: portrait)');
  addVariant('fold-h', '@media (max-height: 884px) and (orientation: landscape)');
}),
```

### Responsive Patterns

**1. Mobile-First Layout**
```tsx
// ✅ Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row gap-4">
  <div>Left Column</div>
  <div>Right Column</div>
</div>
```

**2. Responsive Grid**
```tsx
// ✅ 1 column → 2 columns → 3 columns → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

**3. Conditional Visibility**
```tsx
// ✅ Mobile-only badge
<div className="md:hidden">
  <Badge>Mobile Only</Badge>
</div>

// ✅ Desktop-only sidebar
<aside className="hidden lg:block">
  <Sidebar />
</aside>
```

**4. Responsive Spacing**
```tsx
// ✅ Padding scales with viewport
<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
  <Content />
</div>
```

**5. Orientation-Aware**
```tsx
// ✅ Stack in portrait, row in landscape (tablets)
<div className="flex flex-col landscape:flex-row">
  <Image />
  <Text />
</div>
```

### DataHub Example (Tabs Mobile, Columns Desktop)

```tsx
const isMobile = useMediaQuery('(max-width: 767px)');

{isMobile ? (
  // Mobile: Tabs Layout
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="items">Items</TabsTrigger>
      <TabsTrigger value="people">People</TabsTrigger>
    </TabsList>
    <TabsContent value="items">
      <ItemsManagementSection />
    </TabsContent>
    <TabsContent value="people">
      <ParticipantsSection />
    </TabsContent>
  </Tabs>
) : (
  // Desktop: Side-by-Side with Sticky
  <div className="grid grid-cols-3 gap-8">
    <div className="col-span-2">
      <ItemsManagementSection />
    </div>
    <div className="col-span-1">
      <div className="sticky top-24">
        <ParticipantsSection />
      </div>
    </div>
  </div>
)}
```

---

## 5.5 Accessibility Standards

### Reduced Motion Support

**Hook**: `src/hooks/useReducedMotion.ts`

```typescript
/**
 * Detect OS-level "Reduce Motion" preference
 * Returns true if user has enabled reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

**Usage in Components**:
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? { opacity: 1 } // No animation
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      Content
    </motion.div>
  );
}
```

### ARIA Labels & Semantic HTML

**Navigation Landmarks**:
```tsx
<header role="banner">
  <AppHeader />
</header>

<main id="main-content" role="main">
  {/* Page content */}
</main>

<footer role="contentinfo">
  <AppFooter />
</footer>
```

**Interactive Elements**:
```tsx
// ✅ Proper button semantics
<button
  aria-label="Delete item"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <Trash className="h-4 w-4" />
</button>
<span id="delete-description" className="sr-only">
  Permanently remove this item from the bill
</span>

// ✅ Loading states
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

**Live Regions** (for dynamic content):
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

### Keyboard Navigation

**Focus Indicators**:
```css
/* Global focus ring (index.css) */
*:focus-visible {
  @apply ring-2 ring-ring ring-offset-2 ring-offset-background outline-none;
}
```

**Tab Order**:
```tsx
// ✅ Skip to main content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
  Skip to main content
</a>
```

**Keyboard Handlers**:
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Clickable Div
</div>
```

### Color Contrast

**Minimum Ratios** (WCAG AA):
- **Normal text**: 4.5:1
- **Large text** (18px+ or 14px+ bold): 3:1
- **UI components**: 3:1

**Verified Combinations**:
```tsx
// ✅ Primary text on background (>7:1)
className="text-foreground"

// ✅ Muted text on background (>4.5:1)
className="text-muted-foreground"

// ✅ Primary button (>4.5:1)
className="bg-primary text-primary-foreground"

// ❌ Insufficient contrast (avoid)
className="text-gray-400 on bg-white" // Only 2.8:1
```

---

## 5.6 Animation Performance

### GPU-Accelerated Properties

**✅ ALWAYS Animate**:
- `transform` (translate, scale, rotate)
- `opacity`

**❌ NEVER Animate**:
- `width` / `height` (causes layout thrashing)
- `left` / `top` (use `transform: translate()` instead)
- `margin` / `padding` (causes reflow)

### Correct Animation Examples

```tsx
// ✅ Smooth fade + slide (GPU-accelerated)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// ✅ Scale animation
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>

// ❌ WRONG - Animating width (layout thrashing)
<motion.div
  initial={{ width: 0 }}
  animate={{ width: '100%' }}
>

// ✅ CORRECT - Use scaleX instead
<motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  style={{ transformOrigin: 'left' }}
>
```

### Layout Animations (Magic Motion)

**Framer Motion `layout` Prop**:
```tsx
// ✅ Auto-animate position changes
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      layout // Automatically animates to new position
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
```

**Requirements**:
- Parent needs `position: relative` (Tailwind: `relative`)
- Children need unique `key` prop
- Wrap in `<AnimatePresence>` for enter/exit animations

---

## 5.7 Pre-Commit Quality Checklist

**File**: `docs/core/PRE_COMMIT_CHECKLIST.md` (261 lines)

### Automated Checks

**1. TypeScript Compilation**
```bash
npm run build
```
✅ MUST pass with zero errors

**2. ESLint**
```bash
npm run lint
```
✅ MUST pass with zero warnings

### Manual Checks (40+ items)

**Code Quality**:
- [ ] No `console.log()` statements
- [ ] No commented code blocks
- [ ] All imports use `@/` alias (no `../../../`)
- [ ] Files in correct directory (features/ vs components/)
- [ ] Proper file naming (PascalCase components, camelCase utils)

**Design System Compliance**:
- [ ] All colors from CSS variables (no `bg-[#hex]`)
- [ ] Typography from `typography.ts` (no inline text classes)
- [ ] All animations use named presets from `@/lib/motion/`
- [ ] 4px spacing grid (all margins/paddings multiples of 4)
- [ ] Icons from lucide-react only

**Security & Performance**:
- [ ] All user input sanitized with `sanitizeInput()`
- [ ] No `any` types (proper TypeScript everywhere)
- [ ] No hardcoded API keys (use environment variables)
- [ ] Images optimized and compressed
- [ ] No unnecessary re-renders (fine-grained Zustand selectors)

**Accessibility**:
- [ ] `useReducedMotion()` checked for all animations
- [ ] Keyboard navigation works (test with Tab key)
- [ ] Proper ARIA labels on interactive elements
- [ ] Color contrast sufficient (4.5:1 minimum)
- [ ] Focus indicators visible

**Component Standards**:
- [ ] JSDoc header with description
- [ ] Props properly typed (no missing interfaces)
- [ ] Usage examples in file comments
- [ ] Variants clearly documented
- [ ] Error boundaries where needed

**State Management**:
- [ ] Fine-grained selectors (not `useStore()` entire store)
- [ ] Actions in correct slice (domain-appropriate)
- [ ] No duplicate state across slices
- [ ] Hydration handled with `useHydration()` if needed

**Testing**:
- [ ] Tested in browser (zero console errors/warnings)
- [ ] Tested light/dark theme (both modes work)
- [ ] Tested mobile viewport (responsive design works)
- [ ] Tested with reduced motion (animations disabled)
- [ ] Tested edge cases (empty states, max limits, errors)

---

## 5.8 Performance Optimization Summary

### Bundle Splitting Results

**Before Optimization** (Oct 29, 2025):
```
Total: 622 kB gzipped
- React vendor: 143 kB
- App code: 479 kB (monolithic)
```

**After Optimization** (Oct 31, 2025):
```
Total initial: 214 kB gzipped (65% reduction)
Lazy-loaded chunks:
- pdf-export: 118 kB gzipped (jsPDF)
- image-export: 53 kB gzipped (html-to-image)
- ai-scanning: 6.32 kB gzipped (@google/generative-ai)
```

### Optimization Strategies

**1. Route-Based Code Splitting**
```tsx
// src/App.tsx
const Landing = lazy(() => import('./pages/Landing'));
const Setup = lazy(() => import('./pages/Setup'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Summary = lazy(() => import('./pages/Summary'));
```

**2. Manual Chunk Configuration**
```javascript
// vite.config.ts
manualChunks: {
  'pdf-export': ['jspdf'],
  'image-export': ['html2canvas', 'html-to-image'],
  'ai-scanning': ['@google/generative-ai'],
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'motion': ['framer-motion'],
  'ui-vendor': [
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    // ... all Radix UI primitives
  ],
}
```

**3. Dynamic Imports**
```typescript
// Lazy-load PDF export (saves 118 kB)
const { default: jsPDF } = await import('jspdf');

// Lazy-load AI scanning (saves 6.32 kB)
const { scanReceiptsClient } = await import('@/lib/scanReceiptsClient');
```

### Loading Performance

**Initial Page Load**:
- Landing page: ~214 kB gzipped
- First Contentful Paint: <1s
- Time to Interactive: <2s

**Lazy-Loaded Features** (only download on user action):
- PDF export: Click "Download PDF" → 118 kB
- Image export: Click "Share Image" → 53 kB
- AI scanning: Upload receipt → 6.32 kB

---

## 5.9 Testing Strategy

### Browser Testing

**Supported Browsers**:
- Chrome 90+ (primary target)
- Firefox 88+
- Safari 14+ (iOS/macOS)
- Edge 90+

**Test Matrix**:
```
✅ Chrome Desktop (Windows/macOS/Linux)
✅ Safari Desktop (macOS)
✅ Safari Mobile (iOS 15+)
✅ Chrome Mobile (Android)
✅ Samsung Internet (Android)
```

### Device Testing

**Physical Devices**:
- iPhone 14 Pro (iOS 17)
- Samsung Galaxy S23 (Android 14)
- iPad Pro 12.9" (iPadOS 17)
- Samsung Galaxy Z Fold 5 (Android 14)

**Responsive Viewports** (Chrome DevTools):
```
✅ 375×667 (iPhone SE)
✅ 390×844 (iPhone 14)
✅ 393×851 (Pixel 7)
✅ 768×1024 (iPad)
✅ 1366×768 (Desktop)
✅ 1920×1080 (Large Desktop)
```

### Feature Testing Checklist

**Receipt Scanning**:
- [ ] Upload 1 receipt
- [ ] Upload 3 receipts (max)
- [ ] Invalid file type rejection
- [ ] Large file handling (>10MB)
- [ ] Network error recovery

**Item Management**:
- [ ] Add manual item
- [ ] Edit item (name, price, quantity)
- [ ] Delete item with undo
- [ ] Category assignment
- [ ] Search/filter items

**Participant Management**:
- [ ] Add participant with sanitized name
- [ ] Edit participant color
- [ ] Delete participant (reassign items)
- [ ] Duplicate name prevention

**Assignment Flow**:
- [ ] Select participants in palette
- [ ] Quick assign to selected
- [ ] Assign to all
- [ ] Custom split (amount/percentage/shares)
- [ ] Unassign participant

**Settlement Calculations**:
- [ ] Correct proportional tax/tip
- [ ] Minimum transactions algorithm
- [ ] Everyone even state
- [ ] Negative balances displayed correctly

**Export Features**:
- [ ] PDF download (merged mode)
- [ ] PDF download (separate mode)
- [ ] Image share (Web Share API)
- [ ] Image download fallback

**Theme Switching**:
- [ ] Light mode colors correct
- [ ] Dark mode colors correct
- [ ] Smooth transition animation
- [ ] Persisted across sessions

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Reduced motion disables animations
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## Summary: Premium Patterns & Quality Checklist

✅ **Glass Morphism**: `bg-card/50 backdrop-blur-sm` pattern across cards  
✅ **Tactile Feedback**: 4 presets (button, card, subtle, icon) with safeTactile wrapper  
✅ **Typography**: 40+ variants from `typography.ts`, mobile-first responsive scales  
✅ **Responsive Design**: 6 breakpoints + orientation variants, mobile-first strategy  
✅ **Accessibility**: useReducedMotion, ARIA labels, keyboard navigation, 4.5:1 contrast  
✅ **Animation Performance**: GPU-accelerated (transform/opacity only), layout animations  
✅ **Pre-Commit Checklist**: 40+ manual checks + automated TypeScript/ESLint  
✅ **Performance**: 65% bundle reduction (622kb → 214kb gzipped initial load)  
✅ **Testing**: Browser matrix, device testing, 50+ feature test cases  

---

**Blueprint Complete**: All 5 parts documented (~5200 lines total)

**Part 1**: Foundation & Core Systems (950 lines)  
**Part 2**: Landing Page & App Shell (900 lines)  
**Part 3**: Setup Flow (Bill & Participants) (1200 lines)  
**Part 4**: Assignment & Summary (Export Features) (1100 lines)  
**Part 5**: Premium Patterns & Quality Assurance (800 lines)  

✅ **Ready for Production Deployment**
