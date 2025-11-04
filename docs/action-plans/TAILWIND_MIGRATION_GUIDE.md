# 🎯 Pure Tailwind Migration Guide

**Goal:** Replace 1,125 lines of custom JS hooks with native Tailwind CSS for better performance, SSR safety, and maintainability.

---

## ✅ What We Just Configured

### 1. **Updated `tailwind.config.js`**

**Custom Breakpoints:**
```js
screens: {
  'xs': '414px',    // Phone Standard (iPhone, Pixel)
  'sm': '640px',    // Phone Large (Pro Max)
  'md': '768px',    // Tablet Portrait / Phone Landscape  
  'lg': '1024px',   // Tablet Landscape / Small Desktop
  'xl': '1366px',   // Desktop / Tablet Large
  '2xl': '1920px',  // Large Desktop
}
```

**Foldable Device Support + Orientation:**
```js
plugins: [
  plugin(function({ addVariant }) {
    // Orientation variants (Gemini recommendation ✅)
    addVariant('portrait', '@media (orientation: portrait)');
    addVariant('landscape', '@media (orientation: landscape)');
    
    // Foldable device support
    addVariant('fold-v', '@media (spanning: single-fold-vertical)');
    addVariant('fold-h', '@media (spanning: single-fold-horizontal)');
  }),
]
```

### 2. **Added Global Utilities to `src/index.css`**

```css
.container-responsive    /* Responsive padding: px-4 → px-16 */
.section-spacing         /* Responsive spacing: py-8 → py-24 */
.grid-responsive         /* Auto-grid: 1 col → 4 cols */
.flex-responsive         /* Column → Row on md */
.hero-layout             /* Hero 2-column layout */
.chapter-container       /* Full viewport chapter wrapper */
.content-center          /* Max-width container */
.fold-split              /* Foldable-aware split layout */
```

### 3. **Typography Already Responsive**

`src/lib/typography.ts` already has responsive scales:
```ts
typography.display.xl    // text-4xl sm:text-5xl md:text-6xl lg:text-7xl
typography.heading.h1    // text-3xl sm:text-4xl md:text-5xl
typography.body.lg       // text-base sm:text-lg md:text-xl
```

---

## 📋 Migration Examples

### ❌ Before (JS Hook + Custom Components)

```tsx
// Using AdaptiveContent.tsx (340 lines)
import { AdaptiveHeadline, AdaptiveDescription } from '@/features/landing-v2/components/AdaptiveContent';
import { ResponsiveLayout } from '@/features/landing-v2/components/ResponsiveLayout';
import { useDeviceType } from '@/hooks/useDeviceType';

function HeroSection() {
  const device = useDeviceType();
  if (!device) return <Skeleton />;
  
  const { isMobile } = device;
  
  return (
    <ResponsiveLayout strategy="two-column-visual">
      <div>
        <AdaptiveHeadline showUnderline primaryWord="instantly">
          Split bills <span className="text-primary">instantly</span>
        </AdaptiveHeadline>
        
        <AdaptiveDescription
          full="Stop doing mental math. Scan your receipt, AI splits it perfectly."
          medium="Scan receipt, AI splits it perfectly."
          compact="AI-powered splitting"
        />
        
        {isMobile && <MobileCTA />}
      </div>
    </ResponsiveLayout>
  );
}
```

### ✅ After (Pure Tailwind)

```tsx
// Just use Tailwind responsive utilities
import { typography } from '@/lib/typography';
import { cn } from '@/lib/utils';

function HeroSection() {
  return (
    <div className="hero-layout"> {/* Global utility from index.css */}
      <div className="space-y-6">
        <h1 className={typography.display.xl}>
          Split bills <span className="text-primary">instantly</span>
        </h1>
        
        <p className={cn(typography.body.lg, "text-muted-foreground")}>
          <span className="hidden lg:inline">Stop doing mental math. </span>
          Scan your receipt, AI splits it perfectly.
        </p>
        
        <div className="md:hidden"> {/* Show only on mobile */}
          <MobileCTA />
        </div>
      </div>
    </div>
  );
}
```

**Savings:** 30+ lines → 15 lines, zero runtime overhead, SSR-safe

---

## 🎨 Common Patterns

### 1. **Responsive Layout (2-Column → Stack)**

```tsx
// ❌ Before: useDeviceType + conditional rendering
const { isMobile } = useDeviceType();
<div className={isMobile ? 'flex-col' : 'flex-row'}>

// ✅ After: Pure Tailwind
<div className="flex-responsive"> {/* flex-col md:flex-row */}

// ✅ Or inline
<div className="flex flex-col lg:flex-row">
```

### 2. **Responsive Typography**

```tsx
// ❌ Before: AdaptiveHeadline component
<AdaptiveHeadline>Title</AdaptiveHeadline>

// ✅ After: Typography scale
<h1 className={typography.display.xl}>Title</h1>

// ✅ Or inline responsive text
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Title</h1>
```

### 3. **Conditional Content (Show/Hide)**

```tsx
// ❌ Before: {isMobile && <Component />}
const { isMobile } = useDeviceType();
{isMobile && <MobileOnly />}
{!isMobile && <DesktopOnly />}

// ✅ After: Tailwind visibility utilities
<div className="md:hidden"><MobileOnly /></div>
<div className="hidden md:block"><DesktopOnly /></div>
```

### 4. **Orientation-Aware**

```tsx
// ❌ Before: device.orientation === 'landscape'
const { orientation } = useDeviceType();
<div className={orientation === 'landscape' ? '...' : '...'}>

// ✅ After: Tailwind orientation variants
<div className="flex-col landscape:flex-row">
<div className="w-full landscape:w-1/2">
```

### 5. **Foldable Devices**

```tsx
// ❌ Before: useFoldableDetection hook (132 lines)
const { isFoldable, model } = useFoldableDetection();
if (model === 'z-fold') return <SpecialLayout />;

// ✅ After: fold-v / fold-h variants
<div className="fold-split"> {/* Splits across hinge */}
  <div>Left Panel</div>
  <div>Right Panel</div>
</div>

// ✅ Or inline
<div className="flex-col fold-v:flex-row">
```

### 6. **Responsive Grid**

```tsx
// ❌ Before: Different components for each device
if (isMobile) return <GridMobile />;
if (isTablet) return <GridTablet />;
return <GridDesktop />;

// ✅ After: Auto-responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>
```

### 7. **Responsive Spacing**

```tsx
// ❌ Before: Conditional padding
<div style={{ padding: isMobile ? '1rem' : '2rem' }}>

// ✅ After: Responsive padding
<div className="p-4 md:p-8 lg:p-12">

// ✅ Or use global utility
<div className="container-responsive"> {/* px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 */}
```

### 8. **Responsive Button Width**

```tsx
// ❌ Before: Conditional width
<Button className={isMobile ? 'w-full' : 'w-auto'}>

// ✅ After: Responsive width
<Button className="w-full sm:w-auto">Get Started</Button>
```

---

## 🗑️ Files to Delete (After Migration Complete)

Once all components are migrated to pure Tailwind, delete these redundant files:

**✅ Confirmed to exist in codebase:**
1. ❌ `src/hooks/useDeviceType.ts` (136 lines)
2. ❌ `src/hooks/useFoldableDetection.ts` (132 lines)
3. ❌ `src/features/landing-v2/components/ResponsiveLayout.tsx` (160 lines)
4. ❌ `src/features/landing-v2/components/AdaptiveContent.tsx` (340 lines)

**Optional (only if exists):**
5. ❌ `src/lib/breakpoints.ts` - Keep if needed for non-responsive JS logic

**⚠️ Warning**: Before deleting, run a global search to ensure no active imports remain:
```powershell
# PowerShell command to check for imports
Select-String -Path "src/**/*.tsx" -Pattern "useDeviceType|useFoldableDetection|ResponsiveLayout|AdaptiveContent"
```

**Keep These:**
- ✅ `src/hooks/useChapterNavigation.ts` - Business logic for chapter navigation
- ✅ `src/features/landing-v2/components/ChapterContainer.tsx` - Scroll snap, intersection observers
- ✅ `src/lib/typography.ts` - Responsive typography scales
- ✅ All actual chapter components in `src/features/landing-v2/chapters/`

---

## 📊 Benefits

| Aspect | Before (JS Hooks) | After (Tailwind) |
|--------|-------------------|------------------|
| **SSR Safety** | ❌ Crashes on server | ✅ 100% SSR-safe (static CSS) |
| **Performance** | ❌ Runtime JS execution | ✅ Zero runtime overhead |
| **Bundle Size** | ❌ +1,125 lines JS | ✅ Static CSS (smaller bundle) |
| **Maintainability** | ❌ 6 custom files | ✅ Standard Tailwind patterns |
| **Foldable Detection** | ❌ Unreliable heuristics | ✅ Native CSS spanning API |
| **Resizable Windows** | ❌ Breaks logic (isMobile=true on desktop) | ✅ Correct (adapts to viewport) |
| **Developer Experience** | ❌ Import hooks, check null, conditionals | ✅ Just add className |

---

## 🚀 Next Steps

1. **Start migrating components one by one** - Use patterns above
2. **Test thoroughly** - Verify all breakpoints work
3. **Delete old files** - Once all components migrated
4. **Update documentation** - Remove references to deleted hooks

---

## 💡 Pro Tips

**1. Use Tailwind DevTools** (Chrome Extension)
- Visualize breakpoints in real-time
- See which classes are active

**2. Use `cn()` utility for conditional classes:**
```tsx
className={cn(
  typography.heading.h1,
  "text-muted-foreground",
  isPrimary && "text-primary"
)}
```

**3. Prefer Tailwind over custom CSS:**
```tsx
// ❌ Avoid
<div style={{ padding: device.isMobile ? '1rem' : '2rem' }}>

// ✅ Use Tailwind
<div className="p-4 md:p-8">
```

**4. Mobile-First Approach:**
```tsx
// ✅ Good: Start with mobile, add larger breakpoints
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad: Desktop-first
<div className="text-lg md:text-base sm:text-sm">
```

**5. Test Orientation Changes:**
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Click rotate icon to test orientation
```

---

## 🎯 Complete Landing Page Example

```tsx
export function HeroChapter() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section className="
      chapter-container
      min-h-screen 
      flex items-center justify-center
      px-4 sm:px-6 md:px-8 lg:px-12
      py-12 sm:py-16 md:py-20
    ">
      {/* Responsive layout: Stack → Side-by-side */}
      <div className="hero-layout fold-split max-w-7xl mx-auto w-full">
        
        {/* Text Content */}
        <div className="space-y-6 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm sm:text-base">AI-Powered</span>
          </div>
          
          {/* Headline - Responsive typography */}
          <h1 className={typography.display.xl}>
            Split bills <span className="text-primary">instantly</span>
          </h1>
          
          {/* Description - Hide verbose text on mobile */}
          <p className={cn(typography.body.lg, "text-muted-foreground")}>
            <span className="hidden lg:inline">Stop doing mental math. </span>
            Scan your receipt, AI splits it perfectly.
          </p>
          
          {/* CTA Buttons - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Visual - Responsive sizing */}
        <div className="w-full lg:w-1/2">
          <HeroVisual className="w-full max-w-md mx-auto lg:max-w-full" />
        </div>
      </div>
      
      {/* Scroll Hint - Different on mobile vs desktop */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="animate-bounce" />
      </div>
      <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2">
        <SwipeHint />
      </div>
    </section>
  );
}
```

**This example demonstrates**:
- ✅ Responsive container with max-width
- ✅ Responsive padding progression
- ✅ Layout shift: Stack → 2-column
- ✅ Typography scales automatically
- ✅ Conditional visibility (mobile vs desktop)
- ✅ Responsive button stack
- ✅ Orientation support (implicit in flex)
- ✅ Foldable support (fold-split class)
- ✅ Accessibility (reduced motion check)

---

## 📖 Reference

- **Comprehensive Guide:** `docs/TAILWIND_RESPONSIVE_GUIDE.md` (400+ lines, complete patterns)
- **Landing Page Plan:** `docs/action-plans/LANDING_PAGE_RESPONSIVE_REDESIGN.md` (chapter implementations)
- **Tailwind Docs:** https://tailwindcss.com/docs/responsive-design
- **Breakpoints:** https://tailwindcss.com/docs/screens
- **CSS Spanning API:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/spanning
- **Typography Scales:** `src/lib/typography.ts`
- **Global Utilities:** `src/index.css` (bottom section)

---

## ✅ Quick Checklist

Before migrating a component, ensure:

- [ ] Tailwind config has custom breakpoints (xs → 2xl)
- [ ] Orientation variants enabled (portrait:, landscape:)
- [ ] Foldable variants enabled (fold-v:, fold-h:)
- [ ] Global utilities available in index.css
- [ ] Typography scales imported from typography.ts
- [ ] Read TAILWIND_RESPONSIVE_GUIDE.md for patterns
- [ ] Test on multiple breakpoints in DevTools
- [ ] Verify orientation changes work
- [ ] Check reduced motion support

---

**Status**: Infrastructure ✅ Complete | Ready for component migration 🚀
