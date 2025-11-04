import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';
import { Button } from '../components/ui/button';
import { AIScanAnimation } from '../features/setup/AIScanAnimation';
import { MultiBillModal } from '../features/setup/MultiBillModal';
import { ProgressStepper } from '../components/ProgressStepper';
import { PIIRedactionModal } from '../features/setup/PIIRedactionModal';
import { ScanPortal } from '../features/setup/ScanPortal';
import { DataHub } from '../features/setup/DataHub';
import { useFileUpload } from '../features/setup/hooks/useFileUpload';
import { useStore } from '../store/useStore';
import { useToast } from '../hooks/useToast';
import { feedback } from '../lib/feedback';
import { useHydration } from '../hooks/useHydration';
import { smoothSlow } from '@/lib/motion/physics';

// ✨ NEW: Page states (Gemini-style state machine)
type PageState = 'scanPortal' | 'scanning' | 'dataHub';

export function Setup() {
  const isHydrated = useHydration();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itemSearchQuery] = useState('');
  
  // ✨ NEW: State machine for page flow
  const [pageState, setPageState] = useState<PageState>('scanPortal');
  
  const participants = useStore((state) => state.participants);
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const managementMode = useStore((state) => state.managementMode);
  const setLastActivePage = useStore((state) => state.setLastActivePage);
  
  // ✨ REFACTORED: Read scanning state from store
  const isScanning = useStore((state) => state.isScanning);
  const scanFileCount = useStore((state) => state.scanFileCount);

  // ✨ REFACTORED: File upload hook now only returns handlers
  const {
    handleFileUpload,
    handleConfirmMasked,
    handleScanOriginal,
    handleMultiBillConfirm,
  } = useFileUpload();

  // Set last active page on mount
  useEffect(() => {
    setLastActivePage('/setup');
  }, [setLastActivePage]);

  // ✨ NEW: Only sync scanning state (not data state)
  // Data state is explicitly set by handleScanComplete or when user chooses demo/manual entry
  useEffect(() => {
    if (isScanning) {
      setPageState('scanning');
    }
  }, [isScanning]);

  // ✨ NEW: Handle scan completion (callback for AI animation)
  const handleScanComplete = () => {
    setPageState('dataHub');
  };

  // ✨ NEW: Show DataHub if data exists (for returning users)
  const hasData = items.length > 0 || receipts.length > 0 || participants.length > 0;

  // ✨ NEW: Handler to switch between states
  const showDataHub = () => setPageState('dataHub');
  const showScanPortal = () => setPageState('scanPortal');

  const handleNext = () => {
    if (participants.length === 0) {
      feedback.error();
      toast({
        title: t('messages.needParticipants'),
        description: t('messages.needParticipantsDesc'),
        variant: 'destructive',
      });
      return;
    }
    
    if (items.length === 0) {
      feedback.error();
      toast({
        title: t('messages.needItems'),
        description: t('messages.needItemsDesc'),
        variant: 'destructive',
      });
      return;
    }
    
    feedback.click();
    setLastActivePage('/assignment');
    navigate('/assignment');
  };

  // Prevent hydration mismatch - don't render until client-side hydration is complete
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AppHeader />

      {/* Sticky Progress Stepper */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <ProgressStepper />
        </div>
      </div>

      <main id="main-content" className="min-h-screen bg-background">
        {/* ✨ NEW: State Machine - Gemini-style flow */}
        <AnimatePresence mode="wait">
          {/* STATE 1: Scan Portal (Hero Upload) */}
          {pageState === 'scanPortal' && (
            <ScanPortal
              key="scanPortal"
              onFileUpload={handleFileUpload}
              managementMode={managementMode}
              hasExistingData={hasData}
              onContinueEditing={showDataHub}
            />
          )}

          {/* STATE 2: AI Scanning Animation */}
          {pageState === 'scanning' && (
            <AIScanAnimation
              key="scanning"
              fileCount={scanFileCount}
              onComplete={handleScanComplete}
            />
          )}

          {/* STATE 3: Data Hub (Items + Participants) */}
          {pageState === 'dataHub' && (
            <motion.div
              key="dataHub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DataHub
                managementMode={managementMode}
                items={items}
                receipts={receipts}
                participants={participants}
                itemSearchQuery={itemSearchQuery}
                onBackToUpload={showScanPortal}
              />

              {/* Navigation Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...smoothSlow,
                  delay: 0.4,
                }}
                className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
              >
                <div className="flex flex-col items-center gap-4 border-t border-border pt-8">
                  <Button 
                    onClick={handleNext} 
                    size="lg"
                    className="min-w-48 shadow-sm transition-all hover:shadow-md"
                  >
                    {t('buttons.next', 'Assign Items')} →
                  </Button>
                  {(participants.length === 0 || items.length === 0) && (
                    <p className="text-center text-sm text-muted-foreground">
                      {participants.length === 0 && items.length === 0
                        ? t('setup.needItemsAndPeople', 'Add at least 1 item and 2 participants to continue.')
                        : participants.length === 0
                        ? t('setup.needParticipants', 'Add at least 2 participants to continue.')
                        : t('setup.needItems', 'Add at least 1 item to continue.')}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ✨ REFACTORED: Modals read their own state from store */}
      <PIIRedactionModal
        onConfirmMasked={handleConfirmMasked}
        onScanOriginal={handleScanOriginal}
      />

      <MultiBillModal
        onConfirm={handleMultiBillConfirm}
      />

      <AppFooter />
    </>
  );
}
