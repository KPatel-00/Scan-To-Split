/**
 * Mess-to-Magic Section - "The AI Story"
 * 
 * ✨ PROMPT 13: Pattern 1.1 (Cinematic Scroll)
 * - Shows AI transformation: Receipt → AI Processing → Clean Items List
 * - Desktop: Sticky visuals with scroll-linked opacity cross-fades
 * - Mobile: Simple stacked layout with scroll-reveals
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FileText, Sparkles, List, Milk, Wheat, Package, Leaf, Cherry, Apple } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

const springTransition = {
  type: 'spring' as const,
  stiffness: 250,
  damping: 30,
};

const reducedTransition = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

// Visual 1: Real ALDI Receipt with Scanning Animation
function ReceiptVisual() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card shadow-2xl">
      {/* Real ALDI Bill SVG */}
      <img 
        src="/artifacts/images/TheAldiBill.svg" 
        alt="ALDI Receipt" 
        className="w-full h-full object-contain"
      />
      
      {/* Premium Scanning Animation - Top to Bottom */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent pointer-events-none"
            style={{
              boxShadow: '0 0 20px hsl(var(--primary)), 0 0 10px hsl(var(--primary))',
              filter: 'blur(1px)',
            }}
            initial={{ top: 0, opacity: 0.3 }}
            animate={{ 
              top: ['0%', '100%'],
              opacity: [0.3, 1, 0.8, 1, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
          
          {/* Secondary Scan Line - Bottom to Top (delayed) */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none"
            style={{
              boxShadow: '0 0 10px hsl(var(--primary) / 0.5)',
            }}
            initial={{ top: '100%', opacity: 0.2 }}
            animate={{ 
              top: ['100%', '0%'],
              opacity: [0.2, 0.6, 0.5, 0.6, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: 1.5,
            }}
          />
        </>
      )}
      
      {/* Receipt icon overlay */}
      <div className="absolute top-4 right-4 rounded-full bg-muted/30 p-2 backdrop-blur-sm">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

// Visual 2: AI Processing
function AIProcessingVisual() {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };
  
  return (
    <div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-background p-8 shadow-2xl">
      <div className="flex h-full flex-col items-center justify-center gap-6">
        {/* AI Sparkle Icon - Pulsing */}
        <motion.div
          className="rounded-full bg-primary/20 p-8"
          initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.9 }}
          animate={prefersReducedMotion ? { scale: 1 } : { scale: [0.9, 1.1, 0.9] }}
          transition={prefersReducedMotion ? {} : {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        
        {/* Processing text with stagger */}
        <motion.div
          className="text-center space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.p variants={itemVariants} className="text-lg font-semibold">
            {t('landing.messToMagic.processing.title')}
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            {t('landing.messToMagic.processing.step1')}
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            {t('landing.messToMagic.processing.step2')}
          </motion.p>
        </motion.div>
        
        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.4 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
              transition={prefersReducedMotion ? {} : {
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Visual 3: Clean Items List (Based on Real ALDI Bill)
function ItemsListVisual() {
  const items = [
    { name: 'Naturjoghurt 1kg', price: '7.16', qty: 4, Icon: Milk },
    { name: 'Landmilch 3,8%', price: '2.70', qty: 2, Icon: Milk },
    { name: 'Pfand', price: '0.50', qty: 2, Icon: Package },
    { name: 'Pringles 155g', price: '7.45', qty: 5, Icon: Package },
    { name: 'Speisezwiebeln rot', price: '1.78', qty: 2, Icon: Apple },
    { name: 'Roestzwiebeln 150g', price: '1.19', qty: 1, Icon: Package },
    { name: 'XXL Cashewkerne', price: '4.99', qty: 1, Icon: Wheat },
    { name: 'Bananen RFA', price: '0.78', qty: 1, Icon: Apple },
    { name: 'Ingwer Bio', price: '0.11', qty: 1, Icon: Leaf },
    { name: 'Rispentomaten lose', price: '1.20', qty: 1, Icon: Cherry },
  ];

  return (
    <div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-border bg-background p-6 shadow-2xl flex flex-col">
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <List className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Items Found</h4>
            <p className="text-xs text-muted-foreground">10 items</p>
          </div>
        </div>
      </div>
      
      {/* Scrollable item list */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <item.Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
              </div>
            </div>
            <div className="text-sm font-semibold">€{item.price}</div>
          </div>
        ))}
      </div>

      {/* Fixed Total at bottom */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Summe</span>
          <span className="text-lg font-bold font-mono">€29.44</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop Cinematic Experience
 */
function DesktopMessToMagic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Apply spring smoothing to scroll progress
  const scrollYSpring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map scroll to opacity (3 visuals)
  const opacity1 = useTransform(scrollYSpring, [0, 0.25, 0.33], [1, 1, 0]);
  const opacity2 = useTransform(scrollYSpring, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYSpring, [0.58, 0.66, 1], [0, 1, 1]);

  // Map scroll to scale (subtle depth effect)
  const scale1 = useTransform(scrollYSpring, [0, 0.33], [1, 0.95]);
  const scale2 = useTransform(scrollYSpring, [0.33, 0.66], [0.95, 0.95]);
  const scale3 = useTransform(scrollYSpring, [0.66, 1], [0.95, 1]);

  const { t } = useTranslation();

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold md:text-5xl tracking-tighter mb-6">
            {t('landing.messToMagic.title')}
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('landing.messToMagic.description')}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedTransition}
        >
          <ItemsListVisual />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: '200vh' }}>
      <div className="sticky top-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Sticky Text */}
        <div>
          <h2 className="text-4xl font-bold md:text-5xl tracking-tighter mb-6">
            {t('landing.messToMagic.title')}
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('landing.messToMagic.description')}
          </p>
        </div>

        {/* Right: Layered Visuals */}
        <div className="relative min-h-[600px]">
          <motion.div style={{ opacity: opacity1, scale: scale1 }} className="absolute inset-0">
            <ReceiptVisual />
          </motion.div>
          <motion.div style={{ opacity: opacity2, scale: scale2 }} className="absolute inset-0">
            <AIProcessingVisual />
          </motion.div>
          <motion.div style={{ opacity: opacity3, scale: scale3 }} className="absolute inset-0">
            <ItemsListVisual />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Simple Stack
 */
function MobileMessToMagic() {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={prefersReducedMotion ? reducedTransition : springTransition}
      >
        <h2 className="text-3xl font-bold md:text-4xl mb-6">
          {t('landing.messToMagic.title')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('landing.messToMagic.description')}
        </p>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={prefersReducedMotion ? reducedTransition : springTransition}
      >
        <ItemsListVisual />
      </motion.div>
    </div>
  );
}

export function MessToMagicSection() {
  return (
    <section className="container max-w-7xl px-4 py-16 md:py-24">
      {/* Desktop: Cinematic Scroll */}
      <div className="hidden md:block">
        <DesktopMessToMagic />
      </div>
      
      {/* Mobile: Simple Stack */}
      <div className="block md:hidden">
        <MobileMessToMagic />
      </div>
    </section>
  );
}
