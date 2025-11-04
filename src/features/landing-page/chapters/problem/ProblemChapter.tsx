import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ChapterContainer } from '../../components/ChapterContainer';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
/*import { staggerItem } from '@/lib/motion';*/
import { staggerContainer, staggerItem } from '@/lib/motion';


/**
 * Problem Chapter - Coming Soon
 * 
 * Future: Before/after comparison showing manual bill splitting pain points
 */
export function ProblemChapter() {
  return (
    <ChapterContainer id="problem" background="light">
      <motion.div 
        className="text-center space-y-8 max-w-3xl"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Chapter label */}
        <motion.p 
          className={cn(typography.label.lg, "text-muted-foreground uppercase tracking-wider")}
          variants={staggerItem}
        >
          Chapter 2
        </motion.p>
        
        {/* Title */}
        <motion.h2 
          className={cn(typography.heading.h1)}
          variants={staggerItem}
        >
          The Problem
        </motion.h2>
        
        {/* Placeholder visual box */}
        <motion.div
          variants={staggerItem}
          className="w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/10"
        >
          <div className="text-center space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className={cn(typography.label.md, "text-muted-foreground/60")}>
              Visual Placeholder
            </p>
          </div>
        </motion.div>
        
        {/* Coming soon text */}
        <motion.p 
          className={cn(typography.body.xl, "text-muted-foreground")}
          variants={staggerItem}
        >
          Coming Soon
        </motion.p>
        
        {/* Description */}
        <motion.p 
          className={cn(typography.body.md, "text-muted-foreground/70 max-w-xl mx-auto")}
          variants={staggerItem}
        >
          Discover how traditional bill splitting creates frustration, errors, and awkward conversations.
        </motion.p>
      </motion.div>
    </ChapterContainer>
  );
}
