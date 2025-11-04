/**
 * Clear Data Confirmation Dialog
 * Warning dialog for clearing all storage data
 */

import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ClearDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isClearing: boolean;
}

export function ClearDataDialog({
  open,
  onOpenChange,
  onConfirm,
  isClearing,
}: ClearDataDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('storage.clearDialogTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('storage.clearDialogDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            {t('storage.clearWarning')}
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• {t('storage.clearWarning1')}</li>
            <li>• {t('storage.clearWarning2')}</li>
            <li>• {t('storage.clearWarning3')}</li>
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isClearing}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isClearing}
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('storage.clearing')}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('storage.clearConfirm')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
