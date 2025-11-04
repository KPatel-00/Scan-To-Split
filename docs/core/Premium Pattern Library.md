# The Premium Pattern Library

## Advanced Recipes for an Ultimate Luxury Experience

### 1. Objective
This document is a living library of advanced UI/UX patterns. It is not a book of rules (that is the **"Premium App Guidelines"**). This is a "cookbook" of specific, high-impact "recipes" that *use* those rules to create a luxury, "Apple-like" user experience.

These patterns are for inspiration and implementation in key moments of the app.

### Section 1: "Storytelling" & Sequential Patterns
*Patterns that guide the user through a narrative, making a process feel like a story.*

#### Pattern 1.1: The "Cinematic Scroll"
* **What it is:** A technique for landing pages where scrolling through a "sticky" text column animates or cross-fades visuals in an adjacent "sticky" visual column.
* **Why it's Premium:** It transforms a boring "scroll-down" into a "journey." It's controlled, elegant, and feels like a high-budget commercial. It's the "Rolls Royce" effect.
* **The "Recipe":**
    1. Create a parent container with a large min-height (e.g., 400vh).
    2. Create a 2-column grid. The "Text" column scrolls normally. The "Visual" column is position: sticky and top: 0.
    3. Layer all visuals (e.g., 4 images) on top of each other in the sticky column using position: absolute.
    4. Use Framer Motion's useScroll({ target: parentRef }) hook to track scroll progress within the parent.
    5. Use useTransform(scrollYProgress, [inputRange], [outputRange]) to map scroll progress to the opacity of each visual. (e.g., as you scroll from 0 to 0.25, fade in visual 1; from 0.25 to 0.5, fade out visual 1 and fade in visual 2).
* **Mandate Check (Non-Negotiable):**
    * **Responsiveness (Mandate 6):** This pattern *must* be disabled on mobile. On mobile, it must reflow into a simple, stacked 1-column layout (Text, Visual, Text, Visual...) that uses the simple "Fade-in-on-View" pattern (see Pattern 4.3).
    * **Accessibility (Mandate 7):** Must respect prefers-reduced-motion. If true, disable the useScroll logic and simply fade in each section.


#### Pattern 1.2: The "Narrative" Loading Sequence
* **What it is:** Replacing a generic loading spinner with a multi-stage, human-readable *story* of what the app is doing. (From your blueprint's **Part 2, Sec 3**).
* **Why it's Premium:** It turns "waiting" (a negative) into "progress" (a positive). It builds trust by "showing its work" in a human, reassuring voice (Mandate 8).
* **The "Recipe":**
    1. Use a state machine or simple useState to cycle through a list of "loading messages" (e.g., ['Got it!', 'Let's see what we have here...', 'Reading the fine print...']).
    2. Use a setTimeout or Promise.all to progress through the states.
    3. Use &lt;AnimatePresence mode="wait"> to wrap the text. This ensures the old text animates *out* before the new text animates *in*, creating a clean, sequential effect.
    4. Pair each message with a distinct, subtly animated lucide-react icon.
* **Mandate Check (Non-Negotiable):**
    * **Accessibility (Mandate 7):** The text *must* be in an aria-live="polite" region so a screen reader user experiences the same narrative.


### Section 2: "Intelligent" & Proactive Patterns
*Patterns that make the app feel like a smart assistant, not a dumb tool.*

#### Pattern 2.1: The "Proactive Suggestion"
* **What it is:** Using a user's history to proactively suggest an action, saving them time. (From your blueprint's **Part 3, Sec 4**).
* **Why it's Premium:** This is the ultimate "luxury" feature. The app anticipates the user's *intent* ("Split like last time?"). It shows the app is learning and is truly "smart."
* **The "Recipe":**
    1. On a key action (e.g., "save split"), store a simplified version of the data in localStorage (e.g., {"Shared Appetizer": ["UserA", "UserB"]}).
    2. The *next time* the user encounters that same context (e.g., opens the "Split" popover for "Shared Appetizer"), check localStorage for a match.
    3. If a match exists, render a new, high-priority Button (e.g., "Split like last time?") in the popover.
    4. Clicking this button bypasses the form and applies the saved data directly.
* **Mandate Check (Non-Negotiable):**
    * **Logic (Mandate 5):** This is a *suggestion*, not a replacement. The user must still be able to use the form manually.


#### Pattern 2.2: The "Pure Undo" Flow
* **What it is:** A non-blocking, non-dialog flow for destructive actions. (From **Mandate 5**).
* **Why it's Premium:** It's frictionless. It respects the user's flow and intelligence. "Are you sure?" dialogs are "cheap" friction; "Undo" is "expensive" (in dev time) but feels "luxury."
* **The "Recipe":**
    1. On onClick (e.g., "Delete Item"), *do not* show a Dialog.
    2. Store the *current* state of the item/list in a temporary variable.
    3. *Immediately* apply the change to the Zustand store (the UI updates instantly).
    4. *Immediately* call the shadcn/ui Toast component with a 5-second timer.
    5. This Toast *must* have an action button (e.g., "Undo").
    6. The onUndo callback for this button *must* re-apply the *old* state to the Zustand store, reverting the change.
* **Mandate Check (Non-Negotiable):**
    * **Logic (Mandate 5):** This pattern is *mandatory* for item-level edits/deletes. Dialogs are *forbidden* for this, reserved only for session-ending actions.


### Section 3: "Tactile" & Native-Feel Patterns
*Patterns that make the web app feel like a physical, native iOS app.*

#### Pattern 3.1: Gesture-Based Dismissal
* **What it is:** Allowing a user to "flick" or "drag" a modal or side-drawer to close it, in addition to clicking a button.
* **Why it's Premium:** It feels physical, tactile, and *native*. It's how all iOS apps work.
* **The "Recipe":**
    1. On the motion.div for a modal panel or side-drawer, add the Framer Motion drag prop (e.g., drag="y" for a modal, drag="x" for a drawer).
    2. Add dragConstraints to limit the drag.
    3. Add an onDragEnd handler. Inside this handler, inspect the offset and velocity.
    4. If the user has dragged past a certain threshold (e.g., offset.y > 100), call the onClose() function.
    5. Pair this with the useReducedMotion hook (Mandate 7).
* **Mandate Check (Non-Negotiable):**
    * **Accessibility (Mandate 7):** A visible "Close" button *must* still exist for keyboard and non-gesture users.


#### Pattern 3.2: "Magic Motion" (layoutId & layout prop)
* **What it is:** An animation where the UI *intelligently reflows itself* without any jumps.
* **Why it's Premium:** This is the "magic" in Apple's UI. It makes the UI feel like physical objects on a table.
* **The "Recipe" (for Lists):**
    1. On *any* mapped list (.map()), add the layout prop to the child motion component (&lt;motion.li layout>).
    2. Wrap the list in &lt;AnimatePresence>.
    3. That's it. When you add/remove/filter the list, all other items will *automatically* animate to their new positions.
* **The "Recipe" (for Tabs - "Shared Layout"):**
    1. For a tabbed navigation, map the tabs.
    2. Wrap the *entire* tab list in &lt;LayoutGroup>.
    3. If a tab is "active," render a *separate* &lt;motion.div> for the "active indicator" (the underline or pill).
    4. Give this indicator a layoutId prop (e.g., &lt;motion.div layoutId="active-pill" />).
    5. When the active tab changes, Framer Motion will "see" the layoutId has moved and will *magically animate* the pill from its old position to its new one.
* **The "Recipe" (for Scroll-Based Active States):**
    1. Use useScroll() to track scroll position, create a scrollYProgress value with container/target refs.
    2. Transform scroll progress to activeIndex: `useTransform(scrollYProgress, [0, 1], [0, items.length - 1])`.
    3. For each item, use useTransform with index-based ranges:
       * `opacity = useTransform(activeIndex, [i-0.5, i, i+0.5], [0.3, 1, 0.3])`
       * `scale = useTransform(activeIndex, [i-0.5, i, i+0.5], [0.98, 1, 0.98])`
    4. This creates smooth transitions as scroll progresses, with active item at full opacity/scale.
    5. Always check `useReducedMotion()` and disable scale transforms if true (keep opacity for visibility).
* **Standard Button Spring:** All button interactions should use:
  * stiffness: 400
  * damping: 15
  * This provides a fast, responsive "snap" that feels premium
* **Mandate Check (Non-Negotiable):**
    * **Performance (Mandate 4):** This is GPU-accelerated and follows our guidelines.
    * **Accessibility (Mandate 7):** Disable scale transforms when prefersReducedMotion is true.


### Section 4: "Delight & Polish" Patterns
*The "obsessive" final 1% that demonstrates craftsmanship.*

#### Pattern 4.1: The "Drawing" Checkmark
* **What it is:** A micro-interaction where a checkmark or icon "draws" itself on-screen.
* **Why it's Premium:** It's pure, obsessive craftsmanship. It provides a moment of "delight" on a tiny scale.
* **The "Recipe":**
    1. Use a motion.svg component for your checkmark icon.
    2. Inside, use motion.path for the &lt;path> element.
    3. Set the path's d attribute to the SVG path data.
    4. Animate two SVG properties: pathLength and pathOffset.
    5. **Animate:** initial={{ pathLength: 0 }} and animate={{ pathLength: 1 }}.
    6. Wrap this in &lt;AnimatePresence> to have it "draw" on enter and "un-draw" on exit.
* **Mandate Check (Non-Negotiable):**
    * **Accessibility (Mandate 7):** Must respect prefers-reduced-motion (replace with a simple fade).


#### Pattern 4.2: The "Celebratory Moment"
* **What it is:** Rewarding a user for completing a difficult or multi-step task with a "moment" of celebration. (From your blueprint's **Part 4, Sec 2**).
* **Why it's Premium:** It creates a positive emotional connection. It turns a "task completed" into a "job well done," making the user feel successful.
* **The "Recipe":**
    1. Install a lightweight confetti library (e.g., react-confetti).
    2. When the user navigates to the *final* "Summary" page, trigger the confetti burst to run for 3-5 seconds.
    3. **Crucially:** Combine this with our other patterns. The confetti bursts *first*, and *then* the Summary Cards animate in using the gentleLand physics (Pattern 3.2). This creates an *orchestrated sequence*.
* **Mandate Check (Non-Negotiable):**
    * **Accessibility (Mandate 7):** *Must* be disabled if prefers-reduced-motion is true.


#### Pattern 4.3: The "Cross-Fade" Skeleton Loader
* **What it is:** A skeleton loader that *gracefully cross-fades* with the real content, instead of the content "popping" in.
* **Why it's Premium:** It avoids a jarring "flash" of content. It makes the transition from "loading" to "loaded" feel smooth and imperceptible.
* **The "Recipe":**
    1. Create a standardized shadcn/ui Skeleton loader component.
    2. In your data-fetching component, use a single &lt;AnimatePresence mode="wait"> wrapper.
    3. Use a ternary: {isLoading ? &lt;SkeletonLoader key="loader" /> : &lt;Content key="content" />}.
    4. The mode="wait" prop is *essential*. It forces Framer Motion to wait for the &lt;SkeletonLoader> to finish its exit animation before starting the &lt;Content>'s enter animation.
    5. **Animation:**
        * SkeletonLoader: exit={{ opacity: 0 }}
        * Content: initial={{ opacity: 0 }}, animate={{ opacity: 1 }}
* **Mandate Check (Non-Negotiable):**
    * **Performance (Mandate 4):** This only animates opacity, so it's perfectly performant.


#### Pattern 4.4: The "Attention Pulse" (Hero CTA Only)
* **What it is:** A subtle, finite pulse animation on icons within hero CTA buttons to draw attention.
* **Why it's Premium:** Guides the user's eye to the primary action without being distracting. Creates a sense of "aliveness."
* **The "Recipe":**
    1. Wrap the icon inside the button with motion.span
    2. Animate scale: animate={{ scale: [1, 1.15, 1] }}
    3. Configure transition:
        * duration: 1.2 seconds
        * repeat: Infinity
        * ease: "easeInOut"
        * repeatDelay: 0.3 seconds
    4. Set style={{ display: 'inline-block' }} for transform to work
    5. **MUST** check useReducedMotion() - disable animation if true
* **Mandate Check (Non-Negotiable):**
    * **Accessibility (Mandate 7):** Must be disabled if prefers-reduced-motion ✅
    * **Usage:** Hero CTA only, not global buttons ✅
    * **Performance (Mandate 4):** Animates transform (scale) only ✅
* **Example:**
    ```tsx
    <Button variant="hero" size="xl">
      <motion.span
        animate={!prefersReducedMotion ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.2, repeat: 2, ease: "easeInOut", repeatDelay: 0.8 }}
        style={{ display: 'inline-block' }}
      >
        <ScanLine className="w-5 h-5" />
      </motion.span>
      Scan Your First Bill
    </Button>
    ```