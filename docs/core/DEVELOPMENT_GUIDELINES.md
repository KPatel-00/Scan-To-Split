# Splitter Development Guidelines

**Last Updated**: October 29, 2025  
**Purpose**: Prevent code duplication, fragmentation, inconsistency, and technical debt  
**Audience**: All developers working on Splitter

---

## 📑 Table of Contents

### Foundation
1. [Core Principles](#-core-principles) - DRY, Single Source of Truth, Separation of Concerns
2. [File Organization Rules](#-file-organization-rules) - Directory structure, anti-patterns
3. [Component Creation Rules](#-component-creation-rules) - When and where to create

### Code Quality
4. [Design System Enforcement](#-design-system-enforcement) - Colors, typography, animations
5. [Utility Function Guidelines](#-utility-function-guidelines) - Organization, naming
6. [State Management Rules](#-state-management-rules) - Zustand patterns
7. [Animation Standards](#-animation-standards) - Named presets, accessibility
8. [Security & Input Sanitization](#-security--input-sanitization) - XSS prevention

### Performance & Best Practices
9. [Performance Optimization](#-performance-optimization) - React patterns, code splitting, memoization
10. [Error Handling & Resilience](#-error-handling--resilience) - Boundaries, async, defensive
11. [Version Control & Collaboration](#-version-control--collaboration) - Branches, commits, PRs
12. [Testing Strategy](#-testing-strategy) - Unit, integration, E2E
13. [Monitoring & Observability](#-monitoring--observability) - Metrics, logging

### Standards
14. [Design System Compliance](#-design-system-compliance) - Forbidden patterns, audits
15. [Import Organization](#-import-organization) - Standard order
16. [Code Quality Checklist](#-code-quality-checklist) - Pre-commit requirements
17. [Refactoring Triggers](#-refactoring-triggers) - When to extract
18. [Documentation Standards](#-documentation-standards) - JSDoc, examples
19. [Forbidden Patterns](#-forbidden-patterns) - Never do these
20. [Feature Development Workflow](#-feature-development-workflow) - Step-by-step
21. [Naming Conventions Reference](#-naming-conventions-reference) - Files, variables, types
22. [Metrics & Monitoring](#-metrics--monitoring) - Code health targets
23. [Enforcement Tools](#-enforcement-tools) - Pre-commit hooks, ESLint

### Governance & Dependencies
24. [Architecture Decision Records (ADRs)](#-architecture-decision-records-adrs) - Document key decisions
25. [Dependency Management](#-dependency-management) - Prevent duplicate dependencies

---

## 🎯 Core Principles

### 1. **DRY (Don't Repeat Yourself)**
- If code appears 3+ times → Extract to reusable component/function
- If logic appears 2+ times → Extract to utility function
- If pattern appears across features → Move to shared library

### 2. **Single Source of Truth**
- One file per concern (no duplicate implementations)
- One configuration source (no scattered settings)
- One design system (no local overrides)

### 3. **Shallow File Hierarchy**
- Maximum 4 levels deep from `src/`
- Group by feature, not by file type
- Keep related code together

### 4. **Consistent Naming**
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Variables: `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants
- Types: `PascalCase` for interfaces/types
- No abbreviations unless universally known (e.g., `btn` ❌, `button` ✅)

### 5. **Separation of Concerns**
- Components handle UI rendering only
- Business logic lives in utilities/hooks
- State management isolated in Zustand slices
- Side effects managed in custom hooks
- API calls separated from components

### 6. **Low Coupling, High Cohesion**
- Components depend on interfaces, not implementations
- Related functionality grouped together
- Minimal dependencies between features
- Clear module boundaries
- Use dependency injection where appropriate

### 7. **Composition over Inheritance**
- Build complex UIs from simple components
- Use props and children for customization
- Prefer hooks over HOCs (Higher-Order Components)
- Share behavior through custom hooks
- Avoid deep component hierarchies

---

## 📁 File Organization Rules

### Directory Structure Standards

```
src/
├── features/              # Feature-based modules (NOT page-based)
│   ├── landing-v2/        # ✅ One landing implementation
│   │   ├── chapters/      # Chapter-specific code
│   │   ├── components/    # Shared within feature
│   │   └── hooks/         # Feature-specific hooks
│   ├── setup/
│   ├── assignment/
│   └── summary/
├── components/            # Global shared components ONLY
│   ├── ui/                # shadcn/ui primitives
│   └── [domain]/          # Grouped by domain (analytics/, storage/)
├── lib/                   # Utility libraries (pure functions)
│   ├── motion/            # ✅ Use-case-driven animation system
│   │   ├── physics.ts     # Core spring physics (7 presets)
│   │   ├── tactile.ts     # Interactive feedback (buttons, cards)
│   │   ├── page.ts        # Page transitions
│   │   ├── entry.ts       # Content appearance
│   │   ├── layout.ts      # Layout shifts
│   │   ├── specialized.ts # Modals, overlays
│   │   └── index.ts       # Barrel export
│   ├── typography.ts      # Typography scales
│   └── [domain]/          # Complex utilities (taxonomy/, pdf/)
├── hooks/                 # Global custom hooks ONLY
├── store/                 # State management
│   ├── slices/            # Domain-specific slices
│   └── selectors/         # Computed values
└── pages/                 # Route components (thin wrappers)
```

### ❌ Anti-Patterns to Avoid

```
❌ src/components/landing/HeroBadge.tsx         # Don't: Page-specific in global
✅ src/features/landing-v2/components/ChapterBadge.tsx

❌ src/utils/helpers/stringHelpers.ts           # Don't: Deep nesting
✅ src/lib/strings.ts

❌ src/components/Button1.tsx                   # Don't: Numbered variants
❌ src/components/Button2.tsx
✅ src/components/ui/button.tsx (with variants prop)

❌ src/animations/heroAnimations.ts             # Don't: Scattered animations
❌ src/features/landing/animations.ts
✅ src/lib/motion/ (use-case-driven system)

❌ src/lib/animations.ts                        # Don't: Deprecated files
❌ src/lib/transitions.ts                       # (deleted in motion consolidation)
❌ src/lib/microInteractions.ts
✅ src/lib/motion/tactile.ts (use-case specific)

❌ src/components/setup/LoadingSpinner.tsx      # Don't: Duplicate loading states
❌ src/components/summary/LoadingSpinner.tsx
✅ src/components/LoadingStates.tsx (shared)
```

---

## 🧩 Component Creation Rules

### When to Create a Component

| Scenario | Action | Example |
|----------|--------|---------|
| Used 3+ times across features | Create in `components/` | `ChapterBadge` (8 usages) ✅ |
| Used 3+ times in one feature | Create in `features/[name]/components/` | `ItemRow` in setup feature |
| Used 2 times | ⚠️ Wait - might be coincidence | Monitor for 3rd usage |
| Used 1 time | ❌ Keep inline | Don't extract prematurely |
| Complex logic (100+ lines) | Extract even if 1 usage | `Step1Scan.tsx` (8s animation) |

### Component Naming Convention

```tsx
// ✅ Good: Descriptive, specific, PascalCase
ChapterBadge.tsx
ParticipantAvatar.tsx
ReceiptScanAnimation.tsx
LoadingStates.tsx

// ❌ Bad: Generic, abbreviated, numbered
Badge.tsx              // Too generic (which badge?)
PartAvatar.tsx         // Abbreviated
LoadingScreen2.tsx     // Numbered variant
Spinner.tsx            // Too vague
```

### Component File Structure

```tsx
/**
 * ChapterBadge - Reusable badge component for landing page headers
 * 
 * Usage:
 * - HeroChapter.tsx: "AI-Powered • No Sign-up"
 * - MagicChapter.tsx: "The Secret Sauce"
 * - TrustChapter.tsx: "Trusted Worldwide" (inverse variant)
 * 
 * Variants: primary | inverse | solid
 * Sizes: sm | md | lg
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface ChapterBadgeProps {
  icon: LucideIcon;
  text: string;
  variant?: 'primary' | 'inverse' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChapterBadge({ ... }: ChapterBadgeProps) {
  // Implementation
}
```

**Required Elements**:
1. **JSDoc header** - Purpose, usage locations, variants
2. **Typed props** - TypeScript interface (no `any`)
3. **Imports grouped** - External → Internal → Types
4. **Named export** - `export function` (not `export default`)

---

## 🎨 Design System Enforcement

### Single Source of Truth Files

| Concern | File | Usage |
|---------|------|-------|
| Colors | `src/index.css` | CSS variables only (`--background`, `--primary`) |
| Typography | `src/lib/typography.ts` | `typography.display.xl`, `typography.body.lg` |
| Animations | `src/lib/motion/` | Use-case presets (tactile, page, entry, layout, specialized) |
| Physics | `src/lib/motion/physics.ts` | Core spring configurations (snappyFast, smoothNormal, etc.) |
| Spacing | Tailwind classes | `p-4`, `mt-8` (4px grid) |
| Icons | `lucide-react` | Import from package only |
| UI Components | `src/components/ui/` | shadcn/ui primitives |

### ❌ Forbidden Patterns

```tsx
// ❌ Don't: Inline color values
<div className="bg-[#ffffff] text-[#000000]">

// ✅ Do: Use CSS variables
<div className="bg-background text-foreground">

// ❌ Don't: Inline typography
<h1 className="text-6xl font-bold leading-tight">

// ✅ Do: Use typography scales
<h1 className={typography.display.xl}>

// ❌ Don't: Inline animation values
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ type: 'spring', stiffness: 180, damping: 15 }}
>

// ✅ Do: Use use-case presets
import { buttonTactile } from '@/lib/motion/tactile';
<motion.button {...buttonTactile}>

// ❌ Don't: Import from deprecated files
import { gentleLand } from '@/lib/animations';
import { popIn } from '@/lib/transitions';

// ✅ Do: Import from motion library
import { buttonTactile } from '@/lib/motion/tactile';
import { pageTransition } from '@/lib/motion/page';

// ❌ Don't: Custom spacing
<div style={{ marginTop: '23px', paddingLeft: '17px' }}>

// ✅ Do: Use 4px grid
<div className="mt-6 pl-4">  // 24px, 16px
```

---

## 🔧 Utility Function Guidelines

### File Organization

```
src/lib/
├── animations.ts          # ✅ All animation variants (fadeIn, slideUp, etc.)
├── transitions.ts         # Spring physics presets
├── typography.ts          # Text size/weight scales
├── utils.ts               # Generic helpers (cn, formatDate, etc.)
├── sanitize.ts            # Security (DOMPurify wrapper)
├── haptics.ts             # Mobile feedback
└── [domain]/              # Complex domains get folders
    ├── taxonomy/
    │   ├── types.ts       # Type definitions
    │   ├── helpers.ts     # Helper functions
    │   ├── hooks.ts       # Custom hooks
    │   └── migration.ts   # Migration logic
    └── pdf/
        ├── header.ts
        ├── items.ts
        └── footer.ts
```

### When to Create a Utility File

| Criteria | Action |
|----------|--------|
| Function used in 3+ features | Create in `src/lib/utils.ts` |
| Related functions (5+) | Create dedicated file `src/lib/[domain].ts` |
| Complex domain (taxonomy, PDF) | Create folder `src/lib/[domain]/` |
| Single-use helper | Keep in same file as usage |

### Utility Naming

```ts
// ✅ Good: Verb-noun, descriptive
sanitizeInput(value: string): string
formatCurrency(amount: number, code: string): string
calculateTotalWithTax(items: Item[]): number
validateSpecialLineItem(item: Item): boolean

// ❌ Bad: Generic, unclear
process(data: any): any        // What does it process?
handle(): void                 // Handle what?
check(x: string): boolean      // Check what?
util(): void                   // Too vague
```

---

## 🗄️ State Management Rules

### Zustand Slice Organization

**Rule**: One slice per business domain (NOT per page)

```
src/store/slices/
├── itemsSlice.ts           # ✅ Bill items (used across setup, assignment, summary)
├── participantsSlice.ts    # ✅ People (used across setup, assignment, summary)
├── receiptsSlice.ts        # ✅ Multiple receipts (separate bills mode)
├── settingsSlice.ts        # ✅ User preferences (global)
├── uiSlice.ts              # ✅ UI state (theme, mode, language)
├── scanningSlice.ts        # ✅ AI scanning state
├── groupsSlice.ts          # ✅ Saved groups
├── modalsSlice.ts          # ✅ Modal visibility
└── undoSlice.ts            # ✅ Undo/redo history
```

### ❌ Anti-Patterns

```
❌ setupSlice.ts           # Don't: Page-based slices
❌ assignmentSlice.ts
❌ summarySlice.ts

❌ uiStateSlice.ts         # Don't: Duplicate concepts
❌ themeSlice.ts           # (theme is part of UI state)

❌ dataSlice.ts            # Don't: Generic naming
❌ appSlice.ts
```

### State Access Pattern

```tsx
// ❌ Bad: Grab entire store
const store = useStore();
const items = store.items;  // Re-renders on ANY store change

// ✅ Good: Fine-grained selector
const items = useStore((state) => state.items);  // Only re-renders when items change

// ✅ Best: Memoized selector for computed values
import { selectTotalAmount } from '@/store/selectors/itemSelectors';
const total = useStore(selectTotalAmount);
```

---

## 🎬 Animation Standards

### Named Presets (MANDATORY)

**Rule**: Never write inline spring values - use presets from `src/lib/transitions.ts`

```tsx
// ❌ FORBIDDEN: Inline animation objects
<motion.div
  transition={{ type: 'spring', stiffness: 180, damping: 15 }}
/>

// ✅ REQUIRED: Named presets
import { gentleLand } from '@/lib/transitions';
<motion.div transition={gentleLand} />
```

### Available Presets

| Preset | Use Case | Physics |
|--------|----------|---------|
| `popIn` | Modals, popovers, tooltips | `stiffness: 350, damping: 20` |
| `gentleLand` | List items, cards | `stiffness: 180, damping: 25` |
| `premiumSpring` | Page transitions | `stiffness: 350, damping: 35` |

### Adding New Presets

```ts
// src/lib/transitions.ts

// ✅ Do: Add to central file with JSDoc
/**
 * Bouncy entrance for celebration elements
 * Used in: Summary confetti, Success badges
 */
export const celebrationBounce: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 18,
  mass: 0.5,
};
```

### Accessibility (MANDATORY)

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0.2 } : gentleLand}
    />
  );
}
```

---

## 🔐 Security & Input Sanitization

### Mandatory Sanitization

**Rule**: ALL user input MUST be sanitized before storage or rendering

```tsx
import { sanitizeInput } from '@/lib/sanitize';

// ✅ Good: Sanitize before storing
const handleSubmit = (data: FormData) => {
  const safeName = sanitizeInput(data.participantName);
  const safeNote = sanitizeInput(data.itemNote);
  addParticipant(safeName);
};

// ❌ Bad: Direct storage
const handleSubmit = (data: FormData) => {
  addParticipant(data.participantName);  // XSS vulnerability!
};
```

### What to Sanitize

| Input Source | Sanitize? | Method |
|--------------|-----------|--------|
| Text inputs | ✅ Always | `sanitizeInput()` |
| Textareas | ✅ Always | `sanitizeInput()` |
| File uploads | ✅ Always | Validate type + size |
| URL parameters | ✅ Always | `sanitizeInput()` |
| API responses | ✅ Always | Validate schema |
| Constants/Literals | ❌ No | Hardcoded values are safe |

---

## 🎭 Performance Optimization

### React Performance Patterns

**Rule**: Prevent unnecessary re-renders and optimize bundle size

```tsx
// ❌ Bad: Inline object creation causes re-renders
<Component style={{ padding: '16px' }} />

// ✅ Good: Static styles
const styles = { padding: '16px' };
<Component style={styles} />

// ❌ Bad: Inline function in render
<Button onClick={() => handleClick(id)} />

// ✅ Good: Memoized callback
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<Button onClick={handleButtonClick} />

// ❌ Bad: Unnecessary memo
const SimpleText = React.memo(({ text }: { text: string }) => <p>{text}</p>);

// ✅ Good: Memo only for expensive components
const ExpensiveChart = React.memo(ChartComponent, (prev, next) => 
  prev.data.length === next.data.length
);
```

### Code Splitting & Lazy Loading

```tsx
// ✅ Route-based splitting (already implemented in App.tsx)
const Landing = lazy(() => import('./pages/Landing'));
const Setup = lazy(() => import('./pages/Setup'));

// ✅ Component-based splitting (for heavy features)
const PDFGenerator = lazy(() => import('@/features/pdf/PDFGenerator'));

// ✅ Conditional loading (only when needed)
const [showAnalytics, setShowAnalytics] = useState(false);
{showAnalytics && (
  <Suspense fallback={<LoadingStates variant="skeleton" />}>
    <Analytics />
  </Suspense>
)}
```

### Bundle Size Optimization

```tsx
// ❌ Bad: Import entire library
import _ from 'lodash';
const sorted = _.sortBy(items, 'name');

// ✅ Good: Import specific function
import { sortBy } from 'lodash-es';
const sorted = sortBy(items, 'name');

// ❌ Bad: Import all icons
import * as Icons from 'lucide-react';

// ✅ Good: Import specific icons
import { Sparkles, ArrowRight } from 'lucide-react';
```

### Memoization Guidelines

| Use Case | Hook | When to Use |
|----------|------|-------------|
| Expensive calculations | `useMemo` | Filtering large lists, complex math |
| Callback functions | `useCallback` | Passing to memoized children |
| Component re-renders | `React.memo` | Expensive render, stable props |
| Zustand selectors | Memoized selectors | Complex derived state |

```tsx
// ✅ useMemo for expensive calculations
const filteredItems = useMemo(() => 
  items.filter(item => item.price > 10).sort((a, b) => b.price - a.price),
  [items]
);

// ✅ useCallback for event handlers passed to children
const handleItemClick = useCallback((id: string) => {
  setSelectedItem(id);
}, []);

// ✅ React.memo for expensive components
const ItemList = React.memo(({ items, onItemClick }) => (
  // Expensive rendering logic
));
```

---

## 🛡️ Error Handling & Resilience

### Error Boundary Pattern

**Rule**: Wrap complex features in error boundaries to prevent full app crashes

```tsx
// ✅ Feature-level error boundary
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <ComplexFeature />
</ErrorBoundary>

// ✅ Taxonomy-specific error boundary (already implemented)
<TaxonomyErrorBoundary>
  <ItemWithCategory />
</TaxonomyErrorBoundary>
```

### Async Error Handling

```tsx
// ❌ Bad: Unhandled promise rejection
const scanReceipt = async () => {
  const result = await scanReceiptsClient(image);
  setItems(result.items);
};

// ✅ Good: Try-catch with user feedback
const scanReceipt = async () => {
  try {
    setLoading(true);
    const result = await scanReceiptsClient(image);
    setItems(result.items);
    toast.success('Receipt scanned successfully!');
  } catch (error) {
    console.error('Scan failed:', error);
    toast.error('Failed to scan receipt. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ✅ Best: Centralized error handler
const scanReceipt = async () => {
  try {
    setLoading(true);
    const result = await scanReceiptsClient(image);
    setItems(result.items);
    toast.success('Receipt scanned successfully!');
  } catch (error) {
    handleAPIError(error, 'scanning receipt');
  } finally {
    setLoading(false);
  }
};
```

### Defensive Programming

```tsx
// ❌ Bad: Assumes data exists
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✅ Good: Null checks
const total = items?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;

// ❌ Bad: No fallback
const userName = user.name.toUpperCase();

// ✅ Good: Safe navigation with fallback
const userName = user?.name?.toUpperCase() || 'Guest';

// ✅ Best: Type guard
function isValidItem(item: unknown): item is Item {
  return (
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    'price' in item &&
    typeof item.price === 'number'
  );
}

if (isValidItem(data)) {
  addItem(data);
}
```

---

## 🔄 Version Control & Collaboration

### Branch Naming

```bash
# ✅ Feature branches
feature/chapter-badge-component
feature/responsive-landing-page
feature/pdf-export

# ✅ Bug fixes
fix/assignment-sanitization
fix/theme-toggle-flash

# ✅ Refactoring
refactor/consolidate-animations
refactor/merge-loading-components

# ✅ Documentation
docs/update-development-guidelines
docs/add-quick-reference

# ❌ Bad: Vague names
fix/bug
feature/new-feature
update
```

### Commit Message Convention

```bash
# Format: type(scope): description
#
# Types: feat, fix, refactor, docs, style, perf, test, chore
# Scope: landing, setup, assignment, summary, analytics, store, lib, ui

# ✅ Good examples
feat(landing): add ChapterBadge reusable component
fix(assignment): sanitize item names before storage
refactor(animations): consolidate to named presets
docs(guidelines): add error handling section
perf(summary): memoize settlement calculations
style(ui): apply consistent spacing to buttons

# ❌ Bad examples
update code
fix bug
changes
WIP
```

### Pull Request Checklist

```markdown
## PR Checklist

### Code Quality
- [ ] `npm run build` passes (zero TypeScript errors)
- [ ] `npm run lint` passes (zero warnings)
- [ ] No console.log/warn/error statements
- [ ] All animations use named presets
- [ ] All user input sanitized
- [ ] useReducedMotion() checked

### Testing
- [ ] Tested in browser (zero console errors)
- [ ] Tested light/dark theme
- [ ] Tested mobile viewport
- [ ] Tested with reduced motion

### Documentation
- [ ] JSDoc added to new components
- [ ] README updated if new feature
- [ ] Migration notes if breaking change
- [ ] copilot-instructions.md updated if new pattern

### Performance
- [ ] No unnecessary re-renders (checked with React DevTools)
- [ ] Bundle size impact checked
- [ ] Images optimized
- [ ] Lazy loading where appropriate

### Design System
- [ ] Colors from CSS variables
- [ ] Typography from typography.ts
- [ ] Spacing follows 4px grid
- [ ] Icons from lucide-react only
```

### Code Review Guidelines

**As Author**:
- Keep PRs small (<400 lines changed)
- One feature/fix per PR
- Self-review before requesting review
- Add context in PR description
- Respond promptly to feedback

**As Reviewer**:
- Check against development guidelines
- Verify zero TypeScript/ESLint errors
- Test locally if significant change
- Be constructive, not critical
- Approve only if you'd merge it yourself

---

## 🧪 Testing Strategy

### Component Testing Principles

```tsx
// ✅ Test user interactions, not implementation
test('clicking Add Participant button opens dialog', () => {
  render(<ParticipantManager />);
  const button = screen.getByRole('button', { name: /add participant/i });
  fireEvent.click(button);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

// ❌ Don't test implementation details
test('state updates when button clicked', () => {
  const { result } = renderHook(() => useParticipants());
  act(() => result.current.addParticipant('John'));
  expect(result.current.participants).toHaveLength(1);  // Testing internal state
});
```

### Testing Pyramid (Target Ratios)

```
       /\        10% - E2E Tests (Critical user flows)
      /  \       
     /----\      30% - Integration Tests (Feature interactions)
    /      \     
   /--------\    60% - Unit Tests (Utilities, helpers, pure functions)
  /__________\   
```

### What to Test

| Test Type | Examples | Current Status |
|-----------|----------|----------------|
| **Unit** | Utilities (sanitize, settlement, taxonomy) | ✅ 1 test file |
| **Integration** | Store slices, hooks with state | ❌ Not implemented |
| **Component** | User interactions, rendering | ❌ Not implemented |
| **E2E** | Complete user flows | ❌ Not implemented |

### Test File Naming

```
src/lib/sanitize.ts         → src/lib/__tests__/sanitize.test.ts
src/hooks/useUndo.tsx        → src/hooks/__tests__/useUndo.test.tsx
src/store/slices/itemsSlice.ts → src/store/slices/__tests__/itemsSlice.test.ts
```

---

## 📊 Monitoring & Observability

### Performance Metrics

```tsx
// ✅ Track critical user interactions
import { triggerHaptic } from '@/lib/haptics';

const handleAddItem = async () => {
  const start = performance.now();
  
  try {
    await addItem(newItem);
    triggerHaptic('success');
    
    const duration = performance.now() - start;
    if (duration > 100) {
      console.warn(`Slow addItem: ${duration}ms`);
    }
  } catch (error) {
    triggerHaptic('error');
  }
};
```

### localStorage Health Monitoring

```tsx
// ✅ Already implemented in src/lib/storage/quota.ts
import { checkStorageHealth, getStorageStats } from '@/lib/storage/quota';

// Check before large operations
const canSave = checkStorageHealth();
if (!canSave) {
  toast.warn('Storage almost full. Consider exporting your data.');
}

// Monitor usage
const stats = getStorageStats();
console.log(`Storage: ${stats.usedPercentage}% used`);
```

### Error Logging (Production)

```tsx
// ✅ Log errors for debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
  // In production: Send to error tracking service
});

// ✅ Log unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production: Send to error tracking service
});
```

---

## 🎨 Design System Compliance

### Localized Styles (FORBIDDEN)

**Problem**: Component-specific styles that don't match app design philosophy

```tsx
// ❌ FORBIDDEN: Local typography overrides
<h1 className="text-[42px] font-[650] tracking-[-0.02em]">
  // Custom values not in typography.ts

// ✅ REQUIRED: Use design system
import { typography } from '@/lib/typography';
<h1 className={typography.hero}>

// ❌ FORBIDDEN: Local color definitions
<div className="bg-[#f5f5f5] dark:bg-[#1a1a1a]">

// ✅ REQUIRED: CSS variables
<div className="bg-muted">

// ❌ FORBIDDEN: Local animation values
<motion.div
  transition={{ type: 'spring', stiffness: 285, damping: 22 }}
/>

// ✅ REQUIRED: Named presets
<motion.div transition={gentleLand} />
```

### Design System Audit

Run these checks weekly:

```bash
# Find local color values
grep -r "bg-\[#" src/ --include="*.tsx"
grep -r "text-\[#" src/ --include="*.tsx"

# Find local typography
grep -r "text-\[" src/ --include="*.tsx" | grep -v "text-\["

# Find inline animation values
grep -r "stiffness:" src/ --include="*.tsx"
grep -r "damping:" src/ --include="*.tsx"

# Find custom spacing
grep -r "px-\[" src/ --include="*.tsx"
grep -r "py-\[" src/ --include="*.tsx"
```

---

## 📦 Import Organization

### Standard Order

```tsx
// 1. External dependencies (alphabetical)
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Internal components (@ alias, alphabetical)
import { Button } from '@/components/ui/button';
import { ParticipantAvatar } from '@/components/ParticipantAvatar';

// 3. Hooks (@ alias)
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStore } from '@/store/useStore';

// 4. Utils/Lib (@ alias)
import { sanitizeInput } from '@/lib/sanitize';
import { gentleLand } from '@/lib/transitions';
import { typography } from '@/lib/typography';

// 5. Types (separate import)
import type { Category, Item } from '@/store/types';

// 6. Styles (last)
import './styles.css';
```

### Path Alias Rules

```tsx
// ✅ Always use @ alias for src/ imports
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

// ❌ Never use relative paths for src/
import { Button } from '../../../components/ui/button';
import { useStore } from '../../store/useStore';

// ✅ Relative paths OK for same-folder imports
import { Step1Scan } from './animations/Step1Scan';
```

---

## 🧪 Code Quality Checklist

### Before Every Commit

```bash
# 1. TypeScript check (MUST pass)
npm run build

# 2. Lint check (MUST pass)
npm run lint

# 3. Manual checks
- [ ] Zero console.log() statements (use proper logging)
- [ ] Zero console.warn() or console.error()
- [ ] No commented-out code blocks
- [ ] No TODO comments without GitHub issue reference
- [ ] All animations use named presets
- [ ] All user input sanitized
- [ ] useReducedMotion() checked for animations
- [ ] No duplicate components (checked for 3+ pattern)
- [ ] File in correct directory (features vs components)
```

### File Size Limits

| File Type | Max Lines | Action if Exceeded |
|-----------|-----------|-------------------|
| Component | 300 | Split into subcomponents |
| Utility | 200 | Split into multiple files |
| Hook | 150 | Extract complex logic |
| Slice | 250 | Check if merging multiple domains |

**Exception**: Complex animation components (Step1Scan.tsx = 400 lines OK)

---

## 🔄 Refactoring Triggers

### When to Extract a Component

```tsx
// ❌ Before: Duplicated badge markup (240 lines across 8 files)
<motion.div className="inline-flex items-center gap-2 px-4 py-2...">
  <Sparkles className="h-4 w-4" />
  <span>AI-Powered</span>
</motion.div>

// ✅ After: Single reusable component (89 lines)
<ChapterBadge icon={Sparkles} text="AI-Powered" variant="primary" />
```

### Refactoring Decision Matrix

| Pattern Count | Similarity | Action |
|---------------|------------|--------|
| 3+ exact copies | 100% | Extract immediately |
| 3+ similar copies | 80%+ | Extract with variants prop |
| 2 copies | 100% | Monitor - wait for 3rd |
| 2 copies | <80% | Keep separate (likely coincidence) |

### Migration Strategy

```markdown
1. Create reusable component with all variants
2. Update one usage at a time (test each)
3. Document migration in commit message
4. Delete old code after all migrations
5. Update component count in copilot-instructions.md
```

---

## 📝 Documentation Standards

### Component Documentation (JSDoc)

```tsx
/**
 * ChapterBadge - Reusable badge component for landing page chapter headers
 * 
 * @example
 * // Primary variant (default)
 * <ChapterBadge icon={Sparkles} text="AI-Powered" />
 * 
 * // Inverse variant for dark backgrounds
 * <ChapterBadge icon={Shield} text="Trusted" variant="inverse" />
 * 
 * // Solid variant for CTAs
 * <ChapterBadge icon={Check} text="Complete!" variant="solid" size="lg" />
 * 
 * @features
 * - 3 variants: primary, inverse, solid
 * - 3 sizes: sm, md, lg
 * - Reduced motion support
 * - Icon size auto-scales with badge size
 * 
 * @usage
 * - HeroChapter.tsx (2 instances)
 * - MagicChapter.tsx
 * - PowerChapter.tsx
 * - TrustChapter.tsx
 * - CloserChapter.tsx
 * - Step2People.tsx
 * - Step3Assign.tsx
 * - Step4Summary.tsx
 */
```

### Utility Function Documentation

```ts
/**
 * Sanitizes user input to prevent XSS attacks
 * Uses DOMPurify to strip dangerous HTML/JS
 * 
 * @param input - Raw user input string
 * @returns Sanitized safe string
 * 
 * @example
 * const safeName = sanitizeInput(formData.name);
 * addParticipant(safeName);
 * 
 * @security
 * - Strips <script> tags
 * - Removes event handlers (onclick, etc.)
 * - Preserves plain text and safe formatting
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
```

---

## 🚫 Forbidden Patterns

### Never Do These

```tsx
// ❌ 1. Magic numbers
<div className="mt-[23px]">  // What is 23px?

// ✅ Use 4px grid
<div className="mt-6">  // 24px (6 * 4)

// ❌ 2. Any type
function process(data: any): any { }

// ✅ Proper typing
function process(data: FormData): ProcessedData { }

// ❌ 3. Non-null assertion without check
const user = users.find(u => u.id === id)!;

// ✅ Proper null handling
const user = users.find(u => u.id === id);
if (!user) return null;

// ❌ 4. Inline styles (except dynamic values)
<div style={{ color: 'black', fontSize: '24px' }}>

// ✅ Tailwind classes
<div className="text-foreground text-2xl">

// ❌ 5. console.log in production
console.log('User data:', userData);

// ✅ Remove or use proper logging
// (development only, stripped in build)

// ❌ 6. Hardcoded strings (i18n app)
<h1>Welcome to Splitter</h1>

// ✅ Translation keys
<h1>{t('landing.hero.title')}</h1>

// ❌ 7. Multiple useState for related data
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');

// ✅ Single state object or Zustand
const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

// ❌ 8. Deep prop drilling
<Parent>
  <Child1 user={user}>
    <Child2 user={user}>
      <Child3 user={user} />  // Drilling 3 levels

// ✅ Zustand or Context
const user = useStore((state) => state.user);
```

---

## 🏗️ Feature Development Workflow

### Step-by-Step Process

```markdown
1. **Plan**
   - [ ] Check if similar feature exists
   - [ ] Identify reusable components
   - [ ] Design data flow (Zustand slice needed?)
   - [ ] List required utilities

2. **Create Structure**
   - [ ] Create feature directory: `src/features/[name]/`
   - [ ] Add `components/` subfolder for feature-specific components
   - [ ] Add `hooks/` if feature-specific hooks needed
   - [ ] Add to routing in `App.tsx`

3. **Build**
   - [ ] Use existing components from `src/components/ui/`
   - [ ] Import utilities from `src/lib/`
   - [ ] Use Zustand selectors (not whole store)
   - [ ] Apply design system (typography, colors, spacing)
   - [ ] Add animations with named presets
   - [ ] Implement reduced motion support

4. **Test**
   - [ ] Run `npm run build` (zero TypeScript errors)
   - [ ] Run `npm run lint` (zero warnings)
   - [ ] Test in browser (zero console errors)
   - [ ] Test with prefers-reduced-motion enabled
   - [ ] Test light/dark theme toggle
   - [ ] Test on mobile viewport

5. **Document**
   - [ ] Add JSDoc to components
   - [ ] Update `copilot-instructions.md` if new pattern
   - [ ] Add usage examples in component header
   - [ ] Document in feature README if complex

6. **Refactor**
   - [ ] Check for duplicated code (3+ rule)
   - [ ] Extract reusable components
   - [ ] Move shared logic to `src/lib/`
   - [ ] Optimize bundle size (check import tree)
```

---

## 🎯 Naming Conventions Reference

### Files

```
✅ ChapterBadge.tsx           # PascalCase for components
✅ useReducedMotion.ts        # camelCase starting with 'use' for hooks
✅ sanitize.ts                # camelCase for utilities
✅ itemsSlice.ts              # camelCase ending with 'Slice' for store slices
✅ types.ts                   # lowercase for type definition files
✅ README.md                  # UPPERCASE for documentation

❌ chapterBadge.tsx           # Wrong case
❌ chapter-badge.tsx          # Kebab case not allowed for components
❌ UseReducedMotion.ts        # PascalCase hooks confusing
❌ Items.slice.ts             # Dot notation not needed
```

### Variables & Functions

```ts
// ✅ Variables
const userName = 'John';
const totalAmount = 100;
const isLoading = false;

// ✅ Constants
const MAX_ITEMS = 100;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_CURRENCY = 'EUR';

// ✅ Functions
function calculateTotal(items: Item[]): number { }
function sanitizeInput(value: string): string { }
function formatCurrency(amount: number): string { }

// ✅ Components
function ChapterBadge({ text }: Props) { }
function ParticipantAvatar({ user }: Props) { }

// ✅ Hooks
function useReducedMotion(): boolean { }
function usePageTransition(): TransitionState { }

// ✅ Types
interface ChapterBadgeProps { }
type Category = 'GROC' | 'ALCO' | 'DINE';

// ❌ Bad naming
const user_name = 'John';     // Snake case
const Totalamount = 100;      // Mixed case
function GetData() { }         // PascalCase function
const maxitems = 100;         // Lowercase constant
```

---

## 📊 Metrics & Monitoring

### Code Health Targets

| Metric | Target | Current | Action if Exceeded |
|--------|--------|---------|-------------------|
| Total Files | <600 | 528 | Merge duplicates |
| Bundle Size | <150 KB | TBD | Code split, tree shake |
| Lighthouse Score | 95+ | TBD | Optimize images, lazy load |
| TypeScript Errors | 0 | 0 ✅ | Fix immediately |
| Console Warnings | 0 | 0 ✅ | Fix before commit |
| Duplicate Code | <5% | ~8% | Refactor (ChapterBadge done ✅) |
| Max File Depth | 4 levels | 4 ✅ | Flatten structure |
| Avg Component Size | <200 lines | ~150 ✅ | Extract subcomponents |

### Review Checklist (Weekly)

```markdown
- [ ] Scan for duplicate components (search for similar class patterns)
- [ ] Check for inline animations (grep for 'stiffness:')
- [ ] Find unsanitized inputs (grep for direct useState updates)
- [ ] Identify deep imports (grep for '../../../')
- [ ] Review bundle size (npm run build --stats)
- [ ] Check for unused dependencies (npm list --depth=0)
- [ ] Review localStorage usage (quota check)
- [ ] Audit animation performance (Chrome DevTools)
```

---

## 🔧 Enforcement Tools

### Pre-Commit Checks (Recommended)

```json
// package.json
{
  "scripts": {
    "precommit": "npm run lint && npm run build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "build": "tsc && vite build"
  }
}
```

### ESLint Rules (Current)

```js
// .eslintrc.cjs
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',  // No any types
    'react-hooks/rules-of-hooks': 'error',          // Hooks rules
    'react-hooks/exhaustive-deps': 'warn',          // Hook dependencies
    'no-console': 'warn',                            // No console.log
  }
}
```

### Recommended Additions

```bash
# Install husky for git hooks (optional)
npm install -D husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run precommit"
```

---

## 📚 Learning Resources

### Key Files to Study

| Concept | Reference File | Why Study It |
|---------|----------------|--------------|
| Component extraction | `src/features/landing-v2/components/ChapterBadge.tsx` | Perfect example of DRY refactoring |
| Zustand slices | `src/store/slices/itemsSlice.ts` | Clean slice pattern |
| Animation presets | `src/lib/transitions.ts` | Named preset system |
| Typography scales | `src/lib/typography.ts` | Design system consistency |
| Utility organization | `src/lib/taxonomy/` | Complex domain structure |
| Hook patterns | `src/hooks/useReducedMotion.ts` | Accessibility best practices |

### External References

- **Zustand Docs**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **Framer Motion**: https://www.framer.com/motion/
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🚀 Quick Reference

### Common Tasks

```bash
# Start development
npm run dev

# Check for errors
npm run build && npm run lint

# Find duplicates (manual)
grep -r "className=\"inline-flex items-center" src/

# Check bundle size
npm run build
du -sh dist/

# Find inline animations
grep -r "stiffness:" src/ --include="*.tsx"

# Find unsanitized inputs
grep -r "useState(" src/ --include="*.tsx" -A 2
```

### Decision Trees

**"Should I create a new file?"**
```
Is it used 3+ times? → Yes → Create in src/components/ or src/lib/
                     → No → Keep inline

Is it >200 lines? → Yes → Extract even if 1 usage
                  → No → Keep inline
```

**"Where should this component go?"**
```
Used across 3+ features? → src/components/
Used in 1 feature only? → src/features/[name]/components/
shadcn/ui primitive? → src/components/ui/
```

**"Should I extract this logic?"**
```
Function used 3+ places? → Yes → src/lib/[domain].ts
Complex domain (5+ functions)? → Yes → src/lib/[domain]/
Single use? → No → Keep in same file
```

---

## ✅ Success Criteria

You're following these guidelines when:

### Code Organization
- ✅ No component appears in more than one file with similar code
- ✅ No file is deeper than 4 levels from `src/`
- ✅ Files are named consistently (PascalCase components, camelCase utils)
- ✅ Imports use `@/` alias, not relative paths
- ✅ Related code is grouped together (feature-based, not file-type-based)

### Design System
- ✅ All animations use named presets from `src/lib/transitions.ts`
- ✅ All colors come from CSS variables in `src/index.css`
- ✅ All typography uses scales from `src/lib/typography.ts`
- ✅ All spacing follows 4px grid system
- ✅ All icons from `lucide-react` only

### Code Quality
- ✅ TypeScript builds with zero errors
- ✅ ESLint runs with zero warnings
- ✅ Browser console has zero warnings/errors
- ✅ All user input is sanitized before storage
- ✅ All animations respect `prefers-reduced-motion`

### Performance
- ✅ No unnecessary re-renders (fine-grained Zustand selectors)
- ✅ Expensive operations are memoized
- ✅ Route-based code splitting implemented
- ✅ Bundle size under 150 KB
- ✅ Lighthouse score 95+

### Testing & Documentation
- ✅ Critical paths have test coverage
- ✅ Components have JSDoc headers
- ✅ Complex features have README files
- ✅ Breaking changes are documented

### Collaboration
- ✅ Commit messages follow convention
- ✅ PRs are small and focused
- ✅ Code reviews use checklist
- ✅ Branches follow naming pattern

---

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Read Quick Reference (10 mins)
- [ ] Review Core Principles section
- [ ] Study ChapterBadge component as example
- [ ] Complete first commit with checklist

### Week 2: Patterns
- [ ] Study Zustand slice patterns
- [ ] Review animation presets
- [ ] Practice component extraction
- [ ] Implement error boundaries

### Week 3: Advanced
- [ ] Performance optimization techniques
- [ ] Testing strategy
- [ ] Code review participation
- [ ] Design system auditing

### Week 4: Mastery
- [ ] Refactor legacy code
- [ ] Write technical documentation
- [ ] Mentor other developers
- [ ] Contribute to guidelines

---

## 📈 Impact Tracking

### Before Guidelines (October 2025)
- ❌ ~8% duplicate code (ChapterBadge in 8 files)
- ❌ Scattered animations (inline spring values)
- ❌ Inconsistent typography (local overrides)
- ❌ Mixed color systems (hex codes + CSS vars)
- ❌ Deep imports (`../../../`)
- ⚠️ 528 files, some duplicated functionality

### After Guidelines (Target)
- ✅ <5% duplicate code
- ✅ All animations use named presets
- ✅ Single typography source
- ✅ Pure CSS variable colors
- ✅ All imports use `@/` alias
- ✅ <600 files with controlled growth

### Metrics Dashboard

| Metric | Before | Target | Current |
|--------|--------|--------|---------|
| Duplicate Code | ~8% | <5% | TBD |
| TypeScript Errors | 0 | 0 | ✅ 0 |
| Bundle Size | TBD | <150 KB | TBD |
| Test Coverage | ~2% | 60% | TBD |
| Lighthouse Score | TBD | 95+ | TBD |
| File Count | 528 | <600 | 528 |
| Avg Component Size | ~150 | <200 | ✅ ~150 |
| Max Nesting Depth | 4 | 4 | ✅ 4 |

---

## 🚨 Red Flags

Stop and refactor immediately if you see:

### Code Smells
- ❌ Copying and pasting component code
- ❌ Adding numbered variants (Button1, Button2)
- ❌ Creating new color values
- ❌ Writing inline spring physics
- ❌ Using `any` type
- ❌ Deep relative imports (`../../../`)
- ❌ Files over 400 lines
- ❌ Functions over 50 lines

### Technical Debt Indicators
- ❌ TODO comments without issues
- ❌ Commented-out code
- ❌ console.log in production
- ❌ TypeScript `@ts-ignore`
- ❌ ESLint `eslint-disable`
- ❌ Duplicate logic across files
- ❌ Hardcoded magic numbers

### Architecture Issues
- ❌ Business logic in components
- ❌ State management in UI layer
- ❌ Tight coupling between features
- ❌ No error boundaries
- ❌ Missing accessibility support
- ❌ No loading states
- ❌ Unhandled edge cases

---

## 💪 Best Practices Summary

### The Golden Rules (Never Violate)

1. **DRY**: 3+ duplicates → Extract immediately
2. **Single Source**: One file per concern (design system, animations, state)
3. **Type Safety**: Zero `any` types, proper TypeScript everywhere
4. **Security**: Sanitize ALL user input before storage
5. **Accessibility**: Check `useReducedMotion()` for all animations
6. **Quality**: Zero TypeScript errors, zero console warnings
7. **Design System**: Use CSS variables, typography scales, named presets
8. **Performance**: Memoize expensive operations, fine-grained selectors

### The Daily Checklist

**Before Writing Code**:
- [ ] Check if pattern already exists
- [ ] Review design system for similar styles
- [ ] Plan component hierarchy
- [ ] Identify reusable parts

**While Writing Code**:
- [ ] Use TypeScript strictly
- [ ] Import from design system
- [ ] Follow naming conventions
- [ ] Add JSDoc comments
- [ ] Handle errors gracefully
- [ ] Consider accessibility

**Before Committing Code**:
- [ ] Run `npm run build && npm run lint`
- [ ] Test in browser (zero errors)
- [ ] Check reduced motion
- [ ] Review against guidelines
- [ ] Update documentation

**After Committing Code**:
- [ ] Monitor bundle size
- [ ] Review for refactoring opportunities
- [ ] Share learnings with team

---

## 📋 Architecture Decision Records (ADRs)

### Purpose
Document **why** we made important technical decisions to prevent future confusion and redundant debates.

### When to Create an ADR

| Scenario | Create ADR? | Example |
|----------|-------------|---------|
| Choosing between major libraries | ✅ Yes | "Why Zustand over Redux" |
| Changing core architecture | ✅ Yes | "Why feature-first over layer-first structure" |
| Deprecating a major pattern | ✅ Yes | "Why we removed legacy landing page" |
| Adding new design pattern | ✅ Yes | "Why we enforce named animation presets" |
| Routine feature work | ❌ No | Adding a new page component |
| Bug fixes | ❌ No | Fixing a rendering issue |

### ADR Structure

**Location**: `docs/adr/` (create directory if needed)

**File naming**: `YYYY-MM-DD-descriptive-title.md` (e.g., `2025-10-29-zustand-over-redux.md`)

**Template**:
```markdown
# ADR-001: [Decision Title]

**Date**: YYYY-MM-DD  
**Status**: Accepted | Deprecated | Superseded by ADR-XXX  
**Decision Makers**: @username1, @username2

## Context
What problem are we solving? What are the constraints?

## Decision
What did we decide to do?

## Alternatives Considered
1. **Option A**: Pros, cons, why rejected
2. **Option B**: Pros, cons, why rejected

## Consequences
### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Trade-off 2

## Implementation Notes
- Migration path (if deprecating old approach)
- Timeline
- Breaking changes

## References
- Links to discussions, RFCs, related ADRs
```

### Example ADR

```markdown
# ADR-001: Use Zustand Over Redux for State Management

**Date**: 2025-01-15  
**Status**: Accepted  
**Decision Makers**: @lead-dev, @architect

## Context
Need centralized state management for bill items, participants, and receipts.
Team size: 2-3 developers. App scope: Single-page application with moderate complexity.

## Decision
Use **Zustand 4.5.5** with slice pattern for state management.

## Alternatives Considered

1. **Redux Toolkit**
   - Pros: Battle-tested, large ecosystem, great DevTools
   - Cons: Boilerplate heavy, learning curve, overkill for our use case
   - **Why rejected**: Too much ceremony for our team size and app complexity

2. **Context API + useReducer**
   - Pros: Built-in, no dependencies, familiar
   - Cons: Performance issues with frequent updates, verbose patterns
   - **Why rejected**: Poor performance for our item assignment feature

3. **Zustand** ✅
   - Pros: Minimal API, excellent TypeScript support, slice pattern, persist middleware
   - Cons: Smaller ecosystem than Redux
   - **Why chosen**: Perfect balance of simplicity and power

## Consequences

### Positive
- 90% less boilerplate vs Redux
- Fine-grained selectors prevent unnecessary re-renders
- Built-in persistence via middleware
- Slice pattern scales well (currently 9 slices)

### Negative
- Smaller community than Redux (but sufficient for our needs)
- Team must learn new library (mitigated by simple API)

## Implementation Notes
- All state in `src/store/slices/` with domain-based slices
- Use `useStore((state) => state.specificValue)` pattern for selectors
- Persist middleware for localStorage sync

## References
- Zustand docs: https://zustand-demo.pmnd.rs/
- Slice pattern example: `src/store/slices/itemsSlice.ts`
```

### Maintaining ADRs

- **Review quarterly**: Check if decisions still hold
- **Update status**: Mark as "Deprecated" if superseded
- **Link ADRs**: Reference related decisions
- **Single source**: Link to ADR in code comments when relevant

```tsx
// See ADR-001 for why we use Zustand
import { useStore } from '@/store/useStore';
```

---

## 📦 Dependency Management

### Purpose
Prevent duplicate dependencies, version conflicts, and bundle bloat.

### Core Rules

#### 1. **One Library Per Purpose**

| Purpose | Allowed Library | Forbidden Alternatives |
|---------|----------------|----------------------|
| State Management | Zustand 4.5.5 | ❌ Redux, MobX, Jotai, Recoil |
| UI Components | shadcn/ui + Radix UI | ❌ Material-UI, Ant Design, Chakra |
| Icons | lucide-react 0.445.0 | ❌ react-icons, Font Awesome, Heroicons |
| Animations | Framer Motion 11.5.4 | ❌ react-spring, GSAP, anime.js |
| Forms | react-hook-form 7.53.0 | ❌ Formik, Final Form |
| HTTP Client | fetch (native) | ❌ axios (unless ADR justifies) |
| Date Handling | Native Date + Intl | ❌ moment.js, date-fns (unless ADR) |
| Styling | Tailwind CSS 3.4.11 | ❌ styled-components, emotion, CSS Modules |

**Why**: Multiple libraries for the same purpose cause:
- Bundle size bloat (shipping 2 animation libraries = ~200 KB extra)
- API inconsistency (some code uses Formik, some uses react-hook-form)
- Maintenance burden (updating both, learning both)

#### 2. **Version Pinning Strategy**

**In `package.json`**: Use exact versions (no `^` or `~` for core dependencies)

```json
{
  "dependencies": {
    "react": "18.3.1",           // ✅ Exact version
    "framer-motion": "11.5.4",   // ✅ Exact version
    "zustand": "4.5.5"           // ✅ Exact version
  },
  "devDependencies": {
    "eslint": "^8.57.0"          // ✅ Caret OK for dev tools
  }
}
```

**Why**: Prevents surprise breaking changes in production.

#### 3. **Dependency Audit Workflow**

**Before adding a new dependency**, ask:

1. **Do we already have something that does this?**
   - Check existing `package.json`
   - Search codebase for similar functionality

2. **Can we use a native solution?**
   - Example: Use `fetch` instead of `axios` for simple HTTP requests
   - Example: Use native `Intl` instead of date library for formatting

3. **Is this library maintained?**
   - Last commit < 1 year ago ✅
   - Active issues/PRs ✅
   - 1,000+ weekly downloads ✅

4. **What's the bundle cost?**
   - Check on bundlephobia.com
   - Must be < 50 KB gzipped for non-critical features
   - Critical features (UI framework) can be larger with justification

5. **Create ADR if yes to any**:
   - Adding a new library for an existing purpose
   - Library > 100 KB gzipped
   - Breaking change in major dependency

### Quarterly Dependency Health Day

**Schedule**: First Monday of each quarter

**Checklist**:
```bash
# 1. Check for outdated packages
npm outdated

# 2. Security audit
npm audit

# 3. Find duplicate dependencies
npm ls [package-name]
npm dedupe  # Remove duplicates

# 4. Bundle size check
npm run build
# Check dist/ size vs last quarter

# 5. Unused dependencies
npx depcheck

# 6. Update plan
# - Patch updates: Apply immediately
# - Minor updates: Test and apply
# - Major updates: Create ADR, test thoroughly
```

### Forbidden Patterns

```json
// ❌ Don't: Multiple icon libraries
{
  "dependencies": {
    "lucide-react": "0.445.0",
    "react-icons": "5.0.0",        // Duplicate!
    "@heroicons/react": "2.0.0"    // Duplicate!
  }
}

// ❌ Don't: Multiple date libraries
{
  "dependencies": {
    "moment": "2.29.0",            // Bloated
    "date-fns": "2.30.0",          // Duplicate!
    "dayjs": "1.11.0"              // Duplicate!
  }
}

// ❌ Don't: Wildcard versions in production deps
{
  "dependencies": {
    "react": "*",                  // Dangerous!
    "zustand": "^4.0.0"            // Can break on minor update
  }
}

// ✅ Do: One library per purpose, exact versions
{
  "dependencies": {
    "lucide-react": "0.445.0",     // Single icon library
    "react": "18.3.1"              // Exact version
  }
}
```

### Adding a New Dependency Checklist

Before running `npm install [package]`:

- [ ] Checked if we already have a similar library
- [ ] Verified native alternative doesn't exist
- [ ] Library is actively maintained (commit < 1 year)
- [ ] Bundle size acceptable (< 50 KB gzipped for utilities)
- [ ] Created ADR if adding duplicate purpose or large library
- [ ] Updated `DEVELOPMENT_GUIDELINES.md` "Allowed Libraries" table
- [ ] Team reviewed and approved (via PR)

### Migration Path for Duplicate Dependencies

If you find duplicate dependencies in codebase:

1. **Identify**: `npm ls [package-name]` to find all usages
2. **Choose**: Pick the better library (smaller, maintained, team preference)
3. **Create ADR**: Document deprecation of old library
4. **Plan**: Create tracking issue with migration checklist
5. **Migrate**: Update code incrementally (use codemods if possible)
6. **Remove**: Delete old dependency when all code migrated
7. **Verify**: `npm run build` passes, bundle size decreased

---

## 🎯 Key Takeaways

### For New Developers
> "These guidelines prevent you from creating technical debt. Follow them from day one, and your code will be maintainable and scalable."

### For Experienced Developers
> "These guidelines codify best practices we've learned. They're not restrictions—they're guardrails that let you move faster with confidence."

### For Code Reviewers
> "Use this document as your checklist. If something violates these guidelines, it shouldn't be merged—no exceptions."

### For Project Maintainers
> "These guidelines keep the codebase healthy. Enforce them consistently, and you'll have a sustainable project for years."

---

## 🔗 Quick Links

| Need | Document |
|------|----------|
| **Quick daily reference** | `docs/QUICK_REFERENCE.md` |
| **Pre-commit checklist** | `docs/PRE_COMMIT_CHECKLIST.md` |
| **Design system guide** | `docs/DESIGN_SYSTEM_QUICK_REFERENCE.md` |
| **AI agent instructions** | `.github/copilot-instructions.md` |
| **Architecture blueprint** | `docs/architecture/blueprint.md` |
| **Store patterns** | `src/store/README.md` |
| **Master action plan** | `docs/action-plans/MASTER_ACTION_PLAN.md` |

---

**Remember**: These guidelines exist to prevent technical debt, not to slow you down. When in doubt, ask: 

> **"Will future me thank me for this decision?"** 🚀

If the answer is yes, you're on the right track. If no, take a step back and refactor.

---

**Last Updated**: October 29, 2025  
**Version**: 2.0 (Added Performance, Error Handling, Version Control, Testing, Monitoring sections)  
**Contributors**: Development team  
**Feedback**: Open an issue or PR to suggest improvements
