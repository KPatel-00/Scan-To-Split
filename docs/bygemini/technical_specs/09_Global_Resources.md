# 09. Global Resources & Design System

This document contains the source code for the global design system, ensuring the application's look, feel, and behavior can be perfectly replicated.

## 1. Typography System (`src/lib/typography.ts`)
**Philosophy:** Mobile-first, semantic naming, consistent line heights.

```typescript
/**
 * Typography System - Universal Design System
 */

export const display = {
  xxl: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  xl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  lg: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] [text-wrap:balance]',
  md: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  sm: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight [text-wrap:balance]',
} as const;

export const heading = {
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  h2: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight [text-wrap:balance]',
  h3: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight',
  h4: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-tight leading-snug',
  h5: 'text-base md:text-lg lg:text-xl font-semibold leading-snug',
  h6: 'text-sm md:text-base lg:text-lg font-semibold leading-snug',
} as const;

export const body = {
  xl: 'text-lg md:text-xl lg:text-2xl leading-relaxed',
  xlMuted: 'text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed',
  lg: 'text-base md:text-lg lg:text-xl leading-relaxed',
  lgMuted: 'text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed',
  md: 'text-sm md:text-base leading-normal',
  mdMuted: 'text-sm md:text-base text-muted-foreground leading-normal',
  sm: 'text-xs md:text-sm leading-normal',
  smMuted: 'text-xs md:text-sm text-muted-foreground leading-normal',
  xs: 'text-xs leading-snug',
  xsMuted: 'text-xs text-muted-foreground leading-snug',
} as const;

export const label = {
  lg: 'text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  sm: 'text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
} as const;

export const typography = { display, heading, body, label };
```

## 2. Global CSS & Theme (`src/index.css`)
**Philosophy:** Minimalist, variable-based theming, premium timing functions.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: 'Inter', system-ui, sans-serif;
    --header-height: 4rem;
    
    /* Minimalist Light Theme */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    
    /* Premium Timing Functions */
    --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .dark {
    /* Minimalist Dark Theme */
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    font-family: var(--font-inter);
  }
  
  /* Premium smooth color transitions for theme changes - Optimized hybrid approach */
  /* Transition only on elements that need it, not everything */
  body,
  header,
  main,
  footer,
  [class*="bg-"],
  [class*="text-"],
  [class*="border-"] {
    transition-property: background-color, border-color, color, background, box-shadow;
    transition-timing-function: var(--ease-smooth);
    transition-duration: var(--duration-normal);
  }
  
  /* Prevent transition on page load */
  .preload * {
    transition: none !important;
  }
  
  /* Exception: Keep framer-motion animations separate */
  [data-framer-motion],
  .framer-motion-ignore {
    transition: none !important;
  }
  
  /* ✨ Premium GPU acceleration for interactive elements */
  button,
  a,
  [role="button"],
  .gpu-accelerate {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* ✨ View Transition API support for ultra-smooth theme switching */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: var(--duration-normal);
    animation-timing-function: var(--ease-smooth);
  }
}

/* ✨ Premium Accessibility - Skip to Main Content Link */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: var(--z-toast);
  padding: 1rem 1.5rem;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition-property: left, transform;
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--ease-smooth);
  transform: translateZ(0);
  will-change: transform, left;
}

.skip-to-content:focus {
  left: 1rem;
  outline: 3px solid hsl(var(--ring));
  outline-offset: 2px;
  transform: translateZ(0) scale(1.02);
}

/* ✨ Scroll Margin for Anchor Links - Prevents sticky header overlap */
:root {
  scroll-margin-top: 80px;
}

:target {
  scroll-margin-top: 80px;
  scroll-padding-top: 80px;
}

/* ✨ Premium Glassmorphism Header Effect */
@layer components {
  .glass-header {
    /* Semi-transparent background with theme awareness */
    background: linear-gradient(
      to bottom,
      hsl(var(--background) / 0.9),
      hsl(var(--background) / 0.75)
    );
    
    /* Enhanced backdrop blur for frosted glass effect */
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    
    /* Subtle inset shadow for depth */
    box-shadow: 
      inset 0 1px 0 0 hsl(var(--foreground) / 0.05),
      0 1px 2px 0 hsl(var(--foreground) / 0.05);
    
    /* ✨ Premium transitions using CSS variables */
    transition-property: background, border-color, box-shadow;
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-smooth);
    
    /* ✨ Force hardware acceleration for smoother rendering */
    transform: translateZ(0);
    will-change: background, border-color, box-shadow;
  }
  
  /* Dark mode enhancement */
  .dark .glass-header {
    background: linear-gradient(
      to bottom,
      hsl(var(--background) / 0.85),
      hsl(var(--background) / 0.7)
    );
    
    box-shadow: 
      inset 0 1px 0 0 hsl(var(--foreground) / 0.1),
      0 1px 3px 0 hsl(var(--foreground) / 0.2);
  }
}

/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .skip-to-content:focus {
    transition: none;
    transform: none;
  }
}

/* ✨ Premium smooth scrolling for non-reduced-motion users */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
  
  /* Buttery smooth scroll-snap for landing page */
  [data-scroll-container] {
    scroll-snap-type: y mandatory;
    scroll-snap-stop: always;
    
    /* Scroll padding prevents content from being hidden behind header */
    scroll-padding-top: 0;
    scroll-padding-bottom: 0;
    
    /* Smooth momentum scrolling on iOS */
    -webkit-overflow-scrolling: touch;
    
    /* GPU acceleration for smooth transforms */
    will-change: scroll-position;
    
    /* Prevent layout shift during scroll */
    overflow-anchor: none;
    
    /* REMOVED: contain: layout style paint; - This was blocking Intersection Observer! */
    
    /* Hide scrollbar for premium aesthetic */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  /* Hide scrollbar in Webkit browsers (Chrome, Safari, Opera) */
  [data-scroll-container]::-webkit-scrollbar {
    display: none;
  }
  
  /* Ultra-smooth snap points with optimized rendering */
  [data-chapter] {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    
    /* Prevent flicker during transitions */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    
    /* Optimize compositing layers */
    contain: layout style paint;
    content-visibility: auto;
  }
}

/* ============================================================================
 * GLOBAL RESPONSIVE UTILITIES
 * Pure CSS/Tailwind approach - SSR-safe, performant, declarative
 * ============================================================================ */

@layer utilities {
  /* Responsive containers - replaces ResponsiveLayout.tsx */
  .container-responsive {
    @apply px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16;
  }
  
  /* Responsive section spacing - replaces manual padding logic */
  .section-spacing {
    @apply py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24;
  }
  
  /* Responsive grid - auto-adapts columns based on viewport */
  .grid-responsive {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8;
  }
  
  /* Responsive flex - column on mobile, row on desktop */
  .flex-responsive {
    @apply flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8;
  }
  
  /* Hero section layout - 2-column on desktop, stacked on mobile */
  .hero-layout {
    @apply flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16;
  }
  
  /* Chapter container - full viewport height with responsive padding */
  .chapter-container {
    @apply min-h-screen flex items-center justify-center;
    @apply px-4 sm:px-6 md:px-8 lg:px-12;
    @apply py-12 sm:py-16 md:py-20 lg:py-24;
  }
  
  /* Centered content with max-width - replaces manual container logic */
  .content-center {
    @apply max-w-7xl mx-auto w-full;
  }
  
  /* Responsive text balance - prevents orphans on large screens */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Foldable-aware layouts - split across hinge */
  .fold-split {
    @apply flex flex-col fold-v:flex-row;
  }
  
  .fold-split > * {
    @apply w-full fold-v:w-1/2;
  }
  
  /* Flip phone flex mode - horizontal split (top/bottom) */
  .flip-split {
    @apply flex flex-col fold-h:flex-col h-screen;
  }
  
  .flip-split > * {
    @apply flex-1 fold-h:h-1/2;
  }
  
  /* Orientation-aware utilities */
  .portrait-stack {
    @apply flex flex-col portrait:flex-col landscape:flex-row;
  }
  
  .landscape-stack {
    @apply flex flex-row landscape:flex-row portrait:flex-col;
  }
  
  /* Responsive max-widths for content */
  .max-w-responsive {
    @apply max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl;
  }
  
  /* Responsive gap utilities */
  .gap-responsive {
    @apply gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12;
  }
  
  /* Ultra-wide desktop constraint (prevents content from being too wide) */
  .ultra-wide-container {
    @apply max-w-7xl mx-auto;
  }
}

/* ============================================================================
 * PREMIUM VISUAL EFFECTS & UTILITIES
 * Advanced effects for premium UI/UX
 * Merged from src/styles/premium.css for better maintainability
 * ============================================================================ */

@layer utilities {
  /* Premium Gradient Text */
  .gradient-text {
    background: linear-gradient(
      135deg,
      hsl(var(--foreground)) 0%,
      hsl(var(--muted-foreground)) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Premium Glass Effect */
  .glass-effect {
    background: hsl(var(--background) / 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid hsl(var(--border) / 0.5);
  }

  /* Premium Shadow Utilities */
  .shadow-premium {
    box-shadow: 
      0 1px 2px hsl(var(--foreground) / 0.05),
      0 4px 8px hsl(var(--foreground) / 0.08),
      0 12px 24px hsl(var(--foreground) / 0.12);
  }

  .shadow-premium-lg {
    box-shadow: 
      0 2px 4px hsl(var(--foreground) / 0.06),
      0 8px 16px hsl(var(--foreground) / 0.1),
      0 24px 48px hsl(var(--foreground) / 0.15);
  }

  /* Premium Focus Ring */
  .focus-premium:focus-visible {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* ✨ Smooth Scrolling Container */
  .smooth-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* ✨ Print Utilities - Accessibility & Utility */
  .no-print {
    display: none !important;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  /* Optimize for print - remove shadows and effects */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  /* Preserve text color for readability */
  body {
    color: #000 !important;
    background: #fff !important;
  }
}

@layer components {
  /* ✨ Premium Underline Effect - Interactive hover state */
  .premium-underline {
    position: relative;
    display: inline-block;
  }

  .premium-underline::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition-property: transform;
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-premium);
  }

  .premium-underline:hover::after {
    transform: scaleX(1);
  }
}

/* ============================================================================
 * CSS-ONLY ANIMATIONS
 * Only for effects that CANNOT be achieved with Framer Motion
 * (Background animations, shimmer effects, etc.)
 * ============================================================================ */

/* ✨ Smooth Gradient Shift - For animated backgrounds */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* ✨ Text Shimmer Effect - For loading/highlighting text */
@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.text-shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--foreground)) 0%,
    hsl(var(--primary)) 50%,
    hsl(var(--foreground)) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* ✨ Icon Pulse Animation - For CTA icon breathing effect */
@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.animate-icon-pulse {
  animation: icon-pulse 1.2s ease-in-out infinite;
  animation-delay: 0.3s;
  display: inline-block;
  transform-origin: center;
}

/* Reduced Motion Support for Premium Animations */
@media (prefers-reduced-motion: reduce) {
  .animate-gradient,
  .text-shimmer,
  .animate-icon-pulse,
  .premium-underline::after {
    animation: none;
    transition: none;
  }
}
```

## 3. Motion Physics (`src/lib/motion/physics.ts`)
**Philosophy:** Apple iOS / Revolut-level buttery-smooth motion.

```typescript
import { Transition } from 'framer-motion';

// Snappy (High responsiveness)
export const snappyFast: Transition = { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 };
export const snappyNormal: Transition = { type: 'spring', stiffness: 400, damping: 25, mass: 1 };

// Smooth (Natural movement)
export const smoothNormal: Transition = { type: 'spring', stiffness: 300, damping: 30, mass: 1 };
export const smoothSlow: Transition = { type: 'spring', stiffness: 200, damping: 30, mass: 1 };

// Bouncy (Playful feedback)
export const bouncyNormal: Transition = { type: 'spring', stiffness: 400, damping: 15, mass: 1 };
export const bouncySlow: Transition = { type: 'spring', stiffness: 300, damping: 15, mass: 1 };

// Gentle (Subtle transitions)
export const gentleNormal: Transition = { type: 'spring', stiffness: 150, damping: 20, mass: 1 };

// Easings
export const easings = {
  premium: [0.22, 1, 0.36, 1], // Apple-like easeOut
  smooth: [0.4, 0, 0.2, 1],    // Material Design standard
  bounce: [0.68, -0.55, 0.265, 1.55],
};
```

## 4. UI Component Registry (`components.json`)
**Philosophy:** Shadcn/UI based, customized for the project.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Installed Components
To replicate the UI, install these components via shadcn CLI:
`npx shadcn@latest add accordion alert animated-tooltip avatar badge button card carousel command dialog drawer dropdown-menu hover-card input label popover progress scroll-area select separator sheet skeleton slider switch tabs textarea toast toggle tooltip`

## 5. Internationalization (`src/lib/i18n/index.ts`)
**Philosophy:** Modular, eager-loaded for instant language switching.

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { de } from './locales/de';

const resources = { en, de };

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  debug: true,
  keySeparator: '.',
  nsSeparator: ':',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
```
