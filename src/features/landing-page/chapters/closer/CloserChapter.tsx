import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChapterContainer } from '../../components/ChapterContainer';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { staggerContainer, staggerItem } from '@/lib/motion';


/**
 * Closer Chapter - Coming Soon
 * 
 * Future: Final CTA with benefits and signup encouragement
 */
export function CloserChapter() {
  const navigate = useNavigate();

  return (
    <ChapterContainer id="closer" background="dark">
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
          className={cn(typography.label.lg, "text-muted-foreground/80 uppercase tracking-wider")}
        >
          Chapter 6
        </motion.p>
        
        {/* Title */}
        <motion.h2 
          variants={staggerItem}
          className={cn(typography.heading.h1)}
        >
          Get Started
        </motion.h2>
        
        {/* Placeholder benefits */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 my-8"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className={cn(typography.body.md, "text-muted-foreground/80")}>100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className={cn(typography.body.md, "text-muted-foreground/80")}>No Sign-Up</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className={cn(typography.body.md, "text-muted-foreground/80")}>Privacy First</span>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          variants={staggerItem}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto text-base font-semibold group"
            onClick={() => navigate('/setup')}
          >
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </ChapterContainer>
  );
}
