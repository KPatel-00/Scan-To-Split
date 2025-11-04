import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Share2, Loader2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useToast } from '../../hooks/useToast';
import { feedback } from '../../lib/feedback';
import { exportToPDF } from '../../lib/pdf';
import { exportShareableImage } from '../../lib/shareableImage';
import { useStore } from '../../store/useStore';
import type { Currency, Item, Participant, Receipt } from '../../store/useStore';
import { smoothSlow } from '@/lib/motion/physics';

interface ActionButtonsSectionProps {
  participants: Participant[];
  items: Item[];
  receipts: Receipt[];
  currency: Currency;
  managementMode: 'merged' | 'separate';
  mergedStoreName: string;
  mergedDate: string;
  mergedTax: number;
  mergedTip: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export function ActionButtonsSection({
  participants,
  items,
  receipts,
  currency,
  managementMode,
  mergedStoreName,
  mergedDate,
  mergedTax,
  mergedTip,
}: ActionButtonsSectionProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showNewBillDialog, setShowNewBillDialog] = useState(false);

  const handleExportPDF = async () => {
    feedback.click();
    setIsExporting(true);
    try {
      await exportToPDF({
        participants,
        items,
        receipts,
        currency,
        managementMode,
        mergedStoreName,
        mergedDate,
        mergedTax,
        mergedTip,
      });
      feedback.success();
      toast({
        title: t('messages.exportSuccess'),
        description: t('messages.pdfReady'),
      });
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.exportFailed'),
        description: t('messages.pdfError'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareImage = async () => {
    feedback.click();
    setIsSharing(true);
    try {
      const success = await exportShareableImage();
      if (success) {
        feedback.success();
        toast({
          title: t('messages.shareSuccess'),
          description: t('messages.shareReady'),
        });
      } else {
        throw new Error('Share failed');
      }
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.shareFailed'),
        description: t('messages.shareError'),
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    feedback.click();
    navigate('/assignment');
  };

  const handleStartNewBill = () => {
    feedback.click();
    setShowNewBillDialog(true);
  };

  const confirmStartNewBill = () => {
    feedback.success();
    setShowNewBillDialog(false);
    
    // Clear all Zustand state
    useStore.getState().clearAll();
    
    // Navigate to landing page
    navigate('/');
  };

  return (
    <>
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Left-Aligned: Back to Assign Button */}
          <Button
            onClick={handleBack}
            size="lg"
            variant="ghost"
            className="gap-2 justify-center sm:justify-start"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('summary.actions.backToAssign')}
          </Button>

          {/* Right-Aligned: Forward Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Download PDF Button */}
            <Button
              onClick={handleExportPDF}
              size="lg"
              variant="default"
              disabled={isExporting}
              className="gap-2 min-w-40 sm:min-w-44"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('summary.actions.generating')}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t('summary.actions.downloadPDF')}
                </>
              )}
            </Button>

            {/* Share Visual Button */}
            <Button
              onClick={handleShareImage}
              size="lg"
              variant="outline"
              disabled={isSharing}
              className="gap-2 min-w-40 sm:min-w-44"
            >
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('summary.actions.sharing')}
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  {t('summary.actions.share')}
                </>
              )}
            </Button>

            {/* Start New Bill Button */}
            <Button
              onClick={handleStartNewBill}
              size="lg"
              variant="destructive"
              className="gap-2 min-w-40 sm:min-w-44"
            >
              <RotateCcw className="h-4 w-4" />
              {t('summary.actions.startNewBill')}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Start New Bill Confirmation Dialog */}
      <Dialog open={showNewBillDialog} onOpenChange={setShowNewBillDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {t('summary.actions.newBillDialogTitle')}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {t('summary.actions.newBillDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                feedback.click();
                setShowNewBillDialog(false);
              }}
              className="gap-2"
            >
              {t('summary.actions.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmStartNewBill}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('summary.actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
