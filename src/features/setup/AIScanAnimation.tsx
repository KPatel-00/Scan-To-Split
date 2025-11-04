import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Search, MapPin, Euro, ScanText, ListChecks } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { gentleNormal, bouncySlow } from '@/lib/motion/physics';

interface AIScanAnimationProps {
  fileCount: number;
  onComplete?: () => void;
}

type ScanState = 'uploading' | 'confirming' | 'processing' | 'rendering' | 'done';

const processingMessages = [
  { icon: Search, key: 'analyzing', text: "Let's see what we have here..." },
  { icon: MapPin, key: 'lookingForStore', text: 'Looking for store name and bill date...' },
  { icon: Euro, key: 'detectingCurrency', text: 'Detecting Currency...' },
  { icon: ScanText, key: 'readingText', text: 'Reading the fine print...', textMultiple: 'Analyzing receipts in parallel...' },
  { icon: ListChecks, key: 'findingItems', text: 'Finding all the items...' },
];

export function AIScanAnimation({ fileCount, onComplete }: AIScanAnimationProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<ScanState>('uploading');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [poppedIcons, setPoppedIcons] = useState<number[]>([]);

  const currentMessage = state === 'processing'
    ? (fileCount > 1 && processingMessages[messageIndex].key === 'readingText'
      ? processingMessages[messageIndex].textMultiple
      : processingMessages[messageIndex].text)
    : state === 'uploading'
    ? `Uploading... ${uploadProgress}%`
    : state === 'confirming'
    ? 'Got it!'
    : '';

  useEffect(() => {
    if (state === 'uploading') {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setState('confirming'), 200);
            return 100;
          }
          return Math.min(prev + 8, 100);
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'confirming') {
      const timer = setTimeout(() => setState('processing'), 1500);
      return () => clearTimeout(timer);
    }
    if (state === 'processing') {
      const timer = setTimeout(() => setState('rendering'), 10000);
      return () => clearTimeout(timer);
    }
    if (state === 'rendering') {
      const timer = setTimeout(() => {
        setState('done');
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, onComplete]);

  useEffect(() => {
    if (state === 'processing') {
      const interval = setInterval(() => {
        setMessageIndex((prev) => {
          const next = (prev + 1) % processingMessages.length;
          if (next === processingMessages.length - 1 && poppedIcons.length < 3) {
            setPoppedIcons((icons) => [...icons, icons.length]);
          }
          return next;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state, poppedIcons.length]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md px-4">
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{currentMessage}</div>
          <AnimatePresence mode="wait">
            {state === 'uploading' && (
              <motion.div key="uploading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={gentleNormal} className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Uploading Receipt{fileCount > 1 ? 's' : ''}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t('aiScan.uploading', 'Securing and compressing your images...')}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{t('aiScan.uploadingLabel', 'Uploading...')}</span>
                    <span className="tabular-nums">{uploadProgress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80 origin-left" 
                      initial={{ scaleX: 0 }} 
                      animate={{ scaleX: uploadProgress / 100 }} 
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            {state === 'confirming' && (
              <motion.div key="confirming" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={bouncySlow} className="flex flex-col items-center justify-center gap-4 py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ scale: bouncySlow, rotate: { duration: 0.5, delay: 0.2 } }}>
                  <CheckCircle className="h-16 w-16 text-green-500" strokeWidth={2.5} />
                </motion.div>
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold">
                  {t('aiScan.gotIt', 'Got it!')}
                </motion.span>
              </motion.div>
            )}
            {state === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="relative mx-auto">
                  <div className="relative mx-auto h-80 w-60 overflow-hidden rounded-xl border-2 border-dashed border-border bg-gradient-to-b from-muted/40 to-muted/20 shadow-2xl">
                    <motion.div 
                      className="absolute left-0 right-0 top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                      animate={{ y: ['0%', '32rem'] }} 
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }} 
                    />
                    <div className="relative space-y-4 p-6">
                      <Skeleton className="h-5 w-3/4 animate-pulse" />
                      <Skeleton className="h-4 w-1/2 animate-pulse" />
                      <div className="space-y-2 pt-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-3 animate-pulse" style={{ width: `${60 + (i * 5)}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-h-[80px]">
                  <AnimatePresence mode="wait">
                    {processingMessages.map((msg, idx) => (
                      idx === messageIndex && (
                        <motion.div key={msg.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center gap-4 text-center">
                          <motion.div animate={{ scale: [1, 1.1, 1], rotate: msg.key === 'analyzing' ? [0, 5, -5, 0] : 0 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}>
                            <msg.icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
                          </motion.div>
                          <p className="text-lg font-medium">
                            {fileCount > 1 && msg.key === 'readingText'
                              ? t(`aiScan.${msg.key}Multiple`, msg.textMultiple || '')
                              : t(`aiScan.${msg.key}`, msg.text)}
                          </p>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="rounded-lg border bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    {t('aiScan.privacyCaption', 'For your privacy, we automatically try to hide credit card numbers.')}{' '}
                    <button onClick={() => setShowLearnMore(true)} className="font-medium underline decoration-primary/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-primary">
                      {t('aiScan.learnMore', 'Learn More')}
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            )}
            {state === 'rendering' && (
              <motion.div key="rendering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{t('aiScan.rendering', 'Almost there...')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t('aiScan.renderingDesc', 'Preparing your items')}</p>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('aiScan.learnMoreTitle', 'How We Protect Your Privacy')}</DialogTitle>
            <DialogDescription className="space-y-4 pt-4 text-sm">
              <p>{t('aiScan.learnMoreDesc1', 'Our app does its best to find and hide sensitive data before scanning.')}</p>
              <p className="font-medium">{t('aiScan.learnMoreDesc2', 'For 100% privacy, we recommend you cover any sensitive numbers before taking a picture.')}</p>
              <p className="text-xs text-muted-foreground">{t('aiScan.learnMoreDesc3', 'This transfers final responsibility to you in a transparent way, ensuring maximum security.')}</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
