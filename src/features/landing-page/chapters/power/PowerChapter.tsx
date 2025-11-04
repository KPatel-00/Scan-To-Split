import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ChapterContainer } from '../../components/ChapterContainer';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { staggerContainer, staggerItem } from '@/lib/motion';


/**
 * Power Chapter - Coming Soon
 * 
 * Future: Feature showcase with tabbed interface (desktop) and carousel (mobile)
 */
export function PowerChapter() {
  return (
    <ChapterContainer id="power" background="gradient">
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="text-center space-y-8 max-w-3xl"
      >
        {/* Chapter label */}
        <motion.p 
          variants={staggerItem}
          className={cn(typography.label.lg, "text-muted-foreground uppercase tracking-wider")}
        >
          Chapter 4
        </motion.p>
        
        {/* Title */}
        <motion.h2 
          variants={staggerItem}
          className={cn(typography.heading.h1)}
        >
          The Power
        </motion.h2>
        
        {/* Placeholder visual box */}
        <motion.div
          variants={staggerItem}
          className="w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-background/10"
        >
          <div className="text-center space-y-3">
            <Zap className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className={cn(typography.label.md, "text-muted-foreground/60")}>
              Feature Demo Placeholder
            </p>
          </div>
        </motion.div>
        
        {/* Coming soon text */}
        <motion.p 
          variants={staggerItem}
          className={cn(typography.body.xl, "text-muted-foreground")}
        >
          Coming Soon
        </motion.p>
        
        {/* Description */}
        <motion.p 
          variants={staggerItem}
          className={cn(typography.body.md, "text-muted-foreground/70 max-w-xl mx-auto")}
        >
          Explore powerful features: multi-bill support, custom splits, habit learning, and more.
        </motion.p>
      </motion.div>
    </ChapterContainer>
  );
}
