import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { AppFooter } from '../components/AppFooter';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ParticipantPalette } from '../features/assignment/ParticipantPalette';
import { BillInfoCard } from '../features/assignment/BillInfoCard';
import AssignmentItemsList from '../features/assignment/AssignmentItemsList';
import { ProgressStepper } from '../components/ProgressStepper';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { useHydration } from '../hooks/useHydration';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { feedback } from '../lib/feedback';
import { smoothSlow } from '@/lib/motion/physics';

const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function Assignment() {
  const isHydrated = useHydration();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  const setLastActivePage = useStore((state) => state.setLastActivePage);
  const managementMode = useStore((state) => state.managementMode);
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const participants = useStore((state) => state.participants);

  // Save last active page on mount
  useEffect(() => {
    setLastActivePage('/assignment');
  }, [setLastActivePage]);

  const handleNext = () => {
    feedback.success();
    setLastActivePage('/summary');
    navigate('/summary');
  };

  const handleBack = () => {
    feedback.click();
    navigate('/setup');
  };

  // Wait for hydration
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Check if there are items to assign
  const hasItems =
    managementMode === 'merged'
      ? items.length > 0
      : receipts.some((receipt) => receipt.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <AppHeader />

      <main id="main-content" className="container max-w-screen-lg flex-1 py-8 space-y-8">
        {/* Progress Stepper */}
        <motion.div {...pageAnimation} transition={smoothSlow}>
          <ProgressStepper />
        </motion.div>

        {/* Page Title Card */}
        <motion.div {...pageAnimation} transition={{ ...smoothSlow, delay: 0.1 }}>
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>{t('assignment.title')}</CardTitle>
              </div>
              <CardDescription>{t('assignment.description')}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Three-Part Layout */}
        <div className="space-y-6">
          {/* 1. Top Area - Participant Palette */}
          <motion.div
            {...pageAnimation}
            transition={{ ...smoothSlow, delay: 0.2 }}
          >
            <ParticipantPalette
              selectedParticipants={selectedParticipants}
              onSelectionChange={setSelectedParticipants}
            />
          </motion.div>

          {/* 2. Middle Area - Bill Info Card (conditional, merged mode only) */}
          <motion.div
            {...pageAnimation}
            transition={{ ...smoothSlow, delay: 0.25 }}
          >
            <BillInfoCard />
          </motion.div>

          {/* 3. Bottom Area - Items List */}
          <motion.div
            {...pageAnimation}
            transition={{ ...smoothSlow, delay: 0.3 }}
          >
            <AssignmentItemsList selectedParticipants={selectedParticipants} />
          </motion.div>
        </div>

        {/* Navigation Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-8 border-t"
          {...pageAnimation}
          transition={{ ...smoothSlow, delay: 0.4 }}
        >
          <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('buttons.back')}
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={!hasItems || participants.length === 0}
            className="w-full sm:w-auto"
          >
            {t('buttons.viewSummary')}
          </Button>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
