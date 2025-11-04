# The "Premium App" Developer Guidelines

## A Single Source of Truth for Building with an Ultimate Premium Feel

### 1. Objective
This document is the single source of truth for all UI/UX development. Its purpose is to ensure every new component, feature, or function adheres to the same "buttery smooth," premium, and obsessively consistent principles as a native Apple iOS or Revolut application.


### 2. The Core DNA (The "Stack" Mandate)
This is the non-negotiable tech stack. Do not use alternatives.
* **UI Components:** **shadcn/ui ONLY.** All interactive elements (buttons, inputs, dialogs, cards) *must* be built using this library. Do not use native HTML elements like &lt;button> or &lt;input> directly.
* **Icons:** **lucide-react ONLY.** All icons *must* be from this library to ensure 100% visual consistency.
* **Animation:** **Framer Motion ONLY.** All UI animation (page transitions, interactions, layout changes) *must* be implemented with this library.
* **State Management:** **Zustand ONLY.** All global and feature-level state *must* be managed in a Zustand store. This is the single source of truth.
* **Forms & Logic:** **react-hook-form ONLY.** All forms *must* use this library for validation and state management.
* **Security:** **DOMPurify ONLY.** All user-provided strings (participant names, item names) *must* be sanitized with DOMPurify *before* being written to the Zustand store.
* **Contextual Help:** **Driver.js** (for tours) and **shadcn/ui Tooltip** (for ? icons) are the *only* approved help components.


### 3. The Visual & Spacing Mandate (The "Look")
How all new components must look and be spaced.
* **Grid System:** **4px Grid ONLY.** All margin, padding, and gap values *must* be a multiple of 4px (e.g., p-1 (4px), p-3 (12px), p-6 (24px)). The previous 8px grid is deprecated.
* **Color Palette:** **Semantic Variables ONLY.** Never hard-code colors. *All* colors (text, background, border) *must* use the pre-defined CSS variables from the shadcn/ui theme (e.g., var(--background), var(--foreground), var(--primary), var(--destructive)).
* **Typography:** **Inter font ONLY.** All text must use the Inter font, inheriting from the body tag.
* **Text Wrapping:** Use `text-wrap: balance` for all headings (h1-h3) to prevent orphan words and improve readability.
* **Border Radius:** **Strict Consistency.**
    * **12px (rounded-xl):** For all major containers (Card).
    * **8px (rounded-lg):** For all interactive elements (Button, Input).
* **UI Materials:** **backdrop-blur is mandatory** for all "overlaying" elements (modals, popovers, sticky headers) to create a layered, "glassmorphism" effect.


### 4. The Motion & Interaction Mandate (The "Feel")
How all new components must move and react.
* **The Golden Rule:** **Animate transform & opacity ONLY.** Never animate width, height, margin, or padding. This is non-negotiable for 60fps performance.
* **Use Named Physics:** Do not invent new animations. All motion *must* use the centrally-defined Framer Motion physics from the blueprint:
    * **popIn:** For all modals, popovers, and badges appearing.
    * **gentleLand:** For all list items and cards "settling" into place.
    * **Page Transitions:** Use the spring physics defined in the blueprint.
* **Tactile Feedback:** All interactive elements (Button, Card) *must* have:
    * **whileHover:** A subtle "lift" (e.g., scale: 1.03, y: -3).
    * **whileTap:** A fast "press" (e.g., scale: 0.95).
* **Haptic Feedback:** Key affirmative mobile actions (e.g., "Add Item," "Copy Summary") *must* trigger the triggerHaptic() utility.
* **"Magic Motion":** *All* mapped lists (.map()) that can be filtered, re-ordered, or have items added/removed *must* use the **layout prop** on their child motion component. Layout "jumps" are forbidden.
* **Conditional UI:** *All* components that appear/disappear ({isOpen && ...}) *must* be wrapped in **&lt;AnimatePresence>** to ensure they animate in and out. "Popping" is forbidden.


### 5. The Logic & UX Mandate (The "Brain")
How all new components must think and handle state.
* **The "Pure Undo" Mandate:** **This is a core philosophy.**
    * **DO:** Use the shadcn/ui Toast (with a 5-second "Undo" button) for all common, non-critical destructive actions (e.g., delete item, edit item, clear assignments).
    * **DO NOT:** Use "Are you sure?" shadcn/ui Dialog confirmations for these actions. The "Undo" flow *replaces* them.
* **Dialogs vs. Toasts:**
    * **shadcn/ui Toast (Undo):** For reversible, item-level actions.
    * **shadcn/ui Dialog (Confirm):** Reserved *only* for "session-ending" actions where Undo is not possible (e.g., "Start New Bill").
* **Empty States:** **No blank containers.** Every list, table, or content area that *can* be empty *must* render a standardized "Empty State" component (with an illustration and helpful micro-copy).
* **State-Aware Buttons:** All form submission Button components *must*:
    1. Be disabled if the form is invalid.
    2. Show an *inline* spinner (replacing icon/text) and be disabled while isSubmitting to prevent double-clicks.
* **Security:** All user-provided strings *must* be passed through DOMPurify.sanitize() *before* being written to the Zustand store.


### 6. The Layout & Responsiveness Mandate (The "Fit")
How all new components must adapt to different screens.
* **Mobile-First:** Design all new components for a narrow viewport first.
* **Fluid Containers:** Use w-full + max-w-[1024px] for all page content. Do not use fixed widths (e.g., width: 300px).
* **Logical Adaptation:** Components *must* logically reflow, not just shrink.
    * **Example:** A 3-column Card grid on desktop *must* stack to a 1-column layout on mobile. A horizontal card layout *must* reflow its children vertically. Use flex-wrap and responsive grid templates.
* **Tap Targets:** All interactive elements *must* have a minimum tap target of 44x44px (e.g., p-3) on mobile, even if the visible icon is smaller.


### 7. The Accessibility & Performance Mandate (The "Foundation")
The non-negotiable requirements for a professional-grade app.
* **Reduced Motion:** *All* Framer Motion animations *must* be conditional on the useReducedMotion() hook. If true, all physics-based animations *must* be replaced with a simple, fast opacity fade.
* **Keyboard Navigation:** All new interactive components *must* be fully keyboard-operable, with a clear, styled focus-visible ring.
* **Focus Traps:** All modals (Dialog, Popover, drawers) *must* trap keyboard focus.
* **ARIA Attributes:** All custom components *must* have correct ARIA roles and attributes (e.g., role="switch", aria-checked). Any text that updates asynchronously (like the AI scan) *must* be in an aria-live="polite" region.
* **Code Splitting:**
    * New routes *must* be loaded using React.lazy().
    * Heavy, non-critical libraries (like a new charting or export library) *must* be lazy-loaded on-demand (e.g., on button click).
* **Error Boundaries:** New complex features should be wrapped in their own React &lt;ErrorBoundary> to prevent a single component from crashing the entire page.


### 8. The Voice & Content Mandate (The "Personality")
How all new text and micro-copy must be written.
* **Voice:** **"Helpful, Reassuring, Clear, Subtly Witty."**
* **Micro-copy:**
    * **Bad:** Error: 500. Operation failed.
    * **Good:** Oops! We couldn't save that. Please try again in a moment.
* **Contextual Help:** Do not let the user guess. If a feature is complex (e.g., "Why is this 'Difference' red?"), add a shadcn/ui Tooltip with a ? icon to explain it clearly and concisely.