import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Currency } from '../../../store/types';

interface SplitValidationDisplayProps {
  liveTotal: number;
  expectedTotal: number;
  isValid: boolean;
  currency: Currency;
}

export function SplitValidationDisplay({
  liveTotal,
  expectedTotal,
  isValid,
  currency,
}: SplitValidationDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="border-t border-border pt-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {t('assignment.customSplit.liveTotal')}:
        </span>
        <span
          className={`text-lg font-bold transition-colors ${
            isValid
              ? 'text-green-500 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}
        >
          {currency.symbol}
          {liveTotal.toFixed(2)}
        </span>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {!isValid && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="origin-top overflow-hidden"
          >
            <p className="text-xs text-red-600 dark:text-red-400">
              {t('assignment.customSplit.errorMessage', {
                expected: `${currency.symbol}${expectedTotal.toFixed(2)}`,
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
