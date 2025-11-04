/**
 * Storage Health Display Component
 * Shows storage health metrics and corruption warnings
 */

import { motion } from 'framer-motion';
import { Shield, Package, Database, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { StorageHealth } from '../../lib/storage';
import { smoothSlow } from '@/lib/motion/physics';

interface StorageHealthDisplayProps {
  health: StorageHealth | null;
}

export function StorageHealthDisplay({ health }: StorageHealthDisplayProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothSlow, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{t('storage.health')}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('storage.items')}</span>
          </div>
          <p className="mt-1 text-lg font-semibold">{health?.itemCount || 0}</p>
        </div>

        <div className="rounded-md border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('storage.version')}</span>
          </div>
          <p className="mt-1 text-lg font-semibold">v{health?.version || '1.0.0'}</p>
        </div>
      </div>

      {health && health.corruptedKeys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={smoothSlow}
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              {t('storage.corruptionDetected')}
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              {health.corruptedKeys.length} {t('storage.corruptedKeys')}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
