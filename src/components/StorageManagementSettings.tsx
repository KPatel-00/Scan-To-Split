/**
 * Storage Management Settings - Premium UI for Client-Side Persistence
 * Part 5, Section 3: Database (V1.0 - localStorage management)
 * 
 * Refactored into focused modules for better maintainability:
 * - StorageQuotaDisplay: Quota visualization
 * - StorageHealthDisplay: Health metrics
 * - StorageActions: Export/import/clear actions
 * - ClearDataDialog: Confirmation dialog
 * - useStorageManagement: Business logic hook
 */

import { Database, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { StorageQuotaDisplay } from './storage/StorageQuotaDisplay';
import { StorageHealthDisplay } from './storage/StorageHealthDisplay';
import { StorageActions } from './storage/StorageActions';
import { ClearDataDialog } from './storage/ClearDataDialog';
import { useStorageManagement } from './storage/hooks/useStorageManagement';
import { formatBytes, formatPercentage } from '../lib/storage';
import { feedback } from '../lib/feedback';

export function StorageManagementSettings() {
  const { t } = useTranslation();
  const {
    quota,
    health,
    isLoading,
    showClearDialog,
    setShowClearDialog,
    isClearing,
    handleExportData,
    handleImportData,
    handleClearData,
    handleClearOldData,
  } = useStorageManagement();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('storage.title')}
          </CardTitle>
          <CardDescription>{t('storage.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('storage.title')}
          </CardTitle>
          <CardDescription>{t('storage.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StorageQuotaDisplay
            quota={quota}
            onOptimize={handleClearOldData}
            formatBytes={formatBytes}
            formatPercentage={formatPercentage}
          />

          <StorageHealthDisplay health={health} />

          <StorageActions
            onExport={handleExportData}
            onImport={handleImportData}
            onClear={() => {
              feedback.click();
              setShowClearDialog(true);
            }}
          />
        </CardContent>
      </Card>

      <ClearDataDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={handleClearData}
        isClearing={isClearing}
      />
    </>
  );
}
