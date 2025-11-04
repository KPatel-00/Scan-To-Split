import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { smoothSlow } from '@/lib/motion/physics';
// import { ChapterBadge } from '../../../components/ChapterBadge';

/**
 * Step 1: Phone camera scanning receipt
 * Duration: 8 seconds (0-8s)
 * Shows AI-powered receipt scanning with phone mockup
 * 
 * Animation Flow:
 * 1. Phone appears (0-1.0s)
 * 2. Reticle corners appear (1.0-1.5s) - Camera viewfinder activates
 * 3. Receipt slides in behind reticle (1.8-2.5s)
 * 4. "Scanning Receipt..." badge (2.6-3.6s) - 1 second display
 * 5. Scanning beam sweeps top to bottom ONCE (2.6-3.6s) - 1 second scan
 * 6. "Receipt Scanned!" confirmation (3.7-4.5s) - 0.8 second display
 * 7. "AI Analyzing..." badge (4.5-5.5s) - 1 second display
 * 8. Items appear progressively (5.5-7.0s) - 1.5 seconds total
 * 9. Total appears (7.0s)
 * 10. Flash effect (7.2s)
 * 11. "Next: Add People →" badge (7.5s)
 */
export function Step1Scan() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Phone frame */}
      <motion.div
        className="relative w-64 h-[450px] bg-foreground/5 rounded-[2.5rem] border-[8px] border-foreground/20 shadow-2xl overflow-hidden"
        initial={{ y: 100, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Camera viewfinder overlay */}
        <div className="absolute inset-0 bg-background/95">
          {/* Scanning reticle corners - stay visible, larger and clearer */}
          <svg className="absolute inset-0 z-20 pointer-events-none" viewBox="0 0 256 450">
            {/* Top-left corner */}
            <motion.path
              d="M 40,60 L 40,100 M 40,60 L 80,60"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary drop-shadow-lg"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            />
            {/* Top-right corner */}
            <motion.path
              d="M 216,60 L 176,60 M 216,60 L 216,100"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary drop-shadow-lg"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.15 }}
            />
            {/* Bottom-right corner */}
            <motion.path
              d="M 216,390 L 216,350 M 216,390 L 176,390"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary drop-shadow-lg"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
            {/* Bottom-left corner */}
            <motion.path
              d="M 40,390 L 80,390 M 40,390 L 40,350"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary drop-shadow-lg"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.45 }}
            />
          </svg>

          {/* Receipt paper - slides in behind the reticle */}
          <motion.div
            className="absolute inset-x-8 top-16 bottom-20 bg-background rounded-lg border-2 border-primary/20 p-4 shadow-lg overflow-hidden z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.7 }}
          >
            <div className={cn(typography.label.xs, 'text-center mb-3 pb-2 border-b border-border/50')}>
              <div className="font-semibold">Aldi Süd</div>
              <div className={cn(typography.label.xs, 'text-muted-foreground')}>Oct 22 • 15:17</div>
            </div>
            
            {/* Items - appear after analysis */}
            <div className={cn(typography.label.xs, 'space-y-1.5 mb-3')}>
              <motion.div 
                className="flex justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.5 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 5.5, duration: 0.5 }}
                />
                <span className="relative z-10">Joghurt 1kg</span><span className="relative z-10">€1.79</span>
              </motion.div>
              <motion.div 
                className="flex justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.75 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 5.75, duration: 0.5 }}
                />
                <span className="relative z-10">Landmilch 2x</span><span className="relative z-10">€2.70</span>
              </motion.div>
              <motion.div 
                className="flex justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.0 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 6.0, duration: 0.5 }}
                />
                <span className="relative z-10">Pfand</span><span className="relative z-10">€0.50</span>
              </motion.div>
              <motion.div 
                className="flex justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.25 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 6.25, duration: 0.5 }}
                />
                <span className="relative z-10">Vollkornbrot</span><span className="relative z-10">€1.49</span>
              </motion.div>
              <motion.div 
                className="flex justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.5 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-primary/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 6.5, duration: 0.5 }}
                />
                <span className="relative z-10">Bananen</span><span className="relative z-10">€1.78</span>
              </motion.div>
              <motion.div 
                className="flex justify-between text-green-600 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.75 }}
              >
                <motion.div
                  className="absolute -inset-1 bg-green-500/20 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ delay: 6.75, duration: 0.5 }}
                />
                <span className="relative z-10">Pfand Rückgabe</span><span className="relative z-10">-€0.25</span>
              </motion.div>
            </div>
            
            {/* Total section */}
            <motion.div 
              className="pt-2 border-t-2 border-border/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 7.0, ...smoothSlow }}
            >
              <div className={cn(typography.label.sm, 'flex justify-between font-bold')}>
                <span>TOTAL</span>
                <span className="text-primary">€8.01</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Scanning beam - ONE sweep from top to bottom within reticle bounds */}
          {!prefersReducedMotion && (
            <>
              {/* Main scanning beam - constrained within reticle */}
              <motion.div
                className="absolute left-10 right-10 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg shadow-primary/50 z-30"
                initial={{ top: 60, opacity: 0 }}
                animate={{ 
                  top: 390,
                  opacity: [0, 1, 1, 0.5]
                }}
                transition={{
                  duration: 1.0,
                  ease: 'linear',
                  delay: 2.6,
                  times: [0, 0.05, 0.95, 1]
                }}
              />
              
              {/* Secondary glow beam */}
              <motion.div
                className="absolute left-10 right-10 h-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-xl z-30"
                initial={{ top: 60, opacity: 0 }}
                animate={{ 
                  top: 390,
                  opacity: [0, 0.8, 0.8, 0.3]
                }}
                transition={{
                  duration: 1.0,
                  ease: 'linear',
                  delay: 2.6,
                  times: [0, 0.05, 0.95, 1]
                }}
              />

              {/* Particle effects along scan line */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/50 z-30"
                  initial={{ 
                    left: `${20 + i * 10}%`,
                    top: 60,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    top: 390,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.3, 1.3, 0.5]
                  }}
                  transition={{
                    duration: 1.0,
                    ease: 'linear',
                    delay: 2.6 + i * 0.03,
                    times: [0, 0.05, 0.95, 1]
                  }}
                />
              ))}
            </>
          )}

          {/* Status messages - progressive narrative */}
          
          {/* Phase 1: Scanning (2.6-3.6s) - 1 second display */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 text-center z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 2.6, duration: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ delay: 0, duration: 1.0, times: [0, 0.9, 1] }}
            >
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span>Scanning Receipt...</span>
            </motion.div>
          </motion.div>

          {/* Phase 2: Scanned confirmation (3.7-4.5s) - 0.8 second display */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 text-center z-40"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.9, 1, 1, 0.95],
              y: [10, 0, 0, -5]
            }}
            transition={{ delay: 3.7, duration: 0.8, times: [0, 0.15, 0.85, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold border border-green-500/20">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <span>Receipt Scanned!</span>
            </div>
          </motion.div>

          {/* Phase 3: Analyzing with AI animation (4.5-5.5s) - 1 second display */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 text-center z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5, duration: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ delay: 0, duration: 1.0, times: [0, 0.9, 1] }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { 
                  rotate: [0, 360],
                  scale: [1, 1.15, 1]
                }}
                transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>AI Analyzing...</span>
            </motion.div>
          </motion.div>

          {/* Phase 4: Next step (7.5s) - stays until transition */}
          <motion.div
            className="absolute bottom-6 left-0 right-0 text-center z-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 7.5, ...smoothSlow }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Next: Add People →</span>
            </div>
          </motion.div>
        </div>

        {/* Shutter flash effect - after all items appear */}
        <motion.div
          className="absolute inset-0 bg-primary/40 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.4, delay: 7.2 }}
        />
      </motion.div>
    </motion.div>
  );
}

