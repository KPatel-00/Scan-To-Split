import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/button';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHabitRecognition } from '../hooks/useHabitRecognition';
import { smoothSlow } from '@/lib/motion/physics';

export function HabitRecognition() {
  const { t } = useTranslation();
  const { showSuggestion, suggestionCount, handleAccept, handleDismiss } =
    useHabitRecognition();

  return (
    <AnimatePresence>
      {showSuggestion && (
        <motion.div
          className="p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 mt-4 origin-top overflow-hidden"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={smoothSlow}
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {t('setup.participants.habitRecognitionTitle')}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {t('setup.participants.habitRecognitionDesc', {
                  count: suggestionCount,
                })}
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAccept} className="flex-1">
                  {t('setup.participants.habitRecognitionAction')}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  {t('setup.participants.habitRecognitionDismiss')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
