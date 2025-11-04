/**
 * Storage Quota Display Component
 * Displays storage usage with visual indicators and warnings
 */

import { motion } from 'framer-motion';
import { HardDrive, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import type { StorageQuota } from '../../lib/storage';
import { smoothSlow } from '@/lib/motion/physics';

interface StorageQuotaDisplayProps {
  quota: StorageQuota | null;
  onOptimize: () => void;
  formatBytes: (bytes: number) => string;
  formatPercentage: (percentage: number) => string;
}

export function StorageQuotaDisplay({
  quota,
  onOptimize,
  formatBytes,
  formatPercentage,
}: StorageQuotaDisplayProps) {
  const { t } = useTranslation();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'critical':
      case 'full':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'warning':
      case 'critical':
      case 'full':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSlow}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t('storage.quota')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${getStatusColor(quota?.status)}`}>
            {quota && formatPercentage(quota.percentage)}
          </span>
          <div className={getStatusColor(quota?.status)}>
            {getStatusIcon(quota?.status)}
          </div>
        </div>
      </div>

      {quota && (
        <>
          <Progress value={quota.percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatBytes(quota.used)} {t('storage.used')}
            </span>
            <span>
              {formatBytes(quota.available)} {t('storage.available')}
            </span>
          </div>

          {quota.status === 'warning' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={smoothSlow}
              className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {t('storage.warningTitle')}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {t('storage.warningDesc')}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOptimize}
                  className="mt-2 h-7 text-xs"
                >
                  {t('storage.optimize')}
                </Button>
              </div>
            </motion.div>
          )}

          {quota.status === 'critical' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={smoothSlow}
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {t('storage.criticalTitle')}
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {t('storage.criticalDesc')}
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
