/**
 * Storage Management Hook
 * Handles all storage operations and state management
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../hooks/useToast';
import { feedback } from '../../../lib/feedback';
import {
  getStorageQuota,
  checkStorageHealth,
  getAllStorageData,
  importStorageData,
  clearAllStorageData,
  formatBytes,
  clearOldData,
  type StorageQuota,
  type StorageHealth,
} from '../../../lib/storage';

export function useStorageManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [quota, setQuota] = useState<StorageQuota | null>(null);
  const [health, setHealth] = useState<StorageHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load storage info on mount
  useEffect(() => {
    loadStorageInfo();
  }, []);

  async function loadStorageInfo() {
    setIsLoading(true);
    try {
      const [quotaData, healthData] = await Promise.all([
        getStorageQuota(),
        checkStorageHealth(),
      ]);
      setQuota(quotaData);
      setHealth(healthData);
    } catch (error) {
      console.error('Failed to load storage info:', error);
      toast({
        title: t('messages.error'),
        description: 'Failed to load storage information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExportData() {
    feedback.click();
    try {
      const data = getAllStorageData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scantosplit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      feedback.success();
      toast({
        title: t('storage.exportSuccess'),
        description: t('storage.exportSuccessDesc'),
      });
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.error'),
        description: t('storage.exportFailed'),
        variant: 'destructive',
      });
    }
  }

  async function handleImportData() {
    feedback.click();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        const success = importStorageData(data);

        if (success) {
          feedback.success();
          toast({
            title: t('storage.importSuccess'),
            description: t('storage.importSuccessDesc'),
          });

          // Reload page to reflect imported data
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error('Import failed');
        }
      } catch (error) {
        feedback.error();
        toast({
          title: t('messages.error'),
          description: t('storage.importFailed'),
          variant: 'destructive',
        });
      }
    };

    input.click();
  }

  async function handleClearData() {
    feedback.click();
    setIsClearing(true);

    try {
      // Wait a moment for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      clearAllStorageData();

      feedback.success();
      toast({
        title: t('storage.clearSuccess'),
        description: t('storage.clearSuccessDesc'),
      });

      setShowClearDialog(false);

      // Reload page to reflect cleared data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.error'),
        description: t('storage.clearFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  }

  async function handleClearOldData() {
    feedback.click();
    try {
      const freedBytes = await clearOldData();

      feedback.success();
      toast({
        title: t('storage.optimizeSuccess'),
        description: `${t('storage.optimizeSuccessDesc')} ${formatBytes(freedBytes)}`,
      });

      // Reload storage info
      await loadStorageInfo();
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.error'),
        description: t('storage.optimizeFailed'),
        variant: 'destructive',
      });
    }
  }

  return {
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
  };
}
