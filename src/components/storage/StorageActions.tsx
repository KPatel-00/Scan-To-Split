/**
 * Storage Actions Component
 * Provides export, import, and clear data actions
 */

import { motion } from 'framer-motion';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { smoothSlow } from '@/lib/motion/physics';

interface StorageActionsProps {
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
}

export function StorageActions({ onExport, onImport, onClear }: StorageActionsProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothSlow, delay: 0.2 }}
      className="space-y-2 pt-2"
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="justify-start"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('storage.export')}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="justify-start"
        >
          <Upload className="mr-2 h-4 w-4" />
          {t('storage.import')}
        </Button>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={onClear}
        className="w-full justify-start"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t('storage.clearAll')}
      </Button>
    </motion.div>
  );
}
