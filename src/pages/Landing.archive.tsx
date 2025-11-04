import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';
import { Skeleton } from '../components/ui/skeleton';
import { isFirstTimeUser, updateSessionActivity } from '../lib/session';
import { WelcomeModal } from '../features/landing/WelcomeModal';
import { WelcomeBackModal } from '../features/landing/WelcomeBackModal';
import { useHydration } from '../hooks/useHydration';
import { NewHeroSection } from '../features/landing/NewHeroSection';
import { MessToMagicSection } from '../features/landing/MessToMagicSection';
import { TheLogicSection } from '../features/landing/TheLogicSection';
import { TrustSection } from '../features/landing/TrustSection';
import { CloserSection } from '../features/landing/CloserSection';

export function Landing() {
  const isHydrated = useHydration();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Store selectors
  const items = useStore((state) => state.items);
  const participants = useStore((state) => state.participants);
  const receipts = useStore((state) => state.receipts);
  const lastActivePage = useStore((state) => state.lastActivePage);
  
  // Actions
  const clearSession = useStore((state) => state.clearSession);
  
  // Modal actions
  const openWelcomeModal = useStore((state) => state.openWelcomeModal);
  const closeWelcomeModal = useStore((state) => state.closeWelcomeModal);
  const closeWelcomeBackModal = useStore((state) => state.closeWelcomeBackModal);

  useEffect(() => {
    updateSessionActivity();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      const hasActiveSession = items.length > 0 || participants.length > 0 || receipts.length > 0;
      
      if (!hasActiveSession && isFirstTimeUser()) {
        openWelcomeModal();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [items.length, participants.length, receipts.length, openWelcomeModal]);

  const handleContinue = () => {
    closeWelcomeBackModal();
    if (lastActivePage && lastActivePage !== '/') {
      navigate(lastActivePage);
    } else {
      navigate('/setup');
    }
  };

  const handleStartNew = () => {
    clearSession();
    closeWelcomeBackModal();
    navigate('/setup');
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 space-y-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main id="main-content" className="flex-1">
          <NewHeroSection />
          <MessToMagicSection />
          <TheLogicSection />
          <TrustSection />
          <CloserSection />
        </main>
        <AppFooter />
      </div>

      <WelcomeModal 
        onComplete={() => {
          closeWelcomeModal();
          navigate('/setup');
        }}
      />

      <WelcomeBackModal
        onContinue={handleContinue}
        onStartNew={handleStartNew}
        itemCount={items.length}
        participantCount={participants.length}
        receiptCount={receipts.length}
      />
    </>
  );
}
