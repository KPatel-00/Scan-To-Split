# Pre-Commit Checklist

**Use this before every commit to maintain code quality**

---

## 🔍 Automated Checks

### 1. TypeScript Compilation
```bash
npm run build
```
**Status**: [ ] PASSED (zero errors)

**If failed**: 
- Check terminal output for error locations
- Fix all TypeScript errors before proceeding
- Common issues: missing types, import errors, wrong prop types

---

### 2. ESLint Check
```bash
npm run lint
```
**Status**: [ ] PASSED (zero warnings)

**If failed**:
- Review warnings in terminal
- Fix all linting issues (no exceptions)
- Common issues: unused variables, missing dependencies, console.log

---

## ✅ Manual Checks

### Code Quality
- [ ] **No console.log()** - Remove all debugging statements
- [ ] **No console.warn()** - No warnings in production code
- [ ] **No console.error()** - Use proper error handling
- [ ] **No commented code** - Delete or uncomment
- [ ] **No TODO comments** without GitHub issue reference
- [ ] **All imports use `@/` alias** - No `../../../` paths
- [ ] **File in correct directory** - features/ vs components/
- [ ] **Proper file naming** - PascalCase for components, camelCase for utils

---

### Design System Compliance
- [ ] **All colors from CSS variables** - No `bg-[#ffffff]` or inline styles
- [ ] **Typography from typography.ts** - Use `typography.hero`, etc.
- [ ] **All animations use named presets** - Import from `@/lib/transitions.ts`
- [ ] **4px spacing grid** - All margins/paddings multiples of 4px
- [ ] **Icons from lucide-react** - No other icon libraries

---

### Security & Performance
- [ ] **All user input sanitized** - Use `sanitizeInput()` before storage
- [ ] **No `any` types** - Proper TypeScript types everywhere
- [ ] **No hardcoded API keys** - Use environment variables
- [ ] **Images optimized** - Compressed and properly sized
- [ ] **No unnecessary re-renders** - Use fine-grained Zustand selectors

---

### Accessibility
- [ ] **useReducedMotion() checked** - All animations respect motion preferences
- [ ] **Keyboard navigation works** - Tab through interactive elements
- [ ] **Proper ARIA labels** - Screen reader friendly
- [ ] **Color contrast sufficient** - Min 4.5:1 for text
- [ ] **Focus indicators visible** - Can see focused elements

---

### Component Standards
- [ ] **JSDoc header added** - Document purpose and usage
- [ ] **Props properly typed** - No missing TypeScript interfaces
- [ ] **Examples in documentation** - Show how to use component
- [ ] **Variants clearly defined** - Document all prop options
- [ ] **Error boundaries where needed** - Wrap complex components

---

### State Management
- [ ] **Fine-grained selectors** - Not grabbing entire store
- [ ] **Actions in correct slice** - Domain-appropriate location
- [ ] **No duplicate state** - Check if state already exists
- [ ] **Proper hydration handling** - Use `useHydration()` if needed

---

### Testing
- [ ] **Tested in browser** - Zero console errors/warnings
- [ ] **Tested light/dark theme** - Both modes work correctly
- [ ] **Tested mobile viewport** - Responsive design works
- [ ] **Tested with reduced motion** - Animations disabled properly
- [ ] **Tested edge cases** - Empty states, max limits, errors

---

## 🔄 Refactoring Checks

### Duplication
- [ ] **No duplicated components** - Check for 3+ similar code blocks
- [ ] **No duplicated logic** - Extract to utility if repeated
- [ ] **No duplicated styles** - Use Tailwind classes or design tokens
- [ ] **No duplicated types** - Share TypeScript interfaces

### File Organization
- [ ] **Component in right location** - Global vs feature-specific
- [ ] **Imports properly ordered** - External, components, hooks, utils, types
- [ ] **File size under limits** - <300 lines for components, <200 for utils
- [ ] **No deep nesting** - Max 4 levels from `src/`

---

## 📝 Documentation

- [ ] **README updated** if new feature
- [ ] **copilot-instructions.md updated** if new pattern
- [ ] **Component usage documented** in JSDoc header
- [ ] **Breaking changes noted** in commit message
- [ ] **Migration path documented** if refactoring

---

## 🚀 Commit Message

### Format
```
type(scope): brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3

[Optional: Breaking changes, migration notes]
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring (no behavior change)
- `docs:` Documentation only
- `style:` Code style (formatting, no logic change)
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Build process, dependencies

### Examples
```
✅ feat(landing): add ChapterBadge reusable component

- Created ChapterBadge with 3 variants and 3 sizes
- Migrated 8 files to use new component
- Reduced code by 180 lines
- Added reduced motion support

✅ fix(assignment): sanitize item names before storage

- Added sanitizeInput() to item creation
- Fixed XSS vulnerability in item notes
- Updated all input handlers

✅ refactor(animations): consolidate to named presets

- Moved all spring values to transitions.ts
- Replaced 47 inline animations with gentleLand preset
- Added JSDoc to all animation presets
```

---

## ⚠️ Pre-Commit Failures

### If TypeScript Build Fails
```bash
# See detailed errors
npm run build

# Common fixes
- Add missing type imports
- Fix prop type mismatches
- Add return types to functions
- Resolve module path errors
```

### If ESLint Fails
```bash
# See detailed warnings
npm run lint

# Common fixes
- Remove unused imports
- Add missing dependencies to useEffect
- Remove console.log statements
- Fix spacing/formatting issues
```

### If Browser Tests Fail
```bash
# Check console in DevTools
- Fix any errors (red text)
- Fix any warnings (yellow text)
- Verify animations work
- Test theme toggle
```

---

## ✨ Final Verification

Before committing, verify:

1. **Build Success**: `npm run build` exits with code 0
2. **Lint Success**: `npm run lint` shows "0 warnings"
3. **Browser Clean**: DevTools console shows no errors/warnings
4. **Code Quality**: All manual checks above are complete
5. **Documentation**: Changes are documented appropriately

---

## 🎯 Quick Commands

```bash
# Run all checks at once
npm run build && npm run lint

# Start dev server to test
npm run dev

# Check bundle size
npm run build
du -sh dist/

# Find potential issues
grep -r "console.log" src/ --include="*.tsx"
grep -r "any" src/ --include="*.ts"
grep -r "stiffness:" src/ --include="*.tsx"
```

---

## 📌 Remember

**"Zero tolerance for errors"**
- TypeScript errors: 0
- ESLint warnings: 0
- Console errors: 0
- Console warnings: 0

**"Quality over speed"**
- Better to spend 5 minutes on checks than 5 hours debugging later
- Every shortcut creates technical debt
- Future you will thank present you

---

**Print this checklist and check off items before every commit!** ✅
