# Global Design System - Quick Reference Guide

## 🎨 Typography (`src/lib/typography.ts`)

### Hero/Landing Pages
```tsx
import { typography } from '@/lib/typography';

// Headlines
<h1 className={typography.landing.heroHeadline}>
  // text-5xl md:text-7xl font-bold tracking-tighter

<h1 className={typography.hero}>
  // text-5xl sm:text-6xl md:text-7xl lg:text-8xl

// Subtitles  
<p className={typography.landing.heroSubtitle}>
  // text-lg md:text-xl text-muted-foreground max-w-2xl

<p className={typography.heroSubtitle}>
  // text-lg sm:text-xl md:text-2xl text-muted-foreground
```

### Section Headings
```tsx
<h2 className={typography.landing.sectionHeading}>
  // text-4xl md:text-5xl font-bold tracking-tighter

<h2 className={typography.landing.featureHeading}>
  // text-3xl md:text-4xl font-bold tracking-tight
```

### Body Text
```tsx
<p className={typography.body.large}>
  // text-lg md:text-xl leading-relaxed

<p className={typography.body.largeMuted}>
  // text-lg md:text-xl text-muted-foreground leading-relaxed

<p className={typography.body.regular}>
  // text-base leading-normal
```

### Stats & Numbers
```tsx
<div className={typography.stats.hero}>
  // text-4xl md:text-5xl font-bold

<div className={typography.stats.large}>
  // text-3xl md:text-4xl font-bold
```

### CTAs & Buttons
```tsx
<Button className={typography.special.ctaLarge}>
  // text-base md:text-lg font-semibold

<Button className={typography.special.cta}>
  // text-sm md:text-base font-medium
```

---

## 🎬 Animations (`src/lib/transitions.ts`)

### Easing Curves
```tsx
import { smoothEasing } from '@/lib/transitions';

<motion.div
  transition={{ ease: smoothEasing }}
  // [0.22, 1, 0.36, 1] - Premium cubic-bezier
/>
```

### Spring Physics (Premium Pattern Library)
```tsx
// Standard button interactions (Pattern 3.2)
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
>
```

### Page Transitions
```tsx
import { pageEnterVariants, slideTransitions } from '@/lib/transitions';

<motion.div
  variants={pageEnterVariants}
  initial="initial"
  animate="animate"
  exit="exit"
/>
```

---

## 🎯 Premium CSS Utilities (`src/styles/premium.css`)

### Glass Effects
```tsx
<div className="glass-effect">
  // backdrop-filter: blur(12px)
  // background: hsl(var(--background) / 0.8)
  // border: 1px solid hsl(var(--border) / 0.5)
```

### Shadows
```tsx
<div className="shadow-premium">
  // Multi-layer subtle shadow

<div className="shadow-premium-lg">
  // Deeper shadow for elevated elements
```

### Animations
```tsx
<div className="animate-gradient">
  // 8s gradient shift animation

<div className="animate-premium-pulse">
  // 4s subtle pulse

<div className="animate-fade-in-up">
  // Fade in from bottom (0.6s)
```

### Text Effects
```tsx
<span className="text-shimmer">
  // Animated gradient text (3s linear)

<span className="gradient-text">
  // Static gradient text

<a className="premium-underline">
  // Smooth underline on hover
```

### Performance
```tsx
<div className="gpu-accelerate">
  // transform: translateZ(0)
  // backface-visibility: hidden

<div className="will-animate">
  // will-change: transform, opacity
```

---

## 🎨 Color System (`src/index.css`)

### CSS Variables (Auto-switching themes)
```tsx
// Backgrounds
bg-background      // Pure white (light) / Pure black (dark)
bg-card            // Card background
bg-muted           // Subtle gray backgrounds
bg-primary         // Black (light) / White (dark)

// Text
text-foreground         // Main text color
text-muted-foreground   // 45% gray (light) / 60% gray (dark)
text-primary            // Primary color
text-primary-foreground // Text on primary bg

// Borders
border-border      // 90% gray (light) / 15% gray (dark)
border-input       // Input borders

// Interactive
ring-ring          // Focus rings
```

### Usage Examples
```tsx
// Badge with opacity
<div className="bg-primary/10 text-primary">
  // 10% opacity primary background

// Glass effect
<div className="bg-muted/50 backdrop-blur-sm">
  // 50% muted background with blur

// Subtle border
<div className="border border-border/50">
  // 50% opacity border
```

---

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints
sm:   640px   // Small tablets
md:   768px   // Medium tablets  
lg:   1024px  // Laptops
xl:   1280px  // Desktop
2xl:  1536px  // Large desktop

// Usage
<h1 className="text-4xl md:text-6xl lg:text-8xl">
  // 4xl mobile, 6xl tablet, 8xl desktop
```

---

## ♿ Accessibility Patterns

### Reduced Motion Hook
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
  // Disable decorative animations
/>
```

### Focus Rings
```tsx
<button className="focus-premium">
  // 2px solid primary outline
  // 2px offset, 4px border-radius
```

---

## 🎭 Premium Animation Patterns

### Pattern 1: Drawing SVG (Pattern 4.1)
```tsx
<svg>
  <motion.path
    d="M2 10C60 2 140 2 198 10"
    initial={{ pathLength: 0, opacity: 0 }}
    whileInView={{ pathLength: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: smoothEasing }}
  />
</svg>
```

### Pattern 2: Staggered List Entrance
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.5,
      ease: smoothEasing,
      delay: index * 0.1  // Stagger by 0.1s
    }}
  >
))}
```

### Pattern 3: Interactive Button
```tsx
<motion.div
  whileHover={!prefersReducedMotion && { scale: 1.02 }}
  whileTap={!prefersReducedMotion && { scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
>
  <Button>Click me</Button>
</motion.div>
```

### Pattern 4: Animated Badge Icon
```tsx
<motion.div
  animate={!prefersReducedMotion && { rotate: [0, 5, -5, 0] }}
  transition={{ 
    duration: 2,
    repeat: Infinity,
    repeatDelay: 3,
    ease: "easeInOut"
  }}
>
  <Icon />
</motion.div>
```

### Pattern 5: Hover Lift Effect
```tsx
<motion.div
  whileHover={!prefersReducedMotion && { scale: 1.05, y: -2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
>
  <Card>...</Card>
</motion.div>
```

---

## 📦 Component Composition Example

**Complete Hero CTA Button (Production-ready)**
```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { typography } from '@/lib/typography';
import { smoothEasing } from '@/lib/transitions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

function HeroCTA() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: smoothEasing, delay: 0.7 }}
    >
      <motion.div
        whileHover={!prefersReducedMotion && { scale: 1.02 }}
        whileTap={!prefersReducedMotion && { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Button
          size="lg"
          className={cn(
            typography.special.ctaLarge,
            "px-10 h-14 shadow-premium gap-2"
          )}
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
```

---

## 🎯 Quick Decision Tree

**"What should I use for..."**

1. **Headlines?**
   - Landing page hero: `typography.landing.heroHeadline`
   - Section headers: `typography.landing.sectionHeading`
   - Feature titles: `typography.landing.featureHeading`

2. **Body text?**
   - Large descriptions: `typography.body.largeMuted`
   - Regular paragraphs: `typography.body.regular`
   - Small labels: `typography.body.small`

3. **Animations?**
   - All easing curves: `smoothEasing`
   - Button interactions: Spring (400/15)
   - Entrance stagger: 0.1s per item
   - Page transitions: `pageEnterVariants`

4. **Glass effects?**
   - Badges: `bg-primary/10 backdrop-blur-sm`
   - Pills: `bg-muted/50 backdrop-blur-sm`
   - Overlays: `glass-effect` class

5. **Shadows?**
   - Subtle elevation: `shadow-premium`
   - High elevation: `shadow-premium-lg`
   - Button emphasis: `shadow-lg shadow-primary/25`

6. **Reduced motion?**
   - Always check: `const prefersReducedMotion = useReducedMotion()`
   - Disable: scale, rotate, complex transforms
   - Keep: opacity, simple fades

---

## ✅ Production Checklist

Before committing any component:

- [ ] Uses `typography.*` for text sizing
- [ ] Uses `smoothEasing` for transitions
- [ ] Spring physics: 400/15 for buttons
- [ ] Checks `useReducedMotion()` for animations
- [ ] Uses CSS variables for colors
- [ ] Responsive at all breakpoints
- [ ] `[text-wrap:balance]` on headlines
- [ ] `viewport={{ once: true }}` on scroll animations
- [ ] Premium shadows on elevated elements
- [ ] Glass effect on overlays/badges

---

## 🔗 File References

```
Typography:       src/lib/typography.ts
Transitions:      src/lib/transitions.ts
Premium CSS:      src/styles/premium.css
Colors:           src/index.css
Reduced Motion:   src/hooks/useReducedMotion.ts
Pattern Library:  docs/architecture/Premium Pattern Library.md
Design System:    MINIMALIST_DESIGN_SYSTEM.md
```

---

## 💡 Pro Tips

1. **Don't hardcode values** - Always use typography constants
2. **Stagger reveals** - 0.1s delay per item feels natural
3. **Respect motion preferences** - Use `useReducedMotion()` everywhere
4. **GPU acceleration** - Add `gpu-accelerate` to animated elements
5. **One animation at a time** - Don't animate multiple properties
6. **Text wrapping** - Add `[text-wrap:balance]` to headlines
7. **Spring consistency** - Always use 400/15 for buttons
8. **Glass effect subtlety** - Use 50% opacity for backgrounds
9. **Shadow layering** - Multiple subtle shadows > one harsh shadow
10. **Viewport once** - Prevent re-animations on scroll

---

**Last Updated:** Phase 4 Complete - Hero Design System Integration
**Status:** Production-ready ✅
