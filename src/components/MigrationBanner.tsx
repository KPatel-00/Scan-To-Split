import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useStore } from '../store/useStore';
import { migrateItemsWithStats, isLegacyCategory } from '../lib/taxonomy/migration';
import { backdropFade } from '@/lib/motion/specialized';

interface MigrationSummary {
  total: number;
  migrated: number;
  failed: number;
}

export function MigrationBanner() {
  const { t } = useTranslation();
  const [migrating, setMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);

  // Check if migration is needed (memoized for performance)
  const needsMigration = useMemo(
    () => [...items, ...receipts.flatMap(r => r.items)].some(item => isLegacyCategory(item.category)),
    [items, receipts]
  );

  const handleMigration = useCallback(async () => {
    try {
      setMigrating(true);
      setError(null);
      
      // Simulate async migration (for UX)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Migrate items
      const itemsResult = migrateItemsWithStats(items);
      
      // Migrate receipts
      const receiptStats: MigrationSummary = {
        total: 0,
        migrated: 0,
        failed: 0,
      };
      
      receipts.forEach(r => {
        const result = migrateItemsWithStats(r.items);
        receiptStats.total += result.stats.total;
        receiptStats.migrated += result.stats.migrated;
        receiptStats.failed += result.stats.failed;
      });
      
      const totalStats: MigrationSummary = {
        total: itemsResult.stats.total + receiptStats.total,
        migrated: itemsResult.stats.migrated + receiptStats.migrated,
        failed: itemsResult.stats.failed + receiptStats.failed,
      };
      
      setMigrationStats(totalStats);
      setMigrationComplete(true);
      
      // Auto-reload after 3 seconds to apply migration
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('[Migration] Failed:', err);
      setError(err instanceof Error ? err.message : 'Migration failed');
      setMigrating(false);
    } finally {
      if (!error) {
        setMigrating(false);
      }
    }
  }, [items, receipts, error]);

  if (!needsMigration || migrationComplete) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="migration-banner"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        variants={backdropFade}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Alert variant={error ? "destructive" : "default"} className="border-primary backdrop-blur-sm bg-background/95">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error-state"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('migration.error', 'Migration Error')}</AlertTitle>
                <AlertDescription className="space-y-4">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button onClick={() => setError(null)} variant="outline" className="w-full">
                    {t('common.retry', 'Try Again')}
                  </Button>
                </AlertDescription>
              </motion.div>
            ) : migrating ? (
              <motion.div
                key="migrating-state"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>{t('migration.inProgress', 'Migrating...')}</AlertTitle>
                <AlertDescription className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      {t('migration.description', 'Updating your items...')}
                    </span>
                  </div>
                  <Progress value={50} className="h-2" />
                </AlertDescription>
              </motion.div>
            ) : migrationStats ? (
              <motion.div
                key="success-state"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>{t('migration.title', 'Migration Complete')}</AlertTitle>
                <AlertDescription>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {t('migration.complete', {
                        count: migrationStats.migrated,
                        defaultValue: `Successfully migrated ${migrationStats.migrated} items!`,
                      })}
                    </span>
                  </div>
                </AlertDescription>
              </motion.div>
            ) : (
              <motion.div
                key="prompt-state"
                variants={backdropFade}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('migration.title', 'Update Available')}</AlertTitle>
                <AlertDescription className="space-y-4">
                  <p>
                    {t('migration.description', 'A new categorization system is available. Migrate your data to unlock new features.')}
                  </p>
                  <Button onClick={handleMigration} className="w-full">
                    {t('migration.button', 'Migrate Now')}
                  </Button>
                </AlertDescription>
              </motion.div>
            )}
          </AnimatePresence>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}

