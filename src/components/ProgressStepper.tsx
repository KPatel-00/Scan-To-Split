import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, LayoutGroup } from 'framer-motion';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { feedback } from '../lib/feedback';
import { activeIndicator } from '../lib/motion';
import { useReducedMotion, useSafeLayout } from '../hooks/useReducedMotion';

interface Step {
  number: number;
  labelKey: string;
  path: string;
}

const steps: Step[] = [
  { number: 1, labelKey: 'nav.step1', path: '/setup' },
  { number: 2, labelKey: 'nav.step2', path: '/assignment' },
  { number: 3, labelKey: 'nav.step3', path: '/summary' },
];

export function ProgressStepper() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const setLastActivePage = useStore((state) => state.setLastActivePage);
  const items = useStore((state) => state.items);
  const participants = useStore((state) => state.participants);
  
  // ACCESSIBILITY: Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  const safeLayout = useSafeLayout();

  // Determine current step based on pathname (support both new and legacy routes)
  const currentStepNumber = 
    pathname === '/setup' || pathname === '/part2' ? 1 : 
    pathname === '/assignment' || pathname === '/part3' ? 2 : 
    pathname === '/summary' || pathname === '/part4' ? 3 : 1;

  // Check if user has started entering data (for enabling navigation)
  const hasData = items.length > 0 && participants.length > 0;

  const handleStepClick = (step: Step) => {
    // Can't go forward, only backward or stay on current step
    if (step.number > currentStepNumber) return;
    
    // Can't navigate if no data yet (except staying on step 1)
    if (!hasData && step.number !== currentStepNumber) return;

    // Don't navigate if clicking current step
    if (step.number === currentStepNumber) return;

    // Navigate to the selected step (preserves all data via Zustand)
    feedback.click();
    setLastActivePage(step.path);
    navigate(step.path);
  };

  return (
    <LayoutGroup>
      <div className="mb-8 flex items-center justify-center gap-4">
        {steps.map((step, index) => {
          const isActive = step.number === currentStepNumber;
          const isCompleted = step.number < currentStepNumber;
          const isClickable = hasData && step.number < currentStepNumber;

          return (
            <div key={step.number} className="flex items-center gap-4">
              {/* Step Circle and Label */}
              <button
                onClick={() => handleStepClick(step)}
                disabled={!isClickable && step.number !== currentStepNumber}
                className={cn(
                  'flex items-center gap-2 transition-all relative',
                  isClickable && 'cursor-pointer hover:opacity-80 active:scale-95',
                  !isClickable && step.number !== currentStepNumber && 'cursor-not-allowed'
                )}
                aria-label={`${t(step.labelKey)}${isActive ? ` (${t('nav.current')})` : isCompleted ? ` (${t('nav.completed')})` : ''}`}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layout={safeLayout}
                    layoutId={safeLayout ? undefined : activeIndicator.layoutId}
                    transition={prefersReducedMotion ? { duration: 0.15 } : activeIndicator.transition}
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10"
                    style={{ margin: -8 }}
                  />
                )}
                
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    isActive && 'bg-primary text-primary-foreground',
                    !isActive && isCompleted && 'bg-primary/70 text-primary-foreground',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {step.number}
                </div>
                <span
                  className={cn(
                    'text-sm transition-colors',
                    isActive && 'font-medium text-foreground',
                    !isActive && isCompleted && 'font-medium text-foreground/80',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-px w-12 transition-colors',
                    step.number < currentStepNumber ? 'bg-primary/50' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
