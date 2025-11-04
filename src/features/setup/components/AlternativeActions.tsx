/**
 * AlternativeActions - Manual entry toggle and Try Demo buttons
 * Provides alternative input methods below the main upload area
 */

import { motion } from 'framer-motion';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { gentleNormal } from '@/lib/motion/physics';

interface AlternativeActionsProps {
  inputMode: 'upload' | 'manual';
  managementMode: 'merged' | 'separate';
  onToggleMode: () => void;
  onTryDemo: () => void;
}

const gentleLand = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...gentleNormal,
    },
  },
};

export function AlternativeActions({
  inputMode,
  managementMode,
  onToggleMode,
  onTryDemo,
}: AlternativeActionsProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gentleLand}
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
    >
      <Button
        variant="link"
        className="gap-2 text-muted-foreground"
        onClick={onToggleMode}
        disabled={managementMode === 'separate'}
      >
        {inputMode === 'upload' ? (
          <>
            <Plus className="h-4 w-4" />
            {t('setup.scanPortal.manualEntry', 'Add items manually')}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {t('setup.scanPortal.wantUpload', 'Want to Upload?')}
          </>
        )}
      </Button>

      <Button
        variant="link"
        className="gap-2 text-primary"
        onClick={onTryDemo}
      >
        <Sparkles className="h-4 w-4" />
        {t('setup.scanPortal.tryDemo', 'Try our Demo Bill')}
      </Button>
    </motion.div>
  );
}
