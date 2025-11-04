import { motion } from 'framer-motion';
import { HelpCircle, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { feedback } from '../../lib/feedback';
import type { Currency, Receipt } from '../../store/useStore';
import { smoothSlow } from '@/lib/motion/physics';
import { iconTactile } from '@/lib/motion';

interface GrandTotalSectionProps {
  subtotal: number;
  tax: number;
  tip: number;
  grandTotal: number;
  currency: Currency;
  managementMode: 'merged' | 'separate';
  mergedStoreName: string;
  receipts: Receipt[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export function GrandTotalSection({
  subtotal,
  tax,
  tip,
  grandTotal,
  currency,
  managementMode,
  mergedStoreName,
  receipts,
}: GrandTotalSectionProps) {
  const { t } = useTranslation();

  // Determine bill sources caption
  const billSources =
    managementMode === 'merged' && mergedStoreName
      ? mergedStoreName
      : managementMode === 'separate' && receipts.length > 0
      ? receipts.map(r => r.storeName || 'Unknown').join(' & ')
      : 'Unknown Store';

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
        {/* Header with Bill Sources */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {t('summary.finalSummary.grandTotal')}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-3.5 w-3.5" />
              <span>{billSources}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-base">
            <span className="text-muted-foreground">{t('summary.subtotal')}</span>
            <span className="font-medium">
              {currency.symbol}{subtotal.toFixed(2)}
            </span>
          </div>

          {/* Tax (if any) */}
          {tax > 0 && (
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">{t('summary.tax')}</span>
              <span className="font-medium">
                {currency.symbol}{tax.toFixed(2)}
              </span>
            </div>
          )}

          {/* Tip (if any) */}
          {tip > 0 && (
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">{t('summary.tip')}</span>
              <span className="font-medium">
                {currency.symbol}{tip.toFixed(2)}
              </span>
            </div>
          )}

          {/* Divider + Grand Total with Penny Problem Tooltip */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">{t('summary.finalSummary.grandTotal')}</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {currency.symbol}{grandTotal.toFixed(2)}
                </span>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={iconTactile.hover.transition}
                        onClick={() => feedback.click()}
                        className="inline-flex items-center justify-center rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors p-1.5 group"
                      >
                        <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="sr-only">{t('summary.pennyProblem.label')}</span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="max-w-xs bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg"
                      sideOffset={8}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {t('summary.pennyProblem.label')}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {t('summary.pennyProblem.tooltip')}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
