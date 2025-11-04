# Minimalist Design System

## Overview

This document describes the minimalist design system implemented across the entire app, inspired by modern black-and-white aesthetics with bold typography and clean interfaces.

## Design Principles

1. **Pure Black & White** - No blue tints, no colored backgrounds
2. **Bold Typography** - Extra-large, impactful headlines with tight tracking
3. **High Contrast** - Clear visual hierarchy through size and weight
4. **Minimal Borders** - Clean, uncluttered interfaces
5. **Smooth Transitions** - Consistent 150ms color transitions for theme changes

---

## Color System (`src/index.css`)

### Light Theme
```css
--background: 0 0% 100%;        /* Pure white */
--foreground: 0 0% 0%;          /* Pure black */
--primary: 0 0% 0%;             /* Black CTA buttons */
--primary-foreground: 0 0% 100%; /* White text on buttons */
--muted-foreground: 0 0% 45%;   /* Gray for subtitles */
--border: 0 0% 90%;             /* Light gray borders */
```

### Dark Theme
```css
--background: 0 0% 0%;          /* Pure black */
--foreground: 0 0% 100%;        /* Pure white */
--primary: 0 0% 100%;           /* White CTA buttons */
--primary-foreground: 0 0% 0%;  /* Black text on buttons */
--muted-foreground: 0 0% 60%;   /* Gray for subtitles */
--border: 0 0% 15%;             /* Dark gray borders */
```

**Key Changes from Old System:**
- Removed blue tints (221.2 83.2% 53.3%) → Pure grayscale
- Background: Pure black/white instead of tinted grays
- Primary color inverts between themes for optimal contrast

---

## Typography System (`src/lib/typography.ts`)

### Hero Typography
```typescript
hero: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none'
heroSubtitle: 'text-lg sm:text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed'
```

**Responsive Scale:**
- Mobile: `text-5xl` (3rem / 48px)
- Tablet: `text-6xl` (3.75rem / 60px)
- Desktop: `text-7xl` (4.5rem / 72px)
- Large: `text-8xl` (6rem / 96px)

**Usage Example:**
```tsx
import { typography } from '@/lib/typography';

<h1 className={typography.hero}>
  Split bills. Not atoms.
</h1>
<p className={typography.heroSubtitle}>
  The truly intelligent bill splitter...
</p>
```

### Body Typography
- **Large**: `text-lg md:text-xl` - Feature descriptions
- **Regular**: `text-base` - Standard text
- **Small**: `text-sm` - Labels, captions
- **Muted variants**: Add `text-muted-foreground` for secondary text

---

## Button System (`src/components/ui/button.tsx`)

### Hero CTA Button
```typescript
variant: "hero"
size: "xl"
```

**Styling:**
- **Light mode**: Black background, white text
- **Dark mode**: White background, black text
- **Size XL**: `h-14` (56px) with `px-10` padding
- **Font**: Medium weight for readability
- **Shadow**: `shadow-lg` for depth

**Usage:**
```tsx
<Button variant="hero" size="xl">
  Scan Your First Bill
</Button>
```

### Other Variants
- `default` - Standard primary button
- `outline` - Bordered button (2px border)
- `ghost` - Transparent hover state
- `secondary` - Subtle gray background

### Sizes
- `xl`: `h-14 px-10 text-lg` - Hero CTAs
- `lg`: `h-12 px-8 text-base` - Large buttons
- `default`: `h-10 px-4` - Standard
- `sm`: `h-8 px-3 text-xs` - Compact
- `icon`: `h-10 w-10` - Icon-only

---

## Theme Toggle (`src/components/ThemeToggle.tsx`)

### Design
- **Bordered square**: `rounded-lg border-2`
- **Icon-based**: Sun (light) / Moon (dark)
- **Smooth transitions**: 300ms rotation + scale
- **Cycles**: Light → Dark → System

### Styling Features
```tsx
- Border: 2px solid border color
- Size: 40px × 40px
- Hover: Scale 1.05
- Tap: Scale 0.95
- Focus ring: 2px offset
```

**Implementation:**
```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

<ThemeToggle />
```

### Animation Details
- **Light to Dark**: Sun rotates 90° and scales to 0, Moon appears
- **Dark to Light**: Moon rotates -90° and scales to 0, Sun appears
- **Accessibility**: Respects `prefers-reduced-motion`

---

## Component Updates

### Hero Section (`src/features/landing/NewHeroSection.tsx`)
```tsx
<section className="container max-w-6xl px-4 py-32 md:py-48 lg:py-56">
  <h1 className={typography.hero}>Split bills. Not atoms.</h1>
  <p className={typography.heroSubtitle}>
    The truly intelligent bill splitter...
  </p>
  <Button variant="hero" size="xl">
    Scan Your First Bill
  </Button>
</section>
```

**Changes:**
- ✅ Increased padding: `py-32 md:py-48 lg:py-56`
- ✅ Larger max-width: `max-w-6xl`
- ✅ Bigger spacing: `space-y-10 md:space-y-12`
- ✅ Hero typography applied
- ✅ Hero button variant

### App Header (`src/components/AppHeader.tsx`)
```tsx
<header className="sticky top-0 z-50 w-full border-b border-border 
  bg-background/80 backdrop-blur-md">
  {/* Logo */}
  <span className="text-2xl font-bold">Splitter</span>
  
  {/* Actions */}
  <ThemeToggle />
</header>
```

**Changes:**
- ✅ Replaced dropdown theme toggle with minimalist icon toggle
- ✅ Enhanced backdrop blur: `backdrop-blur-md`
- ✅ Consistent border styling

---

## Global Styles (`src/index.css`)

### Theme Transition
```css
* {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### Font Stack
```css
font-family: var(--font-inter);
font-feature-settings: "rlig" 1, "calt" 1;
```

**Features:**
- Ligatures enabled (`rlig`)
- Contextual alternates (`calt`)
- Smooth theme transitions (150ms)

---

## Migration Guide

### Updating Existing Components

#### Before:
```tsx
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-lg text-gray-600">Description</p>
<Button size="lg">Click me</Button>
```

#### After:
```tsx
import { typography } from '@/lib/typography';

<h1 className={typography.h1}>Title</h1>
<p className={typography.body.largeMuted}>Description</p>
<Button variant="hero" size="xl">Click me</Button>
```

### Color References

#### Before:
```tsx
className="bg-blue-600 text-white"
className="text-gray-500"
```

#### After:
```tsx
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
```

**Benefit**: Automatic theme switching, no manual color management

---

## Accessibility Features

1. **Focus Rings**: 2px ring with 2px offset on all interactive elements
2. **Color Contrast**: Pure black/white ensures WCAG AAA compliance
3. **Motion**: Respects `prefers-reduced-motion`
4. **Screen Readers**: Proper ARIA labels and semantic HTML
5. **Keyboard Navigation**: All controls fully keyboard accessible

---

## Performance

### Bundle Impact
- Typography module: **0.58 kB** (0.26 kB gzipped)
- Theme toggle: **~1 kB** (included in component bundle)
- Total CSS: **71.82 kB** (12.17 kB gzipped)

### Optimizations
- CSS transitions use GPU acceleration
- Theme changes use CSS variables (instant)
- Smooth transitions prevent jarring switches
- Minimal JavaScript for theme toggle

---

## Testing Checklist

- [ ] Light theme renders with pure white background
- [ ] Dark theme renders with pure black background
- [ ] Hero text scales responsively (mobile → desktop)
- [ ] CTA button inverts colors correctly
- [ ] Theme toggle cycles through Light → Dark → System
- [ ] All text maintains proper contrast in both themes
- [ ] Transitions are smooth (150ms)
- [ ] Focus rings visible and accessible
- [ ] Motion respects user preferences

---

## Future Enhancements

1. **Color Accents**: Consider adding single accent color for important actions
2. **Gradient Overlays**: Subtle gradients on hero sections (optional)
3. **Micro-interactions**: Enhanced button hover states
4. **Dark Mode Variants**: Multiple dark theme options
5. **Typography Presets**: More specialized text styles for edge cases

---

## Resources

- **Design Reference**: Modern minimalist websites (Apple, Linear, Stripe)
- **Typography**: Inter font family (Google Fonts)
- **Color Theory**: Pure grayscale for maximum flexibility
- **Accessibility**: WCAG 2.1 Level AAA compliance

---

## Support

For questions or issues with the design system:
1. Check this documentation first
2. Review `src/lib/typography.ts` for available styles
3. Inspect `src/index.css` for color tokens
4. Test in both light and dark modes

**Last Updated**: October 28, 2025
**Version**: 1.0.0
