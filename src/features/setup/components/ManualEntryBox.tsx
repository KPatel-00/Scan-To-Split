/**
 * ManualEntryBox - Manual receipt text entry
 * Textarea with parsing instructions and parse button
 */

import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { feedback } from '@/lib/feedback';
import { useToast } from '@/hooks/useToast';

interface ManualEntryBoxProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
}

const baseBoxStyles = "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-muted/20 to-muted/40 p-12 sm:p-14";

export function ManualEntryBox({ value, onChange, onParse }: ManualEntryBoxProps) {
  const { toast } = useToast();

  const handleParse = () => {
    feedback.success();
    toast({
      title: 'Parsing receipt...',
      description: 'Manual parsing coming soon!',
    });
    onParse();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={baseBoxStyles}
    >
      {/* Info Icon with Tooltip - Top Right */}
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="font-semibold mb-2">Supported Formats:</p>
              <ul className="text-xs space-y-1">
                <li>• Item Name 3.45 or €3.45 Item Name</li>
                <li>• Quantities: x2, 2x, (2x), ×2, or 3 * 1.29</li>
                <li>• Decimals: 3.45 or 3,45</li>
                <li>• Refunds: Pfand -1.25 (negative amounts)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Centered Text Input - Compact */}
      <div className="w-full max-w-3xl space-y-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your receipt here...\n\nVitaminwasser 500ml 3.45\nMilk 1L x2 1.20\nBread 0.89\nCoupon -2.00"
          className="h-[160px] font-mono text-sm resize-none bg-background/50"
        />

        <Button
          size="lg"
          onClick={handleParse}
          disabled={!value.trim()}
          className="w-full h-14 gap-2 text-base font-semibold shadow-lg pointer-events-auto"
        >
          <Sparkles className="h-6 w-6" />
          Parse Receipt
        </Button>
      </div>
    </motion.div>
  );
}
