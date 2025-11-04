/**
 * HeroVisual Component - 4-step animated workflow demonstration
 * Shows the magic: Scan → People → Assign → Summary
 * 
 * Features:
 * - Auto-playing animation cycle (22 seconds total)
 * - Manual step navigation via dots
 * - 5-second inactivity timer before resuming auto-play
 * - Reduced motion support (shows final state)
 */

import { AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { Step1Scan } from '../animations/Step1Scan';
import { Step2People, type Person } from '../animations/Step2People';
import { Step3Assign, type ReceiptItem } from '../animations/Step3Assign';
import { Step4Summary, type PersonWithTotal } from '../animations/Step4Summary';

// Receipt items data - realistic grocery items
export const RECEIPT_ITEMS: ReceiptItem[] = [
  { id: 0, name: 'Natur Joghurt 1kg', price: 1.79, assignedTo: [1, 2] },
  { id: 1, name: 'Landmilch 3.8% × 2', price: 2.70, assignedTo: [0, 1, 2, 3] },
  { id: 2, name: 'Pfand', price: 0.50, assignedTo: [0, 1, 2, 3] },
  { id: 3, name: 'Vollkornbrot', price: 1.49, assignedTo: [2, 3] },
  { id: 4, name: 'Bananen', price: 1.78, assignedTo: [0, 1] },
  { id: 5, name: 'Pfand Rückgabe', price: -0.25, assignedTo: [0, 1, 2, 3] },
];

// People data - common names
export const PEOPLE: Person[] = [
  { id: 0, name: 'Sarah', initial: 'S', color: 'hsl(var(--primary))' },
  { id: 1, name: 'Mike', initial: 'M', color: 'hsl(220, 90%, 56%)' },
  { id: 2, name: 'Lukas', initial: 'L', color: 'hsl(280, 90%, 56%)' },
  { id: 3, name: 'James', initial: 'J', color: 'hsl(160, 90%, 56%)' },
];

// Calculate totals per person (split equally among assigned people)
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

const STEP_TIMELINE = [
  { step: 0, duration: 8000 },  // Step 1: Scan (0-8s)
  { step: 1, duration: 4000 },  // Step 2: People (8-12s)
  { step: 2, duration: 6000 },  // Step 3: Assign (12-18s)
  { step: 3, duration: 4000 },  // Step 4: Summary (18-22s)
];

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<number>();
  const inactivityTimeoutRef = useRef<number>();

  // Manual step change via dot click
  const handleStepClick = (step: number) => {
    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    
    setCurrentStep(step);
    setIsPlaying(false); // Stop auto-play temporarily

    // Set inactivity timer - resume animation after 5 seconds
    inactivityTimeoutRef.current = window.setTimeout(() => {
      const nextStep = (step + 1) % 4;
      setCurrentStep(nextStep);
      setIsPlaying(true); // Resume auto-play
    }, 5000);
  };

  // Auto-advance through steps
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentStep(3); // Show final state
      return;
    }

    if (!isPlaying) return;

    let currentIndex = currentStep;

    const advanceStep = () => {
      currentIndex++;
      if (currentIndex >= STEP_TIMELINE.length) {
        currentIndex = 0; // Restart immediately
      }
      
      setCurrentStep(currentIndex);
      timeoutRef.current = window.setTimeout(advanceStep, STEP_TIMELINE[currentIndex].duration);
    };

    timeoutRef.current = window.setTimeout(advanceStep, STEP_TIMELINE[currentStep].duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [prefersReducedMotion, isPlaying, currentStep]);

  // Cleanup inactivity timer
  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  if (prefersReducedMotion) {
    return <Step4Summary people={PERSON_TOTALS} static />;
  }

  return (
    <div className="relative aspect-[4/5] w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <Step1Scan key="scan" />}
        {currentStep === 1 && <Step2People key="people" people={PEOPLE} />}
        {currentStep === 2 && <Step3Assign key="assign" items={RECEIPT_ITEMS} people={PEOPLE} />}
        {currentStep === 3 && <Step4Summary key="summary" people={PERSON_TOTALS} />}
      </AnimatePresence>

      {/* Clickable step indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {[0, 1, 2, 3].map((step) => (
          <button
            key={step}
            onClick={() => handleStepClick(step)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:opacity-100',
              currentStep === step 
                ? 'bg-primary w-10 opacity-100' 
                : 'bg-foreground/30 w-2.5 opacity-60 hover:bg-foreground/50'
            )}
            aria-label={`Go to step ${step + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
