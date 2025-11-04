import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ChapterContainer } from '../../components/ChapterContainer';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { staggerContainer, staggerItem } from '@/lib/motion';


/**
 * Magic Chapter - Coming Soon
 * 
 * Future: AI receipt scanning demonstration with sticky scroll
 */
export function MagicChapter() {
  return (
    <ChapterContainer id="magic" background="dark">
      <motion.div 
        className="text-center space-y-8 max-w-3xl"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Chapter label */}
        <motion.p 
          className={cn(typography.label.lg, "text-muted-foreground/80 uppercase tracking-wider")}
          variants={staggerItem}
        >
          Chapter 3
        </motion.p>
        
        {/* Title */}
        <motion.h2 
          className={cn(typography.heading.h1)}
          variants={staggerItem}
        >
          The Magic
        </motion.h2>
        
        {/* Placeholder visual box */}
        <motion.div
          variants={staggerItem}
          className="w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-background/5"
        >
          <div className="text-center space-y-3">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className={cn(typography.label.md, "text-muted-foreground/60")}>
              AI Animation Placeholder
            </p>
          </div>
        </motion.div>
        
        {/* Coming soon text */}
        <motion.p 
          className={cn(typography.body.xl, "text-muted-foreground/80")}
          variants={staggerItem}
        >
          Coming Soon
        </motion.p>
        
        {/* Description */}
        <motion.p 
          className={cn(typography.body.md, "text-muted-foreground/60 max-w-xl mx-auto")}
          variants={staggerItem}
        >
          Watch AI transform messy receipts into clean, organized bill splits in seconds.
        </motion.p>
      </motion.div>
    </ChapterContainer>
  );
}
