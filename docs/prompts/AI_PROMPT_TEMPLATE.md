# AI Coding Agent Prompt Template

**Purpose**: Standard prompt format for all AI-assisted coding tasks  
**Usage**: Copy this template for every new AI coding session  
**Last Updated**: October 29, 2025

---

## 📋 Complete Prompt Template

```
## 🎯 MANDATORY: Read Guidelines First

You are working on the **Splitter** premium bill-splitting React app. Before proceeding with ANY code changes, you MUST:

### 1. Read Core Documentation (REQUIRED)
Read and fully understand these documents in order:

1. **`docs/core/QUICK_REFERENCE.md`** (5 min read)
   - Golden rules, decision trees, forbidden patterns
   - File placement guide, component template
   - Before-commit checklist essentials

2. **`docs/core/DEVELOPMENT_GUIDELINES.md`** (15 min read)
   - Complete rulebook: 23 sections, 1,500+ lines
   - Core principles: DRY, Single Source of Truth, Separation of Concerns
   - File organization, component creation rules, design system
   - Performance, error handling, testing, security
   - Forbidden patterns with correct alternatives

3. **`docs/core/PRE_COMMIT_CHECKLIST.md`** (3 min read)
   - 40+ quality gate items
   - Automated checks: build, lint
   - Manual checks: code quality, design, security, accessibility

4. **`.github/copilot-instructions.md`** (10 min read)
   - Project overview, tech stack, architecture
   - Landing page animation system details
   - Edge cases, critical pitfalls, common patterns

### 2. Understand Project Context
- **Tech Stack**: React 18.3.1 + TypeScript 5.5.4 + Vite 5.4.5
- **State**: Zustand 4.5.5 (9 domain slices)
- **Animation**: Framer Motion 11.5.4 (named presets ONLY)
- **UI**: shadcn/ui + Radix UI (14 primitives)
- **Icons**: lucide-react 0.445.0 ONLY
- **Design**: Minimalist black/white, 4px grid, CSS variables

### 3. Core Non-Negotiables (ZERO TOLERANCE)
- ✅ TypeScript errors: ZERO (run `npm run build`)
- ✅ ESLint warnings: ZERO (run `npm run lint`)
- ✅ Console errors/warnings: ZERO (check browser DevTools)
- ✅ Animations: Named presets ONLY (from `src/lib/transitions.ts`)
- ✅ User input: ALWAYS sanitize with `sanitizeInput()`
- ✅ Accessibility: ALWAYS check `useReducedMotion()`
- ✅ Duplication: Extract at 3+ occurrences
- ✅ Icons: lucide-react ONLY
- ✅ Colors: CSS variables ONLY (no inline hex/rgb)

---

## 💼 Task Description

[USER INPUT SECTION - DESCRIBE YOUR TASK HERE]

### Current Issue / Feature Request:
<!-- Describe the problem, bug, or feature you want implemented -->


### Expected Behavior:
<!-- What should happen after the fix/implementation? -->


### Acceptance Criteria:
<!-- How will you know this is complete and correct? -->
- [ ] 
- [ ] 
- [ ] 


### Additional Context:
<!-- File paths, error messages, screenshots, related PRs, etc. -->


---

## ✅ Completion Requirements (MANDATORY)

Before considering the task complete, you MUST verify ALL of the following:

### 1. Automated Checks (MUST PASS)
```bash
# TypeScript compilation
npm run build
# Expected: Exit code 0, zero errors

# ESLint check
npm run lint
# Expected: Zero warnings

# Browser console
# Expected: Zero errors, zero warnings
```

### 2. Code Quality Verification
- [ ] **No code duplication**: Checked for 3+ similar patterns
- [ ] **Design system compliance**: All colors from CSS variables, all typography from `typography.ts`
- [ ] **Animation standards**: All animations use named presets (gentleLand, popIn, etc.)
- [ ] **Security**: All user input sanitized with `sanitizeInput()` before storage
- [ ] **Accessibility**: `useReducedMotion()` checked for all animations
- [ ] **State management**: Fine-grained Zustand selectors (not entire store)
- [ ] **Import organization**: External → Components → Hooks → Utils → Types
- [ ] **Proper TypeScript**: No `any` types, all props interfaces defined
- [ ] **File location**: Correct directory per guidelines (features/ vs components/)
- [ ] **Naming conventions**: PascalCase components, camelCase utilities

### 3. Testing Checklist
- [ ] **Functionality**: Feature works as expected
- [ ] **Dark/Light theme**: Both modes tested and working
- [ ] **Mobile responsive**: Tested in mobile viewport
- [ ] **Reduced motion**: Tested with prefers-reduced-motion enabled
- [ ] **Edge cases**: Empty states, max limits, error conditions tested
- [ ] **No regressions**: Existing features still work

### 4. Documentation Updates
- [ ] **JSDoc added**: Component has proper header documentation
- [ ] **Examples included**: Usage examples in JSDoc or README
- [ ] **Breaking changes**: Documented in commit message if applicable
- [ ] **copilot-instructions.md**: Updated if new pattern introduced

### 5. Pre-Commit Checklist (FROM docs/core/PRE_COMMIT_CHECKLIST.md)
- [ ] No `console.log()`, `console.warn()`, `console.error()` statements
- [ ] No commented-out code (delete or uncomment)
- [ ] All imports use `@/` alias (no `../../../` paths)
- [ ] File in correct directory per organization rules
- [ ] Proper file naming (PascalCase components, camelCase utils)
- [ ] All colors from CSS variables (no `bg-[#ffffff]`)
- [ ] Typography from `typography.ts` (no inline text classes)
- [ ] 4px spacing grid (all margins/paddings multiples of 4)
- [ ] Icons from lucide-react only
- [ ] Keyboard navigation works (tab through elements)
- [ ] ARIA labels where needed (screen reader friendly)
- [ ] Focus indicators visible

### 6. Final Verification Steps
```bash
# 1. Build passes
npm run build && echo "✅ Build successful"

# 2. Lint passes  
npm run lint && echo "✅ Lint clean"

# 3. Start dev server
npm run dev

# 4. Manual browser testing
# - Open http://localhost:3000/
# - Check DevTools console (zero errors/warnings)
# - Test feature functionality
# - Toggle dark/light theme
# - Test on mobile viewport
# - Enable prefers-reduced-motion and test animations
```

---

## 📊 Deliverables

When you complete this task, provide:

### 1. Summary of Changes
- **Files modified**: List all changed files with brief description
- **Files created**: List all new files with purpose
- **Files deleted**: List all removed files with reason
- **Lines changed**: Approximate +/- line count

### 2. Implementation Details
- **Approach taken**: Explain your solution strategy
- **Key decisions**: Document important choices made
- **Trade-offs**: Note any compromises or alternatives considered
- **Patterns used**: Reference specific guidelines followed

### 3. Testing Evidence
```
✅ npm run build: PASSED (0 errors)
✅ npm run lint: PASSED (0 warnings)
✅ Browser console: CLEAN (0 errors, 0 warnings)
✅ Dark theme: TESTED ✓
✅ Light theme: TESTED ✓
✅ Mobile viewport: TESTED ✓
✅ Reduced motion: TESTED ✓
✅ Edge cases: TESTED ✓
```

### 4. Code Quality Metrics
- **Duplication**: None detected (or extracted to X component)
- **TypeScript coverage**: 100% (no `any` types)
- **Accessibility**: Full support (reduced motion, keyboard nav, ARIA)
- **Design system**: 100% compliant (no violations)
- **Security**: All inputs sanitized

### 5. Next Steps (if applicable)
- **Follow-up tasks**: List any remaining work
- **Known limitations**: Document any constraints
- **Future improvements**: Suggest optimizations
- **Documentation updates**: Note any docs that need updating

---

## 🚨 Red Flags - STOP if Any of These Occur

If you encounter ANY of these during implementation, STOP and report:

- ❌ TypeScript errors appear
- ❌ ESLint warnings appear
- ❌ Console errors in browser
- ❌ Need to create numbered variants (Button1, Button2)
- ❌ About to copy-paste component code (3+ duplicates)
- ❌ Need to use inline color values
- ❌ Need to write inline spring physics
- ❌ Need to use `any` type
- ❌ Need to use deep imports (`../../../`)
- ❌ Breaking existing functionality
- ❌ Cannot follow design system
- ❌ Security vulnerability introduced

**Action**: Report the blocker and ask for guidance rather than compromising quality.

---

## 💡 Helpful Commands Reference

### Development
```bash
npm run dev              # Start dev server (port 3000)
npm run build            # TypeScript check + production build
npm run lint             # ESLint check
npm run preview          # Preview production build
```

### Code Quality Audits
```bash
# Find inline animations (should use presets)
grep -r "stiffness:" src/ --include="*.tsx"

# Find unsanitized inputs (potential security issues)
grep -r "useState(" src/ --include="*.tsx" -A 2

# Find duplicate component patterns
grep -r "className=\"inline-flex items-center" src/

# Find deep imports (should use @ alias)
grep -r "from '../../../" src/

# Find any types (should be properly typed)
grep -r ": any" src/ --include="*.ts" --include="*.tsx"

# Find console statements (should be removed)
grep -r "console\." src/ --include="*.tsx"
```

### Testing Routes
- http://localhost:3000/ (Landing V2)
- http://localhost:3000/setup (Bill & People input)
- http://localhost:3000/assignment (Item assignment)
- http://localhost:3000/summary (Results & settlement)
- http://localhost:3000/analytics (Session insights)

---

## 📚 Quick Reference Links

| Need | File Path |
|------|-----------|
| Complete guidelines | `docs/core/DEVELOPMENT_GUIDELINES.md` |
| Daily cheat sheet | `docs/core/QUICK_REFERENCE.md` |
| Pre-commit checklist | `docs/core/PRE_COMMIT_CHECKLIST.md` |
| Executive summary | `docs/core/GUIDELINES_SUMMARY.md` |
| Project overview | `.github/copilot-instructions.md` |
| Design system | `MINIMALIST_DESIGN_SYSTEM.md` |
| Design quick ref | `docs/DESIGN_SYSTEM_QUICK_REFERENCE.md` |
| Animation presets | `src/lib/transitions.ts` |
| Typography scales | `src/lib/typography.ts` |
| Input sanitization | `src/lib/sanitize.ts` |
| Color system | `src/index.css` |
| Store architecture | `src/store/useStore.ts` |

---

## 🎯 Remember

> **"Will future me thank me for this decision?"**

- If creating duplicate code → Extract it (3+ rule)
- If writing inline styles → Use design system
- If adding `any` type → Use proper types
- If skipping sanitization → Add it (security!)
- If ignoring accessibility → Check reduced motion
- If bypassing lint → Fix the warnings
- If rushing quality → Slow down, do it right

**Quality over speed. Always.**

---

**Template Version**: 1.0  
**Last Updated**: October 29, 2025  
**Maintained By**: Development Team
```

---

## 📝 Usage Instructions

### For AI Coding Agents:
1. Copy the entire template above (between the ``` markers)
2. Replace the `[USER INPUT SECTION]` with actual task description
3. Fill in all context fields (Current Issue, Expected Behavior, Acceptance Criteria)
4. Follow ALL completion requirements before marking task done
5. Provide ALL deliverables listed in the template

### For Human Developers:
1. Use this template when requesting AI assistance
2. Fill in task description section thoroughly
3. Be specific in acceptance criteria
4. Review AI deliverables against checklist
5. Ensure all automated checks pass before merging

---

## ✅ Template Checklist

This template ensures:
- [x] Guidelines are read FIRST (mandatory opening section)
- [x] Context is understood BEFORE coding
- [x] Non-negotiables are crystal clear (zero tolerance items)
- [x] Task description has structured format
- [x] Completion requirements are comprehensive (6 categories, 40+ items)
- [x] Deliverables are well-defined (5 sections)
- [x] Red flags are identified upfront
- [x] Helpful commands provided for common tasks
- [x] Quick reference links readily accessible
- [x] Quality-first mindset reinforced

---

## 🚀 Example Usage

### Example 1: Bug Fix
```
[In USER INPUT SECTION, replace with:]

### Current Issue:
The ChapterBadge component in `src/features/landing-v2/components/ChapterBadge.tsx` 
has an animation that doesn't respect `prefers-reduced-motion`. When users have 
motion preferences disabled, the badge still animates on entrance.

### Expected Behavior:
Badge should appear instantly (no animation) when `prefers-reduced-motion` is enabled,
while maintaining smooth entrance animation for users without motion preferences.

### Acceptance Criteria:
- [ ] Badge uses `useReducedMotion()` hook
- [ ] Animation disabled when hook returns true
- [ ] Fallback to simple fade (duration: 0.2s) when reduced motion enabled
- [ ] Zero TypeScript errors
- [ ] Works in all 3 variants (primary, inverse, solid)

### Additional Context:
- File: `src/features/landing-v2/components/ChapterBadge.tsx`
- Related hook: `src/hooks/useReducedMotion.ts`
- Test with browser DevTools: Rendering > Emulate CSS media feature prefers-reduced-motion
```

### Example 2: New Feature
```
[In USER INPUT SECTION, replace with:]

### Current Issue:
Need to add a new "Loading" variant to the ChapterBadge component to show 
loading state during async operations (e.g., AI scanning).

### Expected Behavior:
ChapterBadge should support a 4th variant: "loading" with animated pulse effect
- Shows pulsing dot icon before text
- Respects reduced motion preferences
- Matches existing design system (grayscale only)

### Acceptance Criteria:
- [ ] New variant added to ChapterBadgeProps: variant: 'primary' | 'inverse' | 'solid' | 'loading'
- [ ] Loading dot uses Framer Motion for pulse animation
- [ ] Pulse disabled when prefers-reduced-motion enabled
- [ ] Updated JSDoc with loading variant example
- [ ] Zero duplicate code (reuses existing badge structure)
- [ ] Tested in dark/light themes

### Additional Context:
- File to modify: `src/features/landing-v2/components/ChapterBadge.tsx`
- Animation preset: Use `popIn` from `src/lib/transitions.ts` for pulse
- Icon: Use `Loader2` from lucide-react with spin animation
```

---

## 📌 Key Success Factors

### What Makes This Template Effective:

1. **Front-loads Guidelines** - Forces reading before coding
2. **Structured Task Input** - Prevents vague requirements
3. **Comprehensive Checklist** - 40+ items, nothing forgotten
4. **Clear Red Flags** - Know when to stop and ask
5. **Quality Gates** - Automated + manual verification
6. **Complete Deliverables** - No ambiguity on what's needed
7. **Reference Links** - Quick access to all docs
8. **Examples Included** - Shows proper usage

### Expected Outcomes:

- ✅ 100% guideline compliance
- ✅ Zero TypeScript/ESLint errors
- ✅ Zero console warnings
- ✅ Complete documentation
- ✅ Full test coverage
- ✅ Security best practices
- ✅ Accessibility support
- ✅ Design system adherence

---

**Use this template for EVERY AI coding task to ensure consistent, high-quality results.** 🚀
