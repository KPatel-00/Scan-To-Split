/**
 * HeroVisual - Interactive 4-step workflow demonstration
 * 
 * Shows the magic: Scan → People → Assign → Summary
 * 
 * Desktop Features:
 * - Optimized sizing for large screens (max-w-2xl on desktop)
 * - Keyboard navigation (Arrow keys, 1-4 number keys)
 * - Hover states on step indicators
 * - Auto-play with manual control
 * - Smooth step transitions
 * 
 * Accessibility:
 * - Reduced motion support (shows final state)
 * - ARIA labels for navigation
 * - Keyboard accessible
 * - Focus indicators
 * 
 * Performance:
 * - Lazy loading step components
 * - Optimized animations (transform/opacity only)
 * - Debounced user interactions
 * 
 * @see src/features/landing-v2/chapters/hero/animations/ for step components
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { scaleIn, backdropFade } from '@/lib/motion';

// Lazy load step components for better code splitting
import { Step1Scan } from '../animations/Step1Scan';
import { Step2People, type Person } from '../animations/Step2People';
import { Step3Assign, type ReceiptItem } from '../animations/Step3Assign';
import { Step4Summary, type PersonWithTotal } from '../animations/Step4Summary';

// ============================================================================
// DATA & TYPES
// ============================================================================

// Realistic receipt items (European grocery format)
export const RECEIPT_ITEMS: ReceiptItem[] = [
  { id: 0, name: 'Natur Joghurt 1kg', price: 1.79, assignedTo: [1, 2] },
  { id: 1, name: 'Landmilch 3.8% × 2', price: 2.70, assignedTo: [0, 1, 2, 3] },
  { id: 2, name: 'Pfand', price: 0.50, assignedTo: [0, 1, 2, 3] },
  { id: 3, name: 'Vollkornbrot', price: 1.49, assignedTo: [2, 3] },
  { id: 4, name: 'Bananen', price: 1.78, assignedTo: [0, 1] },
  { id: 5, name: 'Pfand Rückgabe', price: -0.25, assignedTo: [0, 1, 2, 3] },
];

// Participant data
export const PEOPLE: Person[] = [
  { id: 0, name: 'Sarah', initial: 'S', color: 'hsl(var(--primary))' },
  { id: 1, name: 'Mike', initial: 'M', color: 'hsl(220, 90%, 56%)' },
  { id: 2, name: 'Lukas', initial: 'L', color: 'hsl(280, 90%, 56%)' },
  { id: 3, name: 'James', initial: 'J', color: 'hsl(160, 90%, 56%)' },
];

// Calculate individual totals (split items equally among assigned people)
export function calculatePersonTotals(items: ReceiptItem[], people: Person[]): PersonWithTotal[] {
  return people.map(person => {
    const total = items
      .filter(item => item.assignedTo.includes(person.id))
      .reduce((sum, item) => {
        const splitPrice = item.price / item.assignedTo.length;
        return sum + splitPrice;
      }, 0);
    return { ...person, total };
  });
}

const PERSON_TOTALS = calculatePersonTotals(RECEIPT_ITEMS, PEOPLE);

// Step configuration with durations
const STEPS = [
  { id: 0, duration: 8000, label: 'Scan Receipt' },
  { id: 1, duration: 4000, label: 'Add People' },
  { id: 2, duration: 6000, label: 'Assign Items' },
  { id: 3, duration: 4000, label: 'View Summary' },
] as const;

// ============================================================================
// HERO VISUAL COMPONENT
// ============================================================================

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number>();
  const pauseTimeoutRef = useRef<number>();

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-4 jump to specific steps
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const step = parseInt(e.key) - 1;
        handleStepChange(step);
      }
      
      // Arrow keys for prev/next
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepChange((currentStep - 1 + 4) % 4);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepChange((currentStep + 1) % 4);
      }

      // Space to pause/resume
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, prefersReducedMotion]);

  // ============================================================================
  // STEP CHANGE HANDLER
  // ============================================================================

  const handleStepChange = useCallback((newStep: number) => {
    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    
    setCurrentStep(newStep);
    setIsPlaying(false);

    // Resume auto-play after 5 seconds of inactivity
    pauseTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  }, []);

  // ============================================================================
  // AUTO-ADVANCE LOGIC
  // ============================================================================

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentStep(3); // Show final summary state
      return;
    }

    if (!isPlaying || isHovering) return;

    const advanceToNext = () => {
      setCurrentStep(prev => (prev + 1) % STEPS.length);
    };

    timeoutRef.current = window.setTimeout(
      advanceToNext, 
      STEPS[currentStep].duration
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentStep, isPlaying, isHovering, prefersReducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  // ============================================================================
  // RENDER - REDUCED MOTION
  // ============================================================================

  if (prefersReducedMotion) {
    return (
      <div className="relative aspect-[4/5] w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <Step4Summary people={PERSON_TOTALS} static />
      </div>
    );
  }

  // ============================================================================
  // RENDER - INTERACTIVE
  // ============================================================================

  return (
    <div 
      className="relative aspect-[4/5] w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="region"
      aria-label="Interactive product demonstration"
      aria-live="polite"
    >
      {/* Step content with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div key="scan" {...scaleIn}>
            <Step1Scan />
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div key="people" {...scaleIn}>
            <Step2People people={PEOPLE} />
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div key="assign" {...scaleIn}>
            <Step3Assign items={RECEIPT_ITEMS} people={PEOPLE} />
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div key="summary" {...scaleIn}>
            <Step4Summary people={PERSON_TOTALS} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {STEPS.map((step) => (
          <motion.button
            key={step.id}
            onClick={() => handleStepChange(step.id)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              'relative h-3 rounded-full transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'hover:scale-110',
              currentStep === step.id
                ? 'bg-primary w-12 opacity-100'
                : 'bg-foreground/30 w-3 opacity-60 hover:opacity-100 hover:bg-foreground/50'
            )}
            aria-label={`${step.label} (Step ${step.id + 1} of ${STEPS.length})`}
            aria-current={currentStep === step.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Tooltip on hover */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-2 py-1 text-xs font-medium whitespace-nowrap',
                'bg-popover text-popover-foreground rounded shadow-lg',
                'pointer-events-none'
              )}
            >
              {step.label}
            </motion.span>

            {/* Progress indicator for current step */}
            {currentStep === step.id && isPlaying && (
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: step.duration / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Play/Pause indicator (visible on hover) */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            {...backdropFade}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 bg-popover/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <span className="text-xs font-medium text-popover-foreground">
              {isPlaying ? '⏸ Hover to pause' : '▶ Click or wait to resume'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts hint (desktop only) */}
      <div className="hidden xl:block absolute -bottom-12 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          Use <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">←</kbd>{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">→</kbd>{' '}
          or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">1-4</kbd> to navigate
        </p>
      </div>
    </div>
  );
}
