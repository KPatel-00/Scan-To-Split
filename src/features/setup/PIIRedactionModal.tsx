import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { smoothSlow } from '@/lib/motion/physics';

interface PIIRedactionModalProps {
  // ✨ REFACTORED: Modal reads its own state from store
  onConfirmMasked: () => void;
  onScanOriginal: () => void;
}

export function PIIRedactionModal({
  onConfirmMasked,
  onScanOriginal,
}: PIIRedactionModalProps) {
  const { t } = useTranslation();
  const [showRedaction, setShowRedaction] = useState(true);
  
  // ✨ Read state from store
  const open = useStore((state) => state.isPIIRedactionModalOpen);
  const closePIIRedactionModal = useStore((state) => state.closePIIRedactionModal);
  const detections = useStore((state) => state.piiDetections);
  
  const totalPIIFound = detections.reduce(
    (sum, detection) => sum + detection.patterns.length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={closePIIRedactionModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {t('setup.piiModal.title', "We've got your back.")}
              </DialogTitle>
              <DialogDescription className="text-base">
                {t('setup.piiModal.subtitle', 'Privacy protection active')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="space-y-6 py-4">
          {/* Info Box */}
          <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">
                  {t(
                    'piiModal.description',
                    "We automatically detected and hid suspected sensitive info on your bill(s). We will only send this 'masked' version for scanning."
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('setup.piiModal.detailsCount', {
                    defaultValue: 'Found {{count}} potential sensitive item(s) across {{files}} receipt(s)',
                    count: totalPIIFound,
                    files: detections.length,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Redaction Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRedaction(!showRedaction)}
              className="gap-2"
            >
              {showRedaction ? (
                <>
                  <Eye className="h-4 w-4" />
                  {t('setup.piiModal.showOriginal', 'Show Original')}
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  {t('setup.piiModal.hideOriginal', 'Hide Sensitive Info')}
                </>
              )}
            </Button>
          </div>

          {/* Image Previews */}
          <div className="space-y-4">
            {detections.map((detection, index) => (
              <motion.div
                key={detection.fileName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...smoothSlow,
                  delay: index * 0.1,
                }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {detection.fileName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {detection.patterns.length} {t('setup.piiModal.itemsDetected', 'items detected')}
                  </span>
                </div>
                
                <div className="relative overflow-hidden rounded-md bg-muted">
                  <img
                    src={detection.imageUrl}
                    alt={`Receipt preview ${index + 1}`}
                    className="w-full h-auto"
                    style={{
                      filter: showRedaction ? 'none' : 'blur(0)',
                    }}
                  />
                  
                  {/* Redaction Overlay */}
                  <AnimatePresence>
                    {showRedaction && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                      >
                        {/* Simulated black boxes over PII areas */}
                        {detection.patterns.map((_pattern, patternIndex) => (
                          <div
                            key={patternIndex}
                            className="absolute bg-black"
                            style={{
                              // Random positioning for demo (would be actual OCR positions in production)
                              top: `${20 + patternIndex * 15}%`,
                              left: `${10 + (patternIndex % 3) * 30}%`,
                              width: '25%',
                              height: '3%',
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Detected Patterns List */}
                {detection.patterns.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {detection.patterns.map((pattern, patternIndex) => (
                      <div
                        key={patternIndex}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="capitalize">{pattern.type.replace('-', ' ')}</span>
                        <span className="text-xs opacity-50">({pattern.confidence} confidence)</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Learn More */}
          <div className="rounded-md bg-muted/50 p-4 text-xs text-muted-foreground">
            <p>
              {t(
                'piiModal.learnMore',
                "For 100% privacy, we recommend covering any sensitive numbers before taking a picture. This is an automated detection system and may not catch everything."
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onScanOriginal}
            className="gap-2"
          >
            {t('setup.piiModal.scanOriginal', 'Scan Original Anyway')}
            <span className="text-xs text-muted-foreground">
              ({t('setup.piiModal.notRecommended', 'Not Recommended')})
            </span>
          </Button>
          <Button
            onClick={onConfirmMasked}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {t('setup.piiModal.confirmMasked', 'Confirm & Scan Masked Image')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
