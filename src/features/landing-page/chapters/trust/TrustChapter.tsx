import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { ChapterContainer } from '../../components/ChapterContainer';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { staggerItem } from '@/lib/motion';

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

/**
 * Trust Chapter - Coming Soon
 * 
 * Future: Testimonials grid and security/privacy highlights
 */
export function TrustChapter() {
  return (
    <ChapterContainer id="trust" background="light">
      <motion.div 
        variants={containerVariants}
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
          Chapter 5
        </motion.p>
        
        {/* Title */}
        <motion.h2 
          variants={staggerItem}
          className={cn(typography.heading.h1)}
        >
          Trust & Security
        </motion.h2>
        
        {/* Placeholder visual box */}
        <motion.div
          variants={staggerItem}
          className="w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/10"
        >
          <div className="text-center space-y-3">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className={cn(typography.label.md, "text-muted-foreground/60")}>
              Testimonials Placeholder
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
          Privacy-first design. No accounts required. Your data stays on your device.
        </motion.p>
      </motion.div>
    </ChapterContainer>
  );
}
