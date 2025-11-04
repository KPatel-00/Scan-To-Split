/**
 * useScrollProgress Hook
 * 
 * Tracks scroll position and calculates progress through content
 * Used for scroll-linked animations and progress indicators
 * 
 * @example
 * const { scrollY, progress, direction } = useScrollProgress();
 * <ProgressBar value={progress} />
 */

import { useState, useEffect, useRef } from 'react';

export interface ScrollProgressContext {
  scrollY: number;
  scrollX: number;
  progress: number; // 0-100
  maxScroll: number;
  direction: 'up' | 'down' | 'none';
  isAtTop: boolean;
  isAtBottom: boolean;
}

export function useScrollProgress(element?: HTMLElement | null): ScrollProgressContext {
  const [context, setContext] = useState<ScrollProgressContext>({
    scrollY: 0,
    scrollX: 0,
    progress: 0,
    maxScroll: 0,
    direction: 'none',
    isAtTop: true,
    isAtBottom: false,
  });

  const lastScrollY = useRef(0);

  useEffect(() => {
    const target = element || window;
    
    const handleScroll = () => {
      const scrollElement = element || document.documentElement;
      const scrollY = element ? element.scrollTop : window.pageYOffset;
      const scrollX = element ? element.scrollLeft : window.pageXOffset;
      
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = element ? element.clientHeight : window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      
      const direction = scrollY > lastScrollY.current ? 'down' : 
                       scrollY < lastScrollY.current ? 'up' : 'none';
      
      lastScrollY.current = scrollY;
      
      const isAtTop = scrollY <= 10;
      const isAtBottom = scrollY >= maxScroll - 10;

      setContext({
        scrollY,
        scrollX,
        progress,
        maxScroll,
        direction,
        isAtTop,
        isAtBottom,
      });
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [element]);

  return context;
}
