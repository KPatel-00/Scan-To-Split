import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle2, Users, Receipt, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import { feedback } from '../../lib/feedback';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { smoothSlow, bouncySlow } from '@/lib/motion/physics';

interface CelebrationSectionProps {
  participantCount: number;
  itemCount: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export function CelebrationSection({ participantCount, itemCount }: CelebrationSectionProps) {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTransitionFlash, setShowTransitionFlash] = useState(true);

  // Celebration sequence: Flash fade → Confetti burst → Cards land
  useEffect(() => {
    // 1. Hide flash overlay after brief moment
    const flashTimer = setTimeout(() => {
      setShowTransitionFlash(false);
    }, 400);

    // 2. Trigger confetti burst slightly after flash
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
      feedback.complete();
    }, 500);
    
    // 3. Stop confetti after 5 seconds
    const stopTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5500);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(confettiTimer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <>
      {/* Transition Flash Overlay - "Fade to white" effect */}
      <AnimatePresence>
        {showTransitionFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              times: [0, 0.5, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Confetti Celebration */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}
      </AnimatePresence>

      {/* Celebration Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 relative overflow-hidden">
          {/* Sparkle decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
            transition={{
              duration: 1.5,
              delay: 1,
              times: [0, 0.5, 1],
            }}
            className="absolute top-12 left-12"
          >
            <Sparkles className="w-6 h-6 text-primary/40" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
            transition={{
              duration: 1.5,
              delay: 1.2,
              times: [0, 0.5, 1],
            }}
            className="absolute top-16 right-16"
          >
            <Sparkles className="w-5 h-5 text-primary/30" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
            transition={{
              duration: 1.5,
              delay: 1.4,
              times: [0, 0.5, 1],
            }}
            className="absolute bottom-12 left-20"
          >
            <Sparkles className="w-4 h-4 text-primary/50" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              ...bouncySlow,
              delay: 0.8, // Sync with confetti burst (500ms + 300ms)
            }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
              <PartyPopper className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('summary.celebration.title')}
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {t('summary.celebration.subtitle')}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {participantCount} {participantCount === 1 ? t('common.person') : t('common.people')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span>
                {itemCount} {itemCount === 1 ? t('common.item') : t('common.items')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                {t('summary.celebration.complete')}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
