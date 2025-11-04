import { useEffect, useState, RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ParallaxConfig {
  speed?: number; // Multiplier for scroll speed (0.5 = half speed, 2 = double speed)
  direction?: 'up' | 'down' | 'left' | 'right';
  startOpacity?: number;
  endOpacity?: number;
  startScale?: number;
  endScale?: number;
}

export interface ParallaxValues {
  y: number;
  x: number;
  opacity: number;
  scale: number;
  progress: number; // 0-1 based on viewport visibility
}

/**
 * useParallax Hook
 * 
 * Creates smooth parallax scroll effects on elements
 * Automatically disabled when user prefers reduced motion
 * 
 * @example
 * const parallax = useParallax(ref, { speed: 0.5, direction: 'up' });
 * <motion.div ref={ref} style={{ y: parallax.y, opacity: parallax.opacity }} />
 */
export function useParallax(
  ref: RefObject<HTMLElement>,
  config: ParallaxConfig = {}
): ParallaxValues {
  const {
    speed = 0.3,
    direction = 'up',
    startOpacity = 1,
    endOpacity = 1,
    startScale = 1,
    endScale = 1,
  } = config;

  const prefersReducedMotion = useReducedMotion();
  const [values, setValues] = useState<ParallaxValues>({
    y: 0,
    x: 0,
    opacity: startOpacity,
    scale: startScale,
    progress: 0,
  });

  useEffect(() => {
    // Disable parallax if reduced motion
    if (prefersReducedMotion || !ref.current) {
      return;
    }

    const element = ref.current;
    const container = (window as any).__landingPageContainer || window;
    let rafId: number | null = null;
    let isScheduled = false;

    const updateParallax = () => {
      isScheduled = false;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const containerHeight = container === window ? window.innerHeight : container.clientHeight;
      
      // Calculate element visibility progress (0 = below viewport, 1 = above viewport)
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = containerHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      const maxDistance = containerHeight / 2 + rect.height / 2;
      const progress = 1 - Math.max(0, Math.min(1, (distanceFromCenter + maxDistance) / (maxDistance * 2)));

      // Calculate parallax offset
      const scrollOffset = distanceFromCenter * speed;

      // Calculate opacity fade
      const opacity = startOpacity + (endOpacity - startOpacity) * progress;

      // Calculate scale
      const scale = startScale + (endScale - startScale) * progress;

      // Apply direction
      let y = 0;
      let x = 0;

      switch (direction) {
        case 'up':
          y = -scrollOffset;
          break;
        case 'down':
          y = scrollOffset;
          break;
        case 'left':
          x = -scrollOffset;
          break;
        case 'right':
          x = scrollOffset;
          break;
      }

      setValues({ y, x, opacity, scale, progress });
    };

    const handleScroll = () => {
      // Debounce scroll events with RAF for buttery smoothness
      if (!isScheduled) {
        isScheduled = true;
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    // Initial calculation
    updateParallax();

    // Listen to scroll events with passive flag for better performance
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [ref, speed, direction, startOpacity, endOpacity, startScale, endScale, prefersReducedMotion]);

  // Return zero values if reduced motion
  if (prefersReducedMotion) {
    return {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      progress: 1,
    };
  }

  return values;
}
