import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { contentEntry, contentEntryTransition, pulseOpacity, bounceY } from '@/lib/motion';

interface ScrollHintProps {
  /** Auto-hide after user scrolls (default: true) */
  autoHide?: boolean;
  /** Show only on first chapter (default: true) */
  firstChapterOnly?: boolean;
  /** Custom text (default: "Scroll to explore") */
  text?: string;
  /** Target chapter ID to scroll to when clicked (optional) */
  targetChapterId?: string;
}

/**
 * ScrollHint - Animated chevron indicating scrollable content
 * 
 * Features:
 * - Bouncing animation to draw attention
 * - Auto-hides after first scroll
 * - Respects reduced motion preferences
 */
export function ScrollHint({
  autoHide = true,
  firstChapterOnly = true,
  text = 'Scroll to explore',
  targetChapterId,
}: ScrollHintProps) {
  const { scrollY, isAtTop } = useScrollProgress();
  const prefersReducedMotion = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Track if user has scrolled
  useEffect(() => {
    if (scrollY > 100 && !hasScrolled) {
      setHasScrolled(true);
    }
  }, [scrollY, hasScrolled]);

  // Hide conditions
  const shouldHide =
    (autoHide && hasScrolled) || // User has scrolled
    !isAtTop; // Not at top of page

  // Only show on first chapter (hero)
  useEffect(() => {
    if (firstChapterOnly) {
      const hash = window.location.hash;
      if (hash && hash !== '#hero') {
        setHasScrolled(true); // Hide if not on hero
      }
    }
  }, [firstChapterOnly]);

  // Handle click to scroll to next chapter
  const handleClick = () => {
    if (targetChapterId) {
      const targetElement = document.getElementById(targetChapterId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.div
          className={cn(
            'flex flex-col items-center gap-1'
          )}
          variants={contentEntry}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={contentEntryTransition}
        >
          {/* Text label - Minimal style */}
          <motion.p
            className="text-xs md:text-sm text-muted-foreground font-medium"
            variants={prefersReducedMotion ? undefined : pulseOpacity}
            animate={prefersReducedMotion ? undefined : "animate"}
          >
            {text}
          </motion.p>

          {/* Clickable round ghost button with chevron */}
          <motion.div
            variants={prefersReducedMotion ? undefined : bounceY}
            animate={prefersReducedMotion ? undefined : "animate"}
          >
            <Button
              onClick={handleClick}
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-full',
                !targetChapterId && 'cursor-default'
              )}
              aria-label={targetChapterId ? `Scroll to ${targetChapterId}` : 'Scroll down'}
            >
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
