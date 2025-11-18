# ScanToSplit.ai - Complete Implementation Blueprint

## 📋 Overview

This blueprint is the **single source of truth** for building ScanToSplit.ai from scratch. It documents the **actual implemented application** (November 2025), not just design specifications.

**Purpose**: Enable any engineering team to recreate this premium bill-splitting application with 100% accuracy, preserving all premium features, animations, and user experience details.

## 🎯 What This Blueprint Covers

### Part 1: Foundation & Core Systems
**File**: `01-foundation-core-systems.md`
- Technology stack (React 18.3, TypeScript 5.5, Vite 5.4)
- Design system (colors, typography, spacing)
- Motion system (43 animation presets)
- State management (9 Zustand slices)
- Security (XSS prevention)
- Performance architecture

### Part 2: Landing Page & App Shell
**File**: `02-landing-page-app-shell.md`
- Cinematic scroll-sequencing landing page
- Hero section with Lottie animations
- Features showcase with staggered reveals
- USP section with scroll-linked visuals
- App header navigation
- Route structure with lazy loading
- Error boundaries and loading states

### Part 3: Setup Flow (Bill & Participants)
**File**: `03-setup-flow-bill-participants.md`
- ScanPortal with AI-powered receipt scanning
- DataHub unified card architecture
- ItemsList with collapsible header
- PremiumItemCard and PremiumSectionHeader
- Participants management with avatars
- Currency selector
- Category taxonomy system (51 categories)

### Part 4: Assignment & Summary
**File**: `04-assignment-summary-export.md`
- Item assignment with participant palette
- Custom split popover with validation
- Groups functionality
- Summary page with settlement calculations
- PDF export (lazy-loaded jsPDF)
- Image export with Web Share API
- Analytics dashboard

### Part 5: Premium Patterns & Quality
**File**: `05-premium-patterns-quality.md`
- Glass morphism design system
- Tactile feedback patterns
- Typography hierarchy (40+ variants)
- Responsive breakpoints
- Accessibility implementation
- Performance optimizations
- Pre-commit checklist (40+ checks)
- Testing strategies

## 📊 Implementation Status

✅ **Fully Implemented Features**:
- [x] Landing page with cinematic scroll
- [x] AI receipt scanning (Gemini 1.5 Flash)
- [x] Dual-mode bill management (merged/separate)
- [x] Unified card DataHub architecture
- [x] Custom split logic with validation
- [x] PDF export with compressed receipts
- [x] Image export with Web Share API
- [x] Theme toggle (light/dark/system)
- [x] Internationalization (en/de)
- [x] XSS sanitization
- [x] Error boundaries
- [x] Route-based code splitting
- [x] Glass morphism premium UI
- [x] Reduced motion support
- [x] Fine-grained Zustand selectors

## 🏗️ Architecture Highlights

### State Management (Zustand)
```
9 Domain Slices:
├── itemsSlice.ts      (90 lines)
├── participantsSlice.ts (90 lines)
├── receiptsSlice.ts    (180 lines)
├── uiSlice.ts         (80 lines)
├── groupsSlice.ts     (120 lines)
├── undoSlice.ts       (80 lines)
├── modalsSlice.ts     (60 lines)
├── settingsSlice.ts   (50 lines)
└── scanningSlice.ts   (70 lines)
```

### Bundle Architecture
```
Main bundle:        587 kB (190 kB gzipped)
Landing chunk:      353 kB (89 kB gzipped)
Setup chunk:        190 kB (57 kB gzipped)
Assignment chunk:    54 kB (18 kB gzipped)
Summary chunk:       48 kB (14 kB gzipped)
PDF export:         359 kB (lazy-loaded)
AI scanning:         28 kB (lazy-loaded)
Image export:       215 kB (lazy-loaded)
```

### Motion Library
```
43 Named Presets:
├── Physics (springTransition, smoothSlow, smoothNormal)
├── Tactile (buttonTactile, cardTactile, safeTactile)
├── Layout (staggerContainer, fadeInUp, slideInRight)
└── Special (gentleLand, popIn, layoutTransition)
```

## 🎨 Design Philosophy

**Inspired by**: Apple iOS minimalism + Revolut premium feel

**Key Principles**:
1. **Glass Morphism**: `bg-card/50 backdrop-blur-sm` throughout
2. **Tactile Feedback**: Every interaction feels physical
3. **Reduced Motion**: Full accessibility support
4. **Typography**: 40+ semantic scales, auto-responsive
5. **No Magic Values**: Named presets only, no inline animations
6. **Security First**: DOMPurify sanitization on all user input

## 🚀 Quick Start Guide

### For Developers Reading This Blueprint:

1. **Start with Part 1** (Foundation) - Understand tech stack and core systems
2. **Read Part 2** (Landing & Shell) - Learn app structure and routing
3. **Study Part 3** (Setup Flow) - Master the most complex feature (DataHub)
4. **Review Part 4** (Assignment) - Understand split logic and calculations
5. **Reference Part 5** (Patterns) - Apply premium patterns throughout

### For Project Managers:

- **Estimated Timeline**: 8-12 weeks for experienced React team
- **Team Size**: 2-3 developers (1 senior, 1-2 mid-level)
- **Critical Skills**: React 18+, TypeScript, Framer Motion, Zustand
- **External Dependencies**: Google Gemini API (AI scanning)

## 📝 How to Use This Blueprint

### During Development:
```bash
# Check blueprint before implementing features
grep -r "feature-name" docs/new_blueprint/

# Verify implementation matches spec
npm run build  # Must pass with 0 errors
npm run lint   # Must pass with 0 warnings
```

### During Code Review:
- Cross-reference PR changes with blueprint sections
- Verify naming conventions match (e.g., `PremiumItemCard` not `ItemCard`)
- Check motion presets are from `@/lib/motion/` (no inline physics)
- Confirm sanitization on user inputs

### During Testing:
- Use blueprint's accessibility checklist (Part 5)
- Test all responsive breakpoints documented
- Verify reduced motion behavior matches specs

## 🔗 Related Documentation

- **Original Blueprint**: `docs/architecture/blueprint.md` (2027 lines, Oct 2024)
- **Development Guidelines**: `docs/core/DEVELOPMENT_GUIDELINES.md` (1,956 lines)
- **Pre-Commit Checklist**: `docs/core/PRE_COMMIT_CHECKLIST.md` (40+ checks)
- **Store Architecture**: `src/store/README.md` (302 lines)
- **Copilot Instructions**: `.github/copilot-instructions.md` (Active guidelines)

## 📅 Version History

- **v1.0** (November 18, 2025) - Initial comprehensive blueprint
  - Documents fully implemented application
  - 5-part modular structure
  - Every component, hook, and utility documented
  - Performance metrics included
  - Premium patterns codified

## ⚠️ Critical Notes

1. **This is NOT aspirational** - Everything documented here is already built and working
2. **Dependencies are FROZEN** - No `npm install` without explicit approval
3. **TypeScript must be STRICT** - Zero errors in production build
4. **Motion presets are MANDATORY** - Never use inline `stiffness:` values
5. **Sanitization is NON-NEGOTIABLE** - All user input → `sanitizeInput()`

## 🎯 Success Criteria

Your implementation is complete when:
- ✅ `npm run build` passes with 0 TypeScript errors
- ✅ `npm run lint` passes with 0 warnings
- ✅ All 40+ pre-commit checks pass
- ✅ Bundle sizes match documented metrics (±10%)
- ✅ Lighthouse scores: Performance 90+, Accessibility 100
- ✅ All animations respect `prefers-reduced-motion`
- ✅ App works offline with localStorage persistence

---

**Last Updated**: November 18, 2025  
**Blueprint Version**: 1.0.0  
**Application Version**: Production-ready  
**Maintainer**: Development Team
