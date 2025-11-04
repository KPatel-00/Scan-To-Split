import { Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { smoothSlow } from '@/lib/motion/physics';

interface ItemSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  itemCount?: number; // Optional item count badge for Part 3
  showSearchText?: boolean; // Optional search text display for Part 2
  zIndex?: number; // Customizable z-index for different page contexts
}

export function ItemSearchBar({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  itemCount,
  showSearchText = false,
  zIndex = 10,
}: ItemSearchBarProps) {
  const { t } = useTranslation();

  const handleClear = () => {
    onChange('');
  };

  return (
    <motion.div
      className={cn(
        'sticky top-0 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border pb-3 mb-4',
        `z-${zIndex}`,
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothSlow}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('setup.itemsList.searchPlaceholder')}
          className={cn(
            'pl-10',
            itemCount !== undefined ? 'pr-20 h-11 text-base' : 'pr-10'
          )}
          aria-label={t('ariaLabels.searchItems')}
        />
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
            >
              {/* Item count badge (Part 3) */}
              {itemCount !== undefined && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                >
                  {itemCount}
                </motion.span>
              )}
              
              {/* Clear button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className={cn(
                  'rounded-full hover:bg-muted',
                  itemCount !== undefined ? 'h-7 w-7' : 'h-6 w-6'
                )}
                aria-label={t('ariaLabels.clearSearch')}
              >
                <X className={itemCount !== undefined ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Search text display (Part 2) */}
      <AnimatePresence>
        {showSearchText && value && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground mt-2"
          >
            {t('setup.itemsList.searching')}: &quot;{value}&quot;
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
