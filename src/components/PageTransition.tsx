import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useReducedMotion, useMotionTransition } from '../hooks/useReducedMotion';
import { smoothNormal, gentleNormal } from '@/lib/motion/physics';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const prefersReducedMotion = useReducedMotion();
  const transition = useMotionTransition(gentleNormal);

  // Determine if this is Summary page (for celebration transition)
  const isSummary = location.pathname === '/summary' || location.pathname === '/part4';
  const [isFirstMount, setIsFirstMount] = useState(true);
  
  // Update display location with a slight delay to allow exit animations to complete
  useEffect(() => {
    setIsFirstMount(false);
    
    // Delay setting the new location to ensure smooth exit animation
    const timer = setTimeout(() => {
      setDisplayLocation(location);
    }, 50); // Small delay for smoother transitions
    
    return () => clearTimeout(timer);
  }, [location]);

  // Premium page transition variants with enhanced spring physics
  const pageVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 30,
      scale: prefersReducedMotion ? 1 : 0.95,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: prefersReducedMotion
        ? { duration: 0.2, ease: 'easeOut' }
        : {
            ...transition,
            filter: { duration: 0.3 },
            when: 'beforeChildren' as const,
            staggerChildren: 0.05,
          },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -30,
      scale: prefersReducedMotion ? 1 : 0.95,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)',
      transition: prefersReducedMotion
        ? { duration: 0.15, ease: 'easeIn' }
        : {
            ...smoothNormal,
            opacity: { duration: 0.3 },
            filter: { duration: 0.3 },
          },
    },
  };

  // Special "Celebration" transition for Part 4 (Blueprint Section 4.2)
  // Enhanced with premium spring physics for ultimate feel
  const celebrationVariants = {
    initial: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.9,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            ...smoothNormal,
            opacity: { duration: 0.6 },
          },
    },
    exit: {
      opacity: prefersReducedMotion ? 0 : [1, 0, 1],
      scale: prefersReducedMotion ? 1 : [1, 1.05, 1],
      backgroundColor: prefersReducedMotion 
        ? 'rgba(255, 255, 255, 0)' 
        : ['rgba(255, 255, 255, 0)', 'rgba(255, 215, 0, 0.1)', 'rgba(255, 255, 255, 0)'],
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            duration: 1,
            times: [0, 0.5, 1],
            ease: [0.22, 1, 0.36, 1] as const,
          },
    },
  };
  
  // Use special celebration transition when navigating TO Part 4
  const variants = isSummary ? celebrationVariants : pageVariants;

  // Skip animation on first mount to prevent white screen during hydration
  if (isFirstMount) {
    return <div className="flex min-h-screen flex-col">{children}</div>;
  }

  return (
    // FIXED: Removed initial={false} - it was breaking whileInView in child components
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex min-h-screen flex-col"
        style={{ 
          transform: 'translateZ(0)', // GPU acceleration
          backfaceVisibility: 'hidden', // Prevent flickering
          WebkitFontSmoothing: 'antialiased', // Smooth text rendering
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Shared layout component for morphing elements with premium spring
interface SharedElementProps {
  layoutId: string;
  children: ReactNode;
  className?: string;
}

export function SharedElement({ layoutId, children, className }: SharedElementProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={prefersReducedMotion 
        ? { duration: 0.2 }
        : smoothNormal
      }
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation wrapper with premium timing
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className, delay = 0 }: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: prefersReducedMotion 
            ? { delayChildren: 0 }
            : {
                delayChildren: delay,
                staggerChildren: 0.08,
              },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item with premium spring physics
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: prefersReducedMotion ? 0 : 20,
          scale: prefersReducedMotion ? 1 : 0.95,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: prefersReducedMotion
            ? { duration: 0.2 }
            : smoothNormal,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

