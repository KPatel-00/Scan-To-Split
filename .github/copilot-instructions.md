# GitHub Copilot Instructions

ScanToSplit.ai - AI-powered bill-splitting app with smart receipt scanning. Minimalist design inspired by Apple iOS and Revolut.

## 🎯 Critical Workflows

**Dev Commands**:
```bash
npm run dev      # Port 3000 (Vite dev server)
npm run build    # MUST pass before commits (zero TypeScript errors)
npm run lint     # Must pass (zero warnings)
```

**Environment Setup**:
```bash
# Add your Gemini API key to .env file (create if needed)
# VITE_GOOGLE_GEMINI_API_KEY=your_key_here
```

**Path Alias**: `@/` → `src/` (configured in `vite.config.ts`, use in ALL imports)

**Critical Rules** (Non-Negotiable):
1. **Frozen dependencies** - No `npm install` without approval (existing: shadcn/ui, lucide-react, framer-motion, react-hook-form, DOMPurify, @google/generative-ai)
2. **XSS prevention** - ALL user input → `sanitizeInput()` before Zustand storage (see `src/lib/sanitize.ts`)
3. **Animation system** - Import named presets from `@/lib/motion/` ONLY (never inline `stiffness:` values)
4. **Accessibility** - Use `safeTactile(preset, prefersReducedMotion)` wrapper for all interactive animations
5. **TypeScript strict** - `npm run build` must pass with zero errors before commits
6. **Framer Motion `whileInView`** - NEVER wrap with `<AnimatePresence initial={false}>` (breaks viewport detection)
7. **Performance** - Heavy dependencies are lazy-loaded (PDF export, AI scanning, image export via dynamic imports)

**Pre-Commit**: Run `docs/core/PRE_COMMIT_CHECKLIST.md` (40+ checks)

**Performance Architecture**:
- **Landing page load**: ~214 kB gzipped (React, Motion, UI components)
- **Lazy-loaded chunks**: PDF export (358 kB), AI scanning (27 kB), Image export (214 kB)
- **Bundle splitting**: Configured in `vite.config.ts` with `manualChunks`
- **Code splitting**: All routes use `React.lazy()` in `App.tsx`



## 🏗️ Architecture Overview

**Stack**: React 18.3 + TypeScript 5.5 + Vite 5.4 + Zustand 4.5 + Tailwind CSS 3.4 + Framer Motion 11.5

**Routing**: React Router v6 with lazy-loaded routes (`React.lazy()` in `src/App.tsx`)
- Landing: `/` (active `LandingPage.tsx`)
- App flow: `/setup` → `/assignment` → `/summary`
- Analytics: `/analytics` (dashboard with charts)
- Demos: `/setup-demo`, `/setup-v2` (experimental flows)
- Archived: Legacy landing in `src/features/landing-archive/` (Oct 29, 2025)

**File Placement Rules** (feature-based, not page-based):
- Used 3+ features → `src/components/` (example: `ChapterBadge.tsx`, `ProgressStepper.tsx`)
- Used 1 feature → `src/features/[name]/components/` (example: `ItemRow.tsx` in assignment)
- Pure utilities → `src/lib/` (example: `sanitize.ts`, `typography.ts`)
- State logic → `src/store/slices/` (9 slices: items, participants, receipts, groups, scanning, settings, ui, modals, undo)
- Global hooks → `src/hooks/` (example: `useReducedMotion.ts`, `useHydration.ts`)

**Key Directories**:
```
src/
├── features/           # Feature modules (landing-page, setup, assignment, summary)
│   └── [feature]/components/  # Feature-specific components
│   └── [feature]/hooks/       # Feature-specific business logic
├── lib/                # Pure utilities
│   ├── motion/         # Animation presets (43 named exports - added fadeInUp Nov 4, 2025)
│   ├── taxonomy/       # Category codes (24 merchandise + 15 grocery + 12 special)
│   ├── typography.ts   # 40+ responsive text variants
│   └── sanitize.ts     # XSS prevention with DOMPurify
├── hooks/              # Global hooks (useReducedMotion, useHydration, usePageTransition)
├── store/              # Zustand slices + selectors (ALWAYS import from useStore.ts)
│   ├── slices/         # Domain slices (average ~90 lines each)
│   └── selectors/      # Computed values (items, receipts, participants)
└── components/ui/      # shadcn/ui primitives
```

**Recent Refactoring (Nov 4, 2025)**:
- **ScanPortal.tsx**: 658 → 183 lines (72% reduction)
  - Phase 1: Extracted 6 UI components to `src/features/setup/components/`
  - Phase 2: Extracted 2 hooks to `src/features/setup/hooks/`
  - Phase 3: Moved animations to global motion library (`fadeInUp` added)
- **Zero breaking changes**: All functionality preserved, TypeScript errors remain at 36 (pre-existing in analytics)

## ⚡ Zustand State Patterns

**9 Domain Slices**: items, participants, receipts, groups, scanning, settings, ui, modals, undo
- Located in `src/store/slices/` (average ~90 lines each)
- Combined in `src/store/useStore.ts` (302 lines)
- Persisted to localStorage via Zustand middleware

**Critical: Fine-Grained Selectors** (prevents unnecessary re-renders):
```tsx
import { useStore } from '@/store/useStore';

// ✅ CORRECT - only re-renders when items change
const items = useStore((state) => state.items);
const addItem = useStore((state) => state.addItem);

// ❌ WRONG - re-renders on ANY store change
const store = useStore();
const items = store.items;
```

**Dual Mode System** (`managementMode` in `uiSlice.ts`):
```tsx
const mode = useStore((state) => state.managementMode);
if (mode === 'merged') {
  // Single bill: use state.items, state.mergedPaidBy, state.mergedTax, state.mergedTip
} else {
  // Multiple receipts: use state.receipts[] array (each has items, paidBy, tax, tip)
}
```

**Hydration Pattern** (localStorage loads async, prevents SSR mismatches):
```tsx
import { useHydration } from '@/hooks/useHydration';
import { RouteLoadingScreen } from '@/components/LoadingStates';

function MyComponent() {
  const isHydrated = useHydration();
  if (!isHydrated) return <RouteLoadingScreen />;
  
  // ✅ Safe to use Zustand state - localStorage has loaded
  const items = useStore((state) => state.items);
}
```

**Why this pattern?**
- Zustand persist middleware loads localStorage **asynchronously** on mount
- Without `useHydration()`, components read empty state before hydration completes
- Causes flicker: empty → populated state transition
- `RouteLoadingScreen` shows smooth progress bar during hydration (~50ms)

**Adding Store Actions** (see `src/store/README.md`):
1. Find correct domain slice in `src/store/slices/` (e.g., `itemsSlice.ts`)
2. Add method to slice interface AND implementation
3. Export from slice file
4. Re-export in `useStore.ts` (makes it available to components)
5. Use with fine-grained selector: `const addItem = useStore((state) => state.addItem);`

## 🎨 Design System Rules

**Typography** - Always use `src/lib/typography.ts` (40+ responsive variants):
```tsx
import { typography } from '@/lib/typography';

// ✅ Semantic scales (auto-responsive)
<h1 className={typography.display.xl}>Hero</h1>
<p className={typography.body.lg}>Description</p>

// ❌ Manual responsive or magic values
<h1 className="text-4xl md:text-6xl">Hero</h1>
```

**Animations** - Named presets from `src/lib/motion/` ONLY (43 presets):
```tsx
import { buttonTactile, layoutTransition, safeTactile, fadeInUp } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ✅ Named preset with accessibility wrapper (preferred)
const prefersReducedMotion = useReducedMotion();
<motion.button {...safeTactile(buttonTactile, prefersReducedMotion)}>
  Click me
</motion.button>

// ✅ Common fade+slide pattern (added Nov 4, 2025)
<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>

// ✅ Alternative: spread interactive presets
<motion.button {...interactiveButton}>Click me</motion.button>

// ❌ Inline physics (forbidden - violates design system)
<motion.button whileHover={{ scale: 1.05 }} transition={{ stiffness: 180 }}>
```

**🚨 CRITICAL: Framer Motion `whileInView` Rules**

**NEVER use `AnimatePresence` with `initial={false}` when child components use `whileInView`:**

```tsx
// ❌ WRONG - breaks whileInView in ALL children
<AnimatePresence mode="wait" initial={false}>
  <Routes>
    <Route path="/" element={<PageWithWhileInView />} />
  </Routes>
</AnimatePresence>

// ✅ CORRECT - omit initial={false} or don't use AnimatePresence
<AnimatePresence mode="wait">  {/* No initial prop */}
  <Routes>
    <Route path="/" element={<PageWithWhileInView />} />
  </Routes>
</AnimatePresence>
```

**Why it breaks:**
- `initial={false}` globally disables initial animation states
- `whileInView` relies on `initial="hidden"` → `animate="visible"` transitions
- When `AnimatePresence` sets `initial={false}`, child `whileInView` never triggers
- Viewport Intersection Observer initializes but animations never fire

**Safe patterns:**
```tsx
// ✅ Direct whileInView (no AnimatePresence wrapper)
<motion.div
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.3 }}
>

// ✅ AnimatePresence WITHOUT initial={false}
<AnimatePresence mode="wait">
  <motion.div whileInView="show">

// ✅ PageTransition component (fixed - no initial={false})
<PageTransition>
  <PageWithWhileInView />
</PageTransition>
```

**Debugging checklist if `whileInView` doesn't work:**
1. Check for parent `<AnimatePresence initial={false}>` (remove it)
2. Check for nested `motion` components without animation props (use regular HTML)
3. Verify `initial` and `whileInView` variant names match your variants object
4. Test without `overflow-y-auto` containers (can interfere with viewport detection)
5. Ensure no CSS `contain: layout style paint;` on scroll containers

**Responsive** - Pure Tailwind utilities (NO JS device detection):
```tsx
// ✅ Tailwind breakpoints (xs: 414px, sm: 640px, md: 768px, lg: 1024px, xl: 1366px, 2xl: 1920px)
<div className="flex flex-col lg:flex-row gap-8">
<div className="md:hidden">Mobile Only</div>

// ✅ Custom variants (see tailwind.config.js)
<div className="portrait:text-sm landscape:text-base">
<div className="fold-v:gap-2 fold-h:gap-4">
```

**Security** - XSS prevention with `sanitizeInput()`:
```tsx
import { sanitizeInput } from '@/lib/sanitize';

// ✅ ALWAYS sanitize before Zustand storage (AI scan results, user input)
addParticipant(sanitizeInput(formData.name));
addItem({ name: sanitizeInput(aiScanResult.itemName), ... });

// ❌ XSS vulnerability (could contain <script>, <img onerror>, etc.)
addParticipant(formData.name);
```

**Colors** - CSS variables only (see `src/index.css`):
```tsx
// ✅ Semantic tokens from design system
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="border-border ring-ring"

// ❌ Inline hex or hardcoded (breaks theme switching)
className="bg-white text-black"
className="bg-[#4f46e5]"
```

## 🔧 Key Implementation Patterns

**AI Receipt Scanning** (Google Gemini 1.5 Flash):
- ✅ **Lazy-loaded** via dynamic import in `src/lib/scanReceiptsClient.ts`
- Images compressed via `browser-image-compression` before upload
- Gemini API extracts items with category taxonomy codes (GROC.DAIRY, ALCO.BEER, etc.)
- ALL results sanitized with `sanitizeInput()` before Zustand storage
- Error handling for API failures, invalid responses, and missing API keys
- **27.71 kB** chunk only loads when user scans receipts

**PDF/Image Export** (jsPDF, html2canvas, html-to-image):
- ✅ **Lazy-loaded** via dynamic imports (already in `exportPDF.ts`, `shareableImage.ts`)
- `pdf-export` chunk: **358.65 kB** (118.52 kB gzipped)
- `image-export` chunk: **214.79 kB** (53.30 kB gzipped)
- Only downloads when user clicks "Download PDF" or "Share Image"

**Bundle Splitting** (`vite.config.ts`):
```typescript
manualChunks: {
  'pdf-export': ['jspdf'],
  'image-export': ['html2canvas', 'html-to-image'],
  'ai-scanning': ['@google/generative-ai'],
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'motion': ['framer-motion'],
  'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', ...]
}
```

**Performance Metrics** (Oct 31, 2025):
- Main bundle: 267.27 kB (85.63 kB gzipped) - 57% reduction from 622 kB
- Landing page total: ~214 kB gzipped (React + Motion + UI)
- PDF export: Only loads on user action (saves 118 kB gzipped on initial load)
- AI scanning: Only loads on user action (saves 6.32 kB gzipped on initial load)

**Category Taxonomy** (`src/lib/taxonomy/` - 8 files):
- **Purpose**: Standardized category codes for items, AI scanning, and analytics
- **24 Merchandise categories**: GROC, ALCO, TOBA, DRUG, PHAR, HOME, PETS, DIYH, FURN, ELEC, APPL, OFFI, BOOK, TOYS, CLTH, SPOR, AUTO, GARD, REST, SERV, TCOM, GIFT, POST, MISC
- **15 Grocery subcategories**: GROC.DAIRY, GROC.MEAT, GROC.BAKERY, GROC.PRODUCE, GROC.FROZEN, etc.
- **12 Special line codes**: TAX, DEPO, DEPO_RET, DISC, FEES, SHIP, TIP, ROUND, REFUND, CASHBK, DONAT, PAYMT
- **Migration**: `src/lib/taxonomy/migration.ts` handles legacy category upgrades
- **Helpers**: `src/lib/taxonomy/helpers.ts` for validation, formatting, emoji lookup

**Adding Store Actions** (detailed in `src/store/README.md`):
1. Find correct domain slice in `src/store/slices/` (e.g., `itemsSlice.ts` for item operations)
2. Add method to slice interface AND implementation
3. Export from slice file
4. Re-export in `useStore.ts` (combines all slices - required for component access)
5. Use with fine-grained selectors: `const addItem = useStore((state) => state.addItem);`

**Motion Accessibility** (safeTactile wrapper in `src/lib/motion/tactile.ts`):
```tsx
// Automatically disables animations when user prefers reduced motion
import { safeTactile } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prefersReducedMotion = useReducedMotion();
<motion.button {...safeTactile(buttonTactile, prefersReducedMotion)}>
  // Animations disabled if user has OS-level motion preference set
</motion.button>
```

## 🚨 Common Pitfalls

1. **Store re-renders**: Use `useStore((state) => state.items)` NOT `useStore()` (whole store)
2. **Animation performance**: Only animate `transform`/`opacity`, never `width`/`height` (causes layout thrashing)
3. **Layout animations**: Parent needs `position: relative` for Framer Motion layout transitions
4. **Mode checking**: Always check `managementMode` for merged vs separate bills logic
5. **Missing sanitization**: ALL user input must go through `sanitizeInput()` before Zustand storage
6. **Import paths**: Use `@/` alias for all imports (configured in vite.config.ts), never `../../../`
7. **Hydration**: Check `useHydration()` before reading Zustand state in components (prevents SSR mismatches)
8. **🔥 AnimatePresence + whileInView**: NEVER use `<AnimatePresence initial={false}>` when children have `whileInView` - it breaks viewport detection completely
9. **Nested motion components**: Avoid `motion.div` wrappers without animations - use regular HTML elements unless animating

## 📋 Framer Motion Animation Checklist

**Before adding animations:**
- [ ] Import motion presets from `@/lib/motion/` (never inline)
- [ ] Use `useReducedMotion()` hook for accessibility
- [ ] Wrap interactive animations with `safeTactile(preset, prefersReducedMotion)`
- [ ] Only animate `transform` and `opacity` (GPU-accelerated)
- [ ] Add `layout` prop for automatic layout animations

**When using `whileInView`:**
- [ ] Verify NO parent `<AnimatePresence initial={false}>`
- [ ] Use regular HTML for non-animated wrapper elements
- [ ] Set `viewport={{ once: false, amount: 0.3 }}` for repeatable animations
- [ ] Define both `initial` and `whileInView` variant states
- [ ] Test scrolling behavior in production build

**Route transitions:**
- [ ] Use `PageTransition` component (already fixed)
- [ ] NO `AnimatePresence` wrapper at App.tsx level
- [ ] Landing page route has NO `PageTransition` wrapper
- [ ] App pages (`/setup`, `/assignment`, `/summary`) USE `PageTransition`

## 📚 Essential Docs

- `docs/core/QUICK_REFERENCE.md` - One-page cheat sheet
- `docs/core/PRE_COMMIT_CHECKLIST.md` - 40+ quality checks
- `docs/core/DEVELOPMENT_GUIDELINES.md` - Complete rulebook (1,956 lines)
- `docs/core/TAILWIND_RESPONSIVE_GUIDE.md` - Responsive patterns (400+ lines)
- `src/store/README.md` - Zustand architecture

## 🔍 Debugging & Development

**Common Issues**:
1. **Build fails with TypeScript errors** → Run `npm run build` to see exact line numbers
2. **Store not hydrating** → Check `useHydration()` usage before accessing Zustand state
3. **Animations not working** → Verify no parent `<AnimatePresence initial={false}>`
4. **XSS in AI scan** → Ensure `sanitizeInput()` wraps ALL AI-generated text
5. **Mode mismatch** → Check `managementMode` before accessing `state.items` vs `state.receipts[]`

**Performance Profiling**:
```bash
npm run build              # Production build
npm run preview            # Preview production build
# Open DevTools → Performance tab → Record → Check bundle sizes
```

**Store Debugging**:
```tsx
// Log entire store state (use sparingly - causes re-render on ANY change)
const store = useStore();
console.log('Full store:', store);

// Log specific slice (better - only logs when slice changes)
const items = useStore((state) => state.items);
console.log('Items only:', items);
```

## 🎯 Current Status (Nov 4, 2025)

**Complete**: 
- Motion library (43 presets, added `fadeInUp` for common fade+slide pattern)
- Typography system (40+ variants)
- Tailwind infrastructure
- Zustand refactor (9 slices)
- ScanPortal.tsx refactoring (72% reduction: 658 → 183 lines)

**Active**: Landing page responsive polish, performance optimization

**Frozen**: Dependencies (no `npm install` without approval)

