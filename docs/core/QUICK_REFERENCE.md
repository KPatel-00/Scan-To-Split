# Splitter Quick Reference Card

**Last Updated**: October 31, 2025  
**Print this**: Keep visible while coding

---

## ⚡ Golden Rules

```
1. DRY Rule: 3+ duplicates → Extract component/utility
2. Single Source: One file per concern (no duplicates)
3. Named Presets: Never inline animation values
4. Sanitize Always: All user input → sanitizeInput()
5. Zero Tolerance: No TypeScript errors, no console warnings
6. Lazy Loading: Heavy libs (PDF, AI, Images) via dynamic imports
```

---

## 📁 File Placement

| What | Where | Example |
|------|-------|---------|
| Used 3+ features | `src/components/` | `ChapterBadge.tsx` |
| Used 1 feature | `src/features/[name]/components/` | `ItemRow.tsx` |
| Utility function | `src/lib/` | `sanitize.ts` |
| Global hook | `src/hooks/` | `useReducedMotion.ts` |
| Domain state | `src/store/slices/` | `itemsSlice.ts` |

---

## 🎨 Design System

```tsx
// ✅ Colors (CSS variables only)
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"

// ✅ Typography (from typography.ts)
import { typography } from '@/lib/typography';
className={typography.display.xl}   // Hero headings
className={typography.body.lg}      // Paragraphs

// ✅ Animations (use-case presets)
import { buttonTactile } from '@/lib/motion/tactile';
import { pageTransition } from '@/lib/motion/page';
<motion.button {...buttonTactile}>   // Interactive elements
<motion.div variants={pageTransition}>  // Page navigation

// ✅ Spacing (4px grid)
className="p-4 mt-8 mb-12"  // 16px, 32px, 48px

// ✅ Icons (lucide-react only)
import { Sparkles } from 'lucide-react';
<Sparkles className="h-4 w-4" />
```

---

## 🚫 Never Do

```tsx
❌ className="bg-[#ffffff]"           // Inline colors
❌ <h1 className="text-6xl">          // Inline typography
❌ transition={{ stiffness: 180 }}    // Inline animations
❌ import from '@/lib/animations'     // Deprecated file (deleted)
❌ import from '@/lib/transitions'    // Deprecated file (deleted)
❌ addUser(formData.name)             // Unsanitized input
❌ data: any                          // Any type
❌ console.log()                      // Console in production
❌ import from '../../../'            // Deep relative paths
```

---

## ✅ Always Do

```tsx
✅ className="bg-background"                      // CSS variables
✅ className={typography.display.xl}               // Typography scales
✅ import from '@/lib/motion/tactile'             // Use-case presets
✅ <motion.button {...buttonTactile}>             // Complete interactions
✅ addUser(sanitizeInput(formData.name))         // Sanitized input
✅ data: FormData                                 // Proper types
✅ import { Button } from '@/components/ui/button' // @ alias
✅ const prefersReducedMotion = useReducedMotion() // Accessibility
```

---

## 🔧 Before Every Commit

```bash
# 1. Build check
npm run build          # MUST pass (zero TypeScript errors)

# 2. Lint check
npm run lint           # MUST pass (zero warnings)

# 3. Manual check
- [ ] Zero console.log()
- [ ] No commented code
- [ ] All animations use presets
- [ ] All input sanitized
- [ ] useReducedMotion() checked
- [ ] Heavy libs lazy-loaded (PDF/AI/Images)
```

---

## ⚡ Performance Patterns

```tsx
// ✅ Lazy load heavy libraries (PDF, AI, Images)
// In scanReceiptsClient.ts:
const { GoogleGenerativeAI } = await import('@google/generative-ai');

// In exportPDF.ts:
const { default: jsPDF } = await import('jspdf');

// In shareableImage.ts:
const { toPng } = await import('html-to-image');

// ✅ Route-based code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Setup = lazy(() => import('./pages/Setup'));

// ✅ Component memoization (only for expensive renders)
const ExpensiveChart = React.memo(ChartComponent);

// ✅ Callback memoization (prevent child re-renders)
const handleClick = useCallback(() => doSomething(id), [id]);

// ✅ Computed values (prevent recalculations)
const total = useMemo(() => 
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

---

## 🧩 Component Template

```tsx
/**
 * MyComponent - Brief description
 * 
 * Usage:
 * - PageName.tsx
 * - OtherPage.tsx
 * 
 * Variants: primary | secondary
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buttonTactile } from '@/lib/motion/tactile';
import { safeTactile } from '@/lib/motion/utils';
import { typography } from '@/lib/typography';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  text: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function MyComponent({ 
  text, 
  variant = 'primary',
  className 
}: MyComponentProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      {...safeTactile(buttonTactile, prefersReducedMotion)}
      className={cn(
        typography.body.lg,
        "bg-background text-foreground p-4",
        variant === 'secondary' && "bg-muted",
        className
      )}
    >
      {text}
    </motion.div>
  );
}
```

---

## 🗄️ State Management

```tsx
// ❌ Bad: Entire store (re-renders on ANY change)
const store = useStore();

// ✅ Good: Fine-grained selector
const items = useStore((state) => state.items);
const addItem = useStore((state) => state.addItem);

// ✅ Best: Memoized selector
import { selectTotalAmount } from '@/store/selectors/itemSelectors';
const total = useStore(selectTotalAmount);
```

---

## 🎬 Animation Presets (Use-Case-Driven)

```tsx
// Import from use-case files (semantic separation)
import { buttonTactile, cardTactile } from '@/lib/motion/tactile';  // Interactive
import { pageTransition, slideTransition } from '@/lib/motion/page'; // Navigation
import { contentEntry, staggerContainer } from '@/lib/motion/entry'; // Appearance
import { layoutTransition } from '@/lib/motion/layout';              // Layout shifts
import { modalPanel, backdropFade } from '@/lib/motion/specialized'; // Modals

// Or physics layer (only for custom presets)
import { smoothNormal, snappyFast } from '@/lib/motion/physics';

// Always check reduced motion
const prefersReducedMotion = useReducedMotion();

// ✅ Use-case presets (complete interactions)
<motion.button {...safeTactile(buttonTactile, prefersReducedMotion)}>

// ✅ Physics only (when creating new preset)
<motion.div transition={smoothNormal} />
```

---

## 📦 Import Order

```tsx
// 1. External (alphabetical)
import { motion } from 'framer-motion';
import { useState } from 'react';

// 2. Components (@ alias)
import { Button } from '@/components/ui/button';

// 3. Hooks (@ alias)
import { useStore } from '@/store/useStore';

// 4. Utils (@ alias)
import { sanitizeInput } from '@/lib/sanitize';

// 5. Types (separate)
import type { Item } from '@/store/types';
```

---

## 🔐 Security

```tsx
import { sanitizeInput } from '@/lib/sanitize';

// ✅ Always sanitize user input
const handleSubmit = (data: FormData) => {
  const safeName = sanitizeInput(data.name);
  const safeNote = sanitizeInput(data.note);
  addParticipant(safeName);
};

// What to sanitize:
✅ Text inputs
✅ Textareas  
✅ File uploads
✅ URL parameters
✅ API responses
❌ Constants (hardcoded values are safe)
```

---

## 📊 File Naming

```
✅ ChapterBadge.tsx        # PascalCase components
✅ useReducedMotion.ts     # camelCase hooks (use prefix)
✅ sanitize.ts             # camelCase utilities
✅ itemsSlice.ts           # camelCase slices (Slice suffix)
✅ types.ts                # lowercase type files
✅ README.md               # UPPERCASE docs

❌ chapter-badge.tsx       # No kebab-case
❌ UseReducedMotion.ts     # No PascalCase hooks
❌ Items.slice.ts          # No dot notation
```

---

## 🔍 Quick Checks

```bash
# Find inline animations (should only be in src/lib/motion/)
grep -r "stiffness:" src/ --include="*.tsx" | Select-String -NotMatch "src/lib/motion"

# Find deprecated imports (should return 0 results)
grep -r "from '@/lib/animations'" src/
grep -r "from '@/lib/transitions'" src/
grep -r "from '@/lib/microInteractions'" src/

# Find unsanitized inputs (potential)
grep -r "useState(" src/ --include="*.tsx" -A 2

# Find duplicate classes (pattern check)
grep -r "className=\"inline-flex items-center" src/

# Find deep imports
grep -r "from '../../../" src/

# Check bundle size
npm run build
```

---

## 🎯 Decision Tree

### "Should I create a new file?"

```
3+ uses?     → Yes → src/components/ or src/lib/
200+ lines?  → Yes → Extract even if 1 use
Otherwise    → No  → Keep inline
```

### "Where should it go?"

```
Used across features?  → src/components/
Used in 1 feature?     → src/features/[name]/components/
shadcn/ui primitive?   → src/components/ui/
Pure function?         → src/lib/
State management?      → src/store/slices/
```

---

## 🚀 Commands

```bash
npm run dev              # Start dev (port 3000)
npm run build            # TypeScript + build (MUST pass)
npm run lint             # ESLint (MUST pass)
npm run preview          # Preview production build

# Visit routes
http://localhost:3000/            # Landing V2
http://localhost:3000/setup       # Setup
http://localhost:3000/assignment  # Assignment
http://localhost:3000/summary     # Summary
```

---

## 📚 Key Files

| Need | File |
|------|------|
| Full guidelines | `DEVELOPMENT_GUIDELINES.md` |
| Pre-commit checklist | `docs/PRE_COMMIT_CHECKLIST.md` |
| Design system guide | `docs/DESIGN_SYSTEM_QUICK_REFERENCE.md` |
| Motion import guide | `docs/core/MOTION_IMPORT_GUIDE.md` |
| Animation presets | `src/lib/motion/` (tactile, page, entry, layout, specialized) |
| Physics layer | `src/lib/motion/physics.ts` |
| Typography scales | `src/lib/typography.ts` |
| Sanitization | `src/lib/sanitize.ts` |
| Color system | `src/index.css` |
| Store setup | `src/store/useStore.ts` |
| Component example | `src/features/landing-v2/components/ChapterBadge.tsx` |

---

## 💡 Remember

```
"Will future me thank me for this decision?"

If creating duplicate code     → Extract it (3+ rule)
If writing inline styles       → Use design system
If adding any type            → Use proper types
If skipping sanitization      → Add it (security!)
If ignoring accessibility     → Check reduced motion
If bypassing lint            → Fix the warnings
If skipping error handling    → Add try-catch
If skipping memoization      → Consider performance
If skipping tests            → Add coverage
If adding new dependency     → Check for duplicates, create ADR if major
If making architectural choice → Document in ADR (docs/adr/)
```

---

## 🚨 Stop Immediately If...

- ❌ Copying and pasting component code
- ❌ Adding numbered variants (Button1, Button2)
- ❌ Creating inline color values
- ❌ Writing inline spring physics
- ❌ Using `any` type
- ❌ Using deep imports (`../../../`)
- ❌ Skipping error handling
- ❌ Ignoring accessibility
- ❌ Installing duplicate library (check package.json first!)
- ❌ Making major tech decision without ADR

---

**Print this and keep it visible while coding!** 📌

**Version**: 2.0 (October 29, 2025)  
**See full guidelines**: `DEVELOPMENT_GUIDELINES.md`
