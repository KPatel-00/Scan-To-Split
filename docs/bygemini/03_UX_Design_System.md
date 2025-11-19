# 03. User Experience (UX) & Design System

**"Ultimate Premium"** is not just a buzzword; it is the strict design standard enforced in the codebase. This document outlines the visual and interactive language of ScanToSplit.ai.

---

## 1. Visual Language: "Glass & Light"
The design system is built on **Tailwind CSS** and **Shadcn/UI**, customized to mimic the feel of high-end native applications (iOS/Revolut).

*   **Glassmorphism:** We use `bg-card/50` and `backdrop-blur-sm` extensively. Cards feel like frosted glass floating over the background, creating depth and hierarchy.
*   **Gradients:** Subtle gradients (`bg-gradient-to-br`) are used in headers and premium cards to add vibrancy without clutter.
*   **Typography:** We use a strictly defined type scale (`src/lib/typography.ts`) based on **Inter**. We avoid "magic numbers" and stick to semantic classes like `typography.display.md` or `typography.body.lg`.
*   **Theme Awareness:** The app features a fully optimized Dark Mode. Colors are defined via CSS variables (HSL values), allowing instant, smooth transitions between Light and Dark themes.

## 2. Motion Design: The "Physics" of Feel
Motion is not an afterthought; it is a core library (`src/lib/motion/`). We use **Framer Motion** to create a physics-based environment.

### A. The Physics Presets
We do not use linear animations. We use springs that mimic the real world:
*   **`gentleLand`:** Used for lists and cards. Items don't just appear; they slide in and settle softly.
*   **`snappyFast`:** Used for micro-interactions (toggles, checks) that need to feel instant but fluid.
*   **`bouncyNormal`:** Used for playful elements like the "Success" checkmark.

### B. Tactile Feedback
Every interactive element provides feedback:
*   **`cardTactile`:** Hovering over a card causes it to lift slightly (`scale: 1.02`) and cast a deeper shadow.
*   **`buttonTactile`:** Clicking a button causes a subtle "press" effect (`scale: 0.95`), mimicking a physical button.

### C. Narrative Animation
*   **The Scanner:** When processing a receipt, we don't show a spinner. We show a "Scanner" animation—a glowing bar passing over a skeleton receipt—visually explaining that the AI is "reading" the document.
*   **Staggered Lists:** Items load in a cascade (`staggerChildren`), making the data feel manageable rather than overwhelming.

### D. Sound Design (Sensory Feedback)
To complete the sensory experience, we use a custom `SoundManager` (Web Audio API) to synthesize sounds in real-time (no external assets).
*   **Success Chime:** A two-tone sine wave sequence (C5 → E5) confirms successful actions.
*   **Error Tone:** A descending square wave sequence (400Hz → 300Hz) provides clear negative feedback.
*   **Soft Click:** A high-frequency sine blip (800Hz, 0.05s) accompanies interactions.
*   **Scanning Hum:** A modulated square wave sequence mimics the sound of a physical scanner.
*   *Note: Sound is disabled by default and respects system "Silent Mode" settings.*

## 3. Accessibility (A11y)
A premium experience must be inclusive.
*   **Reduced Motion:** We use a custom hook `useReducedMotion()` to detect system preferences. If a user prefers less motion, all "bouncy" physics are automatically replaced with simple cross-fades.
*   **Screen Readers:** All interactive elements have `aria-labels`. The AI processing steps use `aria-live` regions to announce progress to visually impaired users.
*   **Keyboard Navigation:** Full focus management ensures users can navigate the entire app using only the Tab key.

## 4. Onboarding & Guided Tours
We don't leave users to figure it out alone.
*   **Initial Tour:** A "Driver.js" powered tour introduces the 3-step workflow on the first visit.
*   **Page-Aware Help:** A persistent "Help" button triggers a tour specific to the *current* page (e.g., explaining how to "paint" assignments when on the Assignment page).
*   **Contextual Tooltips:** Complex features (like "Separate Mode") have `(?)` icons that reveal helpful explanations on hover.

## 5. The "Premium" Components
We have built specific components to enforce this quality:
*   **`PremiumItemCard`:** A specialized card for items that handles the glass effect, layout, and tactile behavior automatically.
*   **`PremiumSectionHeader`:** A reusable header with variants (Default, Success, Info, Warning) to ensure consistent typography and spacing.

---
*Next: User Flows & Navigation.*
