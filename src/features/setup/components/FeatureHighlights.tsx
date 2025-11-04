/**
 * FeatureHighlights - Showcase app capabilities
 * Always visible 3-column grid highlighting key features
 */

import { motion } from 'framer-motion';
import { Sparkles, Shield, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gentleNormal } from '@/lib/motion/physics';

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

export function FeatureHighlights() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gentleLand}
      className="mt-16 grid gap-6 sm:grid-cols-3"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-sm font-semibold">
          {t('setup.features.aiPowered', 'AI-Powered')}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t('setup.features.aiPoweredDesc', 'Automatic item extraction from receipts')}
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-sm font-semibold">
          {t('setup.features.privacyFirst', 'Privacy First')}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t('setup.features.privacyFirstDesc', 'Sensitive data detected and masked automatically')}
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-sm font-semibold">
          {t('setup.features.multiReceipt', 'Multi-Receipt')}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t('setup.features.multiReceiptDesc', 'Scan up to 3 receipts at once')}
        </p>
      </div>
    </motion.div>
  );
}
