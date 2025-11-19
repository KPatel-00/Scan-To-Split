# 04. Motion System Specifications

ScanToSplit.ai uses a centralized physics-based animation system. All animations must use these presets.

## 1. Physics Presets (`src/lib/motion/physics.ts`)

### `snappyFast`
*   **Use for:** Micro-interactions, toggles, icon buttons.
*   **Config:** `{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }`

### `smoothNormal`
*   **Use for:** Standard UI elements, buttons, tabs.
*   **Config:** `{ type: 'spring', stiffness: 350, damping: 35, mass: 0.8 }`

### `gentleNormal`
*   **Use for:** Large content entry, cards, lists.
*   **Config:** `{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }`

## 2. Entry Animations (`src/lib/motion/entry.ts`)

### `fadeInUp`
The standard entry animation for content.
```typescript
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: gentleNormal 
  }
};
```

### `staggerContainer`
Used on parent lists to cascade children.
```typescript
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};
```

## 3. Tactile Feedback (`src/lib/motion/tactile.ts`)

### `cardTactile`
Used on `PremiumItemCard`.
```typescript
export const cardTactile = {
  hover: { 
    scale: 1.02, 
    y: -2,
    transition: smoothNormal 
  },
  tap: { 
    scale: 0.98,
    transition: snappyFast 
  }
};
```

## 4. Accessibility Wrapper
All tactile animations must be wrapped in `safeTactile`:

```typescript
// Usage
<motion.div {...safeTactile(cardTactile, prefersReducedMotion)}>
```
If `prefersReducedMotion` is true, this function returns an empty object, disabling the physics.
