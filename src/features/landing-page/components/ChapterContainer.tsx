import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChapterContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  background?: 'light' | 'dark' | 'gradient';
  fullHeight?: boolean;
}

/**
 * ChapterContainer - Wrapper for each storytelling chapter
 * 
 * Features:
 * - Scroll snap support for smooth chapter navigation
 * - Full viewport height minus sticky header (uses CSS custom property --header-height)
 * - Background variations (light, dark, gradient)
 * - Intersection observer for tracking visible chapter
 * - Centered content layout
 * 
 * NOTE: Changed from motion.section to section - motion wrapper was interfering
 * with whileInView animations in child components
 */
export function ChapterContainer({
  id,
  children,
  className,
  background = 'light',
  fullHeight = true,
}: ChapterContainerProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Track when chapter becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update URL hash without scrolling
            window.history.replaceState(null, '', `#${id}`);
          }
        });
      },
      { threshold: 0.5 } // Chapter is "active" when 50% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  const backgroundClasses = {
    light: 'bg-background text-foreground',
    dark: 'bg-foreground text-background',
    gradient: 'bg-gradient-to-b from-background via-muted to-background text-foreground',
  };

  return (
    <section
      ref={containerRef}
      id={id}
      data-chapter
      className={cn(
        // Base styles - Full viewport height minus sticky header
        'relative w-full',
        fullHeight && 'min-h-[calc(100vh-var(--header-height))] snap-start snap-always',
        
        // Flex container for centering content
        'flex items-center justify-center',
        
        // Responsive padding
        'px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16',
        
        // Background
        backgroundClasses[background],
        
        // Custom classes
        className
      )}
    >
      {children}
    </section>
  );
}
