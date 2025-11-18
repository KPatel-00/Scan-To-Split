# ScanToSplit.ai Blueprint Creation - 5-Part Breakdown

## 📋 Master TODO Checklist

**Created**: November 18, 2025  
**Goal**: Document every single implementation detail to enable 100% accurate app recreation

---

## ✅ Part 1: Foundation & Core Systems
**File**: `docs/new_blueprint/01-foundation-core-systems.md`  
**Est. Lines**: ~800-1000  
**Status**: 🔄 IN PROGRESS

### Sections to Document:

- [ ] **1.1 Technology Stack**
  - [ ] React 18.3 with TypeScript 5.5
  - [ ] Vite 5.4 build configuration
  - [ ] Key dependencies with exact versions
  - [ ] Development vs production configs

- [ ] **1.2 Project Structure**
  - [ ] Directory organization (src/, docs/, public/)
  - [ ] File naming conventions
  - [ ] Import alias configuration (@/)
  - [ ] Feature-based vs page-based organization

- [ ] **1.3 Design System**
  - [ ] Color palette (CSS variables)
  - [ ] Typography system (`src/lib/typography.ts` - 40+ variants)
  - [ ] Spacing system (4px grid)
  - [ ] Border radius standards
  - [ ] Theme system (light/dark/system)

- [ ] **1.4 Motion System**
  - [ ] 43 named presets in `src/lib/motion/`
  - [ ] Physics configurations (spring, smooth, etc.)
  - [ ] Tactile feedback patterns
  - [ ] `safeTactile` wrapper for accessibility
  - [ ] Reduced motion implementation

- [ ] **1.5 State Management (Zustand)**
  - [ ] 9 domain slices architecture
  - [ ] Fine-grained selector pattern
  - [ ] localStorage persistence
  - [ ] Hydration pattern with `useHydration()`
  - [ ] Dual-mode system (merged/separate)
  - [ ] Complete slice interfaces and actions

- [ ] **1.6 Security Architecture**
  - [ ] XSS prevention with DOMPurify
  - [ ] `sanitizeInput()` implementation
  - [ ] Input sanitization rules
  - [ ] API security patterns

- [ ] **1.7 Performance Architecture**
  - [ ] Bundle splitting strategy
  - [ ] Lazy loading patterns
  - [ ] Route-based code splitting
  - [ ] Lazy-loaded dependencies (PDF, AI, Image export)
  - [ ] Performance metrics

- [ ] **1.8 Internationalization (i18n)**
  - [ ] react-i18next setup
  - [ ] Language files structure
  - [ ] Translation key conventions
  - [ ] Language toggle implementation

- [ ] **1.9 Global Constants**
  - [ ] `src/lib/constants/app.ts`
  - [ ] APP_NAME, APP_TAGLINE, APP_WEBSITE
  - [ ] Feature flags
  - [ ] Configuration helpers

---

## ✅ Part 2: Landing Page & App Shell
**File**: `docs/new_blueprint/02-landing-page-app-shell.md`  
**Est. Lines**: ~700-900  
**Status**: ⏳ NOT STARTED

### Sections to Document:

- [ ] **2.1 Route Architecture**
  - [ ] React Router v6 setup
  - [ ] Route definitions with lazy loading
  - [ ] PageTransition component
  - [ ] Loading states (RouteLoadingScreen)

- [ ] **2.2 App Header**
  - [ ] Component structure (`src/components/AppHeader.tsx`)
  - [ ] Logo and APP_NAME usage
  - [ ] Theme toggle button
  - [ ] Language toggle button
  - [ ] Settings and help buttons
  - [ ] Responsive behavior

- [ ] **2.3 Landing Page Structure**
  - [ ] Overall layout (`src/pages/Landing.tsx`)
  - [ ] Section organization
  - [ ] Scroll behavior

- [ ] **2.4 Hero Section**
  - [ ] Layout and typography
  - [ ] CTA buttons
  - [ ] Lottie animation integration
  - [ ] Page load animation (NOT scroll-triggered)
  - [ ] Reduced motion support

- [ ] **2.5 Features Section**
  - [ ] 3-column grid layout
  - [ ] Feature cards structure
  - [ ] Staggered scroll-reveal animation
  - [ ] Icon usage from lucide-react
  - [ ] Responsive stacking

- [ ] **2.6 USP Section (Cinematic Scroll)**
  - [ ] Desktop: Sticky 2-column layout
  - [ ] Scroll-linked opacity transitions
  - [ ] useScroll and useTransform hooks
  - [ ] 4 feature visuals with animations
  - [ ] Mobile: Simple stacked layout
  - [ ] Visual components specifications

- [ ] **2.7 Error Boundaries**
  - [ ] react-error-boundary implementation
  - [ ] Fallback UI design
  - [ ] Error logging strategy
  - [ ] Recovery mechanisms

- [ ] **2.8 Loading States**
  - [ ] RouteLoadingScreen component
  - [ ] Skeleton loaders
  - [ ] Progress indicators
  - [ ] Initial app loading state

---

## ✅ Part 3: Setup Flow (Bill & Participants)
**File**: `docs/new_blueprint/03-setup-flow-bill-participants.md`  
**Est. Lines**: ~1000-1200  
**Status**: ⏳ NOT STARTED

### Sections to Document:

- [ ] **3.1 Setup Page Architecture**
  - [ ] Page structure (`src/pages/Setup.tsx`)
  - [ ] State machine (scanPortal, dataHub)
  - [ ] Component organization
  - [ ] useFileUpload hook

- [ ] **3.2 ScanPortal Component**
  - [ ] Component structure (refactored to 183 lines)
  - [ ] Upload dropzone with react-dropzone
  - [ ] Multi-file support (up to 3)
  - [ ] Image compression with browser-image-compression
  - [ ] File validation
  - [ ] Manual entry option

- [ ] **3.3 AI Scanning Flow**
  - [ ] Multi-stage animation sequence
  - [ ] Loading states with narrative text
  - [ ] Skeleton loaders
  - [ ] Error handling
  - [ ] Gemini 1.5 Flash API integration
  - [ ] Currency detection
  - [ ] Category extraction

- [ ] **3.4 Multi-Bill Management**
  - [ ] Choice modal trigger
  - [ ] Merged vs Separate modes
  - [ ] Mode switching logic
  - [ ] State updates

- [ ] **3.5 DataHub Architecture**
  - [ ] Unified card design
  - [ ] Premium UI upgrade (Nov 5, 2025)
  - [ ] Glass morphism styling

- [ ] **3.6 ItemsList Component**
  - [ ] Complete refactor (Nov 4, 2025)
  - [ ] Collapsible header
  - [ ] Inline bill info (not separate component)
  - [ ] Integrated search bar
  - [ ] Currency selector
  - [ ] Payer selector with stopPropagation
  - [ ] Expansion hint

- [ ] **3.7 PremiumItemCard Component**
  - [ ] Card structure
  - [ ] Category icon and badge
  - [ ] Item details display
  - [ ] Glass morphism styling
  - [ ] Tactile feedback
  - [ ] Negative price highlighting

- [ ] **3.8 PremiumSectionHeader Component**
  - [ ] 4 variants (default, success, info, warning)
  - [ ] Icon integration
  - [ ] Count display
  - [ ] Reusability pattern

- [ ] **3.9 Category Taxonomy System**
  - [ ] 24 merchandise categories
  - [ ] 15 grocery subcategories
  - [ ] 12 special line codes
  - [ ] Migration system
  - [ ] Helper functions
  - [ ] Emoji lookup

- [ ] **3.10 Participants Management**
  - [ ] ParticipantAvatar component
  - [ ] Add/remove participants
  - [ ] Color generation
  - [ ] Empty state
  - [ ] Groups functionality

- [ ] **3.11 Bill Modifiers**
  - [ ] Tax input
  - [ ] Tip input
  - [ ] Dual-mode handling
  - [ ] Verification card

---

## ✅ Part 4: Assignment & Summary
**File**: `docs/new_blueprint/04-assignment-summary-export.md`  
**Est. Lines**: ~900-1100  
**Status**: ⏳ NOT STARTED

### Sections to Document:

- [ ] **4.1 Assignment Page Architecture**
  - [ ] Page structure (`src/pages/Assignment.tsx`)
  - [ ] Layout organization
  - [ ] Conditional rendering based on mode

- [ ] **4.2 Participant Palette**
  - [ ] Sticky positioning on mobile
  - [ ] Avatar toggles
  - [ ] Selection state
  - [ ] Empty state with CTA

- [ ] **4.3 Item Assignment UI**
  - [ ] ItemCard in assignment context
  - [ ] Participant icon toggles
  - [ ] Assignment logic
  - [ ] Quick actions (assign all, clear all)

- [ ] **4.4 Custom Split Popover**
  - [ ] react-hook-form integration
  - [ ] 3 split modes (amount, percentage, shares)
  - [ ] Real-time validation
  - [ ] Live total calculation
  - [ ] Color-coded feedback
  - [ ] Responsive design

- [ ] **4.5 Groups Functionality**
  - [ ] Save group dialog
  - [ ] Load group dropdown
  - [ ] Habit recognition
  - [ ] Usage tracking

- [ ] **4.6 Summary Page Structure**
  - [ ] Page layout (`src/pages/Summary.tsx`)
  - [ ] Celebration animation
  - [ ] Section organization

- [ ] **4.7 Settlement Calculations**
  - [ ] Debt calculation algorithm
  - [ ] Proportional share logic
  - [ ] Tax/tip distribution
  - [ ] Settlement minimization

- [ ] **4.8 Participant Summary Cards**
  - [ ] Expandable design
  - [ ] Balance badges
  - [ ] Itemized list
  - [ ] Dual-mode rendering (merged/separate)
  - [ ] Empty state for no items

- [ ] **4.9 PDF Export**
  - [ ] Lazy-loaded jsPDF
  - [ ] Export data structure
  - [ ] PDF layout and styling
  - [ ] Multi-page support
  - [ ] Compressed receipt images
  - [ ] Settlement summary
  - [ ] Participant breakdowns

- [ ] **4.10 Image Export**
  - [ ] ShareableImageCard component
  - [ ] html-to-image lazy loading
  - [ ] Web Share API integration
  - [ ] Fallback download
  - [ ] Social media optimization (1.91:1 ratio)

- [ ] **4.11 Analytics Dashboard**
  - [ ] Session insights
  - [ ] Analytics calculations
  - [ ] Chart components
  - [ ] Statistics display

---

## ✅ Part 5: Premium Patterns & Quality
**File**: `docs/new_blueprint/05-premium-patterns-quality.md`  
**Est. Lines**: ~600-800  
**Status**: ⏳ NOT STARTED

### Sections to Document:

- [ ] **5.1 Glass Morphism System**
  - [ ] Base pattern: `bg-card/50 backdrop-blur-sm`
  - [ ] Border styling: `border border-border/40`
  - [ ] Shadow usage: `shadow-sm`
  - [ ] Gradient overlays
  - [ ] Application across components

- [ ] **5.2 Tactile Feedback Patterns**
  - [ ] buttonTactile preset
  - [ ] cardTactile preset
  - [ ] safeTactile wrapper
  - [ ] Reduced motion handling
  - [ ] Haptic feedback integration

- [ ] **5.3 Typography Hierarchy**
  - [ ] Display scales (xs, sm, md, lg, xl, 2xl)
  - [ ] Heading scales (h1-h6)
  - [ ] Body scales (xs, sm, md, lg, xl)
  - [ ] Responsive behavior
  - [ ] Usage guidelines

- [ ] **5.4 Responsive Design Patterns**
  - [ ] Breakpoints (xs: 414px, sm: 640px, md: 768px, lg: 1024px, xl: 1366px, 2xl: 1920px)
  - [ ] Mobile-first approach
  - [ ] Logical adaptation examples
  - [ ] Touch target sizes
  - [ ] Custom variants (portrait, landscape, fold)

- [ ] **5.5 Accessibility Implementation**
  - [ ] ARIA labels throughout
  - [ ] Focus management
  - [ ] Screen reader support
  - [ ] Color contrast verification
  - [ ] Semantic HTML usage
  - [ ] Keyboard navigation

- [ ] **5.6 Performance Optimizations**
  - [ ] GPU-accelerated animations
  - [ ] Bundle splitting metrics
  - [ ] Lazy loading strategy
  - [ ] Image optimization
  - [ ] Tree shaking

- [ ] **5.7 Code Quality Standards**
  - [ ] Component structure rules
  - [ ] Import organization
  - [ ] Naming conventions
  - [ ] DRY principles
  - [ ] TypeScript strict mode

- [ ] **5.8 Pre-Commit Checklist**
  - [ ] 40+ quality checks
  - [ ] Build verification
  - [ ] Lint checks
  - [ ] TypeScript compilation
  - [ ] Bundle size limits
  - [ ] Accessibility audit

- [ ] **5.9 Testing Strategy**
  - [ ] Component testing approach
  - [ ] E2E test scenarios
  - [ ] Accessibility testing
  - [ ] Performance testing
  - [ ] Cross-browser verification

- [ ] **5.10 Deployment & CI/CD**
  - [ ] Build process
  - [ ] Environment variables
  - [ ] Production optimizations
  - [ ] Hosting considerations

---

## 📊 Progress Tracking

### Overall Completion: 5%

| Part | File | Lines | Status | Completion |
|------|------|-------|--------|------------|
| README | `README.md` | ~200 | ✅ DONE | 100% |
| Part 1 | `01-foundation-core-systems.md` | ~1000 | 🔄 IN PROGRESS | 0% |
| Part 2 | `02-landing-page-app-shell.md` | ~900 | ⏳ NOT STARTED | 0% |
| Part 3 | `03-setup-flow-bill-participants.md` | ~1200 | ⏳ NOT STARTED | 0% |
| Part 4 | `04-assignment-summary-export.md` | ~1100 | ⏳ NOT STARTED | 0% |
| Part 5 | `05-premium-patterns-quality.md` | ~800 | ⏳ NOT STARTED | 0% |
| **TOTAL** | **6 files** | **~5200 lines** | **🔄 IN PROGRESS** | **5%** |

---

## 🎯 Success Criteria

Blueprint is complete when:
- ✅ All 6 files created
- ✅ ~5200+ total lines documented
- ✅ Every component has implementation details
- ✅ Every hook has usage examples
- ✅ Every utility has code snippets
- ✅ All animations have preset names and physics
- ✅ All state slices have full interface definitions
- ✅ Performance metrics included
- ✅ Accessibility patterns documented
- ✅ Code examples for critical patterns
- ✅ Migration notes from original blueprint
- ✅ Version history tracked

---

## 📝 Notes for Blueprint Writers

### Critical Requirements:

1. **NO ASPIRATIONAL CONTENT**: Document what IS built, not what SHOULD be
2. **CODE SNIPPETS**: Include actual implementation code, not pseudocode
3. **EXACT NAMES**: Use real component names from codebase
4. **FILE PATHS**: Provide actual file locations
5. **METRICS**: Include real bundle sizes, line counts, performance numbers
6. **VISUAL EXAMPLES**: Describe UI with ASCII art where helpful
7. **DEPENDENCIES**: List exact package names and versions
8. **CROSS-REFERENCES**: Link to related sections in other parts

### Quality Checklist for Each Section:

- [ ] Clear objective stated
- [ ] Implementation status noted (✅ Fully Implemented, 🔄 Partial, ⏳ Not Implemented)
- [ ] File paths provided
- [ ] Code examples included
- [ ] Props/interfaces documented
- [ ] Dependencies listed
- [ ] Performance notes
- [ ] Accessibility considerations
- [ ] Migration notes (if different from original blueprint)
- [ ] Related components referenced

---

**Last Updated**: November 18, 2025  
**Next Review**: After Part 1 completion  
**Maintainer**: Development Team
