import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, ScanLine, Search, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AIScanAnimationProps {
  onComplete?: () => void;
  mode?: 'fullscreen' | 'embedded';
  error?: string | null; // ✨ NEW: Error prop
  onError?: () => void; // ✨ NEW: Error callback
}

type ScanState = 'uploading' | 'confirming' | 'processing' | 'complete' | 'done';

const processingSteps = [
  { text: "Analyzing receipt structure...", icon: ScanLine },
  { text: "Identifying items & prices...", icon: Search },
  { text: "Detecting currency & tax...", icon: CreditCard },
  { text: "Finalizing details...", icon: Sparkles },
];

export function AIScanAnimation({ onComplete, mode = 'fullscreen', error, onError }: AIScanAnimationProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<ScanState>('uploading');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  // Upload Simulation
  useEffect(() => {
    if (state === 'uploading') {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setState('confirming'), 400);
            return 100;
          }
          return Math.min(prev + 12, 100); // Faster upload for better UX
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [state]);

  // State Transitions
  useEffect(() => {
    if (state === 'confirming') {
      const timer = setTimeout(() => {
        // ✨ CHECK FOR ERROR: If error exists, stop here and trigger callback
        if (error) {
          onError?.();
          // We don't change state here, the parent will unmount or reset us
        } else {
          setState('processing');
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (state === 'processing') {
      // ✨ CHECK FOR ERROR: If error arrives late (during processing), stop immediately
      if (error) {
        onError?.();
        return;
      }

      // Cycle through processing steps
      const stepDuration = 2000;
      const totalDuration = stepDuration * processingSteps.length;

      const stepInterval = setInterval(() => {
        setStepIndex(prev => (prev + 1) % processingSteps.length);
      }, stepDuration);

      const timer = setTimeout(() => {
        clearInterval(stepInterval);
        setState('complete'); // ✨ Changed from 'rendering' to 'complete'
      }, totalDuration);

      return () => {
        clearTimeout(timer);
        clearInterval(stepInterval);
      };
    }
    if (state === 'complete') {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000); // Show success message for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [state, onComplete, error, onError]);

  const isEmbedded = mode === 'embedded';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center overflow-hidden transition-all",
        isEmbedded
          ? "relative h-full w-full rounded-xl bg-muted/5"
          : "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "w-full px-4 transition-all",
        isEmbedded ? "max-w-sm" : "max-w-md"
      )}>
        <AnimatePresence mode="wait">

          {/* STATE 1: UPLOADING */}
          {state === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Upload Icon / Illustration */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <ScanLine className="h-10 w-10 animate-pulse text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="w-full space-y-2 text-center">
                <h3 className="text-lg font-semibold">
                  {t('aiScan.uploading', 'Uploading Receipt...')}
                </h3>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {uploadProgress}%
                </p>
              </div>
            </motion.div>
          )}

          {/* STATE 2: CONFIRMING (Checkmark Pop) */}
          {state === 'confirming' && (
            <motion.div
              key="confirming"
              className="flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-12 w-12" strokeWidth={3} />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold"
              >
                {t('aiScan.gotIt', 'Got it!')}
              </motion.h3>
            </motion.div>
          )}

          {/* STATE 3: PROCESSING (Scanner Beam) */}
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Scanner Visual */}
              <div className="relative">
                {/* Receipt Outline */}
                <div className="relative flex h-48 w-32 flex-col gap-2 rounded-lg border-2 border-dashed border-border bg-card p-3 shadow-sm">
                  <div className="h-2 w-1/2 rounded bg-muted" />
                  <div className="h-2 w-3/4 rounded bg-muted" />
                  <div className="mt-4 space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex justify-between">
                        <div className="h-1.5 w-12 rounded bg-muted/50" />
                        <div className="h-1.5 w-6 rounded bg-muted/50" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-between border-t border-dashed border-border pt-2">
                    <div className="h-2 w-8 rounded bg-muted" />
                    <div className="h-2 w-8 rounded bg-muted" />
                  </div>
                </div>

                {/* Laser Beam */}
                <motion.div
                  className="absolute -left-4 -right-4 top-0 h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-b from-primary/20 to-transparent" />
                </motion.div>
              </div>

              {/* Processing Text */}
              <div className="h-12 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    {(() => {
                      const StepIcon = processingSteps[stepIndex].icon;
                      return <StepIcon className="h-4 w-4" />;
                    })()}
                    {processingSteps[stepIndex].text}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* STATE 4: COMPLETE (Success Message) */}
          {state === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-12 w-12" strokeWidth={3} />
                </div>
              </motion.div>

              <div className="space-y-2">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold tracking-tight"
                >
                  {t('aiScan.complete', 'Analysis Complete')}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground"
                >
                  {t('aiScan.redirecting', "Let's move forward...")}
                </motion.p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
