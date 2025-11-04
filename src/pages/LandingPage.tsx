import { useEffect, useRef } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { HeroChapter } from '@/features/landing-page/chapters/hero/HeroChapter';
import { ProblemChapter } from '@/features/landing-page/chapters/problem/ProblemChapter';
import { MagicChapter } from '@/features/landing-page/chapters/magic/MagicChapter';
import { PowerChapter } from '@/features/landing-page/chapters/power/PowerChapter';
import { TrustChapter } from '@/features/landing-page/chapters/trust/TrustChapter';
import { CloserChapter } from '@/features/landing-page/chapters/closer/CloserChapter';
import { useChapterNavigation } from '@/hooks/useChapterNavigation';

/**
 * LandingPage - Responsive Storytelling Landing Page
 * 
 * Features:
 * - 6 chapters with cinematic flow
 * - Scroll-based navigation (desktop)
 * - Swipe gestures (mobile)
 * - Keyboard controls (all devices)
 * - Fully responsive (280px to 4K+)
 * - Foldable phone optimized
 */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChapterNavigation();

  // Store container ref globally for navigation
  useEffect(() => {
    if (containerRef.current) {
      (window as any).__landingPageContainer = containerRef.current;
    }
    
    return () => {
      delete (window as any).__landingPageContainer;
      document.documentElement.style.scrollSnapType = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <>
      {/* App Header - Navigation, theme toggle, language selector */}
      <AppHeader />
      
      <div 
        ref={containerRef}
        data-scroll-container
        className="relative w-full overflow-y-auto overflow-x-hidden scroll-snap-type-y scroll-snap-mandatory"
        style={{ 
          height: 'calc(100vh - var(--header-height))',
          scrollSnapType: 'y mandatory',
          scrollPaddingTop: '0'
        }}
      >
        {/* Chapter 1: Hero */}
        <HeroChapter />

        {/* Chapter 2: Problem - Coming Soon */}
        <ProblemChapter />

        {/* Chapter 3: Magic - Coming Soon */}
        <MagicChapter />

        {/* Chapter 4: Power - Coming Soon */}
        <PowerChapter />

        {/* Chapter 5: Trust - Coming Soon */}
        <TrustChapter />

        {/* Chapter 6: Closer - Coming Soon */}
        <CloserChapter />
      </div>
    </>
  );
}
