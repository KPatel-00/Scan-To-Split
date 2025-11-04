/**
 * Custom smooth scroll with easing
 * Provides buttery smooth, slower transitions with ease-in-out
 */

// Easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

export interface SmoothScrollOptions {
  duration?: number; // milliseconds
  easing?: 'easeInOutCubic' | 'easeOutQuart';
  onComplete?: () => void;
}

/**
 * Smooth scroll to a position with custom easing
 * Much smoother than native browser scroll-behavior
 */
export function smoothScrollTo(
  element: HTMLElement | Window,
  targetPosition: number,
  options: SmoothScrollOptions = {}
): void {
  const {
    duration = 1200, // Slower = more luxurious (was instant with native scroll)
    easing = 'easeInOutCubic',
    onComplete,
  } = options;

  const isWindow = element === window;
  const startPosition = isWindow
    ? window.pageYOffset
    : (element as HTMLElement).scrollTop;
  
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const easingFn = easing === 'easeOutQuart' ? easeOutQuart : easeInOutCubic;

  function scroll(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    const position = startPosition + distance * easedProgress;

    if (isWindow) {
      window.scrollTo(0, position);
    } else {
      (element as HTMLElement).scrollTop = position;
    }

    if (progress < 1) {
      requestAnimationFrame(scroll);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(scroll);
}

/**
 * Smooth scroll to element with custom easing
 */
export function smoothScrollToElement(
  targetElement: HTMLElement,
  options: SmoothScrollOptions = {}
): void {
  const container = (window as any).__landingPageContainer;
  
  if (container) {
    // Scroll within container
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = targetElement.getBoundingClientRect().top;
    const scrollPosition = container.scrollTop + (targetTop - containerTop);
    
    smoothScrollTo(container, scrollPosition, options);
  } else {
    // Fallback to window scroll
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    smoothScrollTo(window, targetPosition, options);
  }
}
