import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bouncySlow } from '@/lib/motion/physics';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useLocation } from 'react-router-dom';
import {
  setupTour,
  assignmentTour,
  summaryTour,
  resetAllTours,
  isTourCompleted,
  type TourPage,
} from '../lib/tours';

export function HelpButton() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Determine current page tour (landing page removed - no tour needed)
  const getCurrentTour = () => {
    if (pathname === '/setup') return { tour: setupTour, page: 'setup' as TourPage };
    if (pathname === '/assignment') return { tour: assignmentTour, page: 'assignment' as TourPage };
    if (pathname === '/summary') return { tour: summaryTour, page: 'summary' as TourPage };
    return null;
  };

  // Show help button after a delay, with pulse if tour not completed
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    const currentTourData = getCurrentTour();
    if (currentTourData && !isTourCompleted(currentTourData.page)) {
      const pulseTimer = setTimeout(() => setPulse(true), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(pulseTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleStartTour = () => {
    const currentTourData = getCurrentTour();
    if (currentTourData) {
      setPulse(false);
      currentTourData.tour().drive();
    }
  };

  const handleResetTours = () => {
    resetAllTours();
    setPulse(true);
  };

  if (!getCurrentTour()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={bouncySlow}
          className="fixed bottom-6 right-6 z-[60]"
          style={{ position: 'fixed' }}
        >
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      className={`h-14 w-14 rounded-full shadow-lg ${
                        pulse ? 'animate-pulse' : ''
                      }`}
                      variant="default"
                    >
                      <HelpCircle className="h-6 w-6" />
                      <span className="sr-only">Help & Tours</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Help & Tours</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Help & Tours</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleStartTour}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Start Page Tour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleResetTours}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset All Tours
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>

          {/* Pulse Ring Effect */}
          {pulse && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
