/**
 * The Logic Section - "The Differentiators"
 * 
 * ✨ PROMPT 13: Pattern 1.1 (Cinematic Scroll)
 * - Shows 3 key differentiators with scroll-linked visuals
 * - Desktop: Sticky visuals with scroll-linked opacity cross-fades
 * - Mobile: Stacked text-visual pairs with scroll-reveals
 * 
 * 🎯 Enhancement: Active Text Highlighting
 * - Active feature text: Full opacity (1.0) + normal scale (1.0)
 * - Inactive feature text: Dimmed (0.3 opacity) + slightly smaller (0.98 scale)
 * - Smooth scroll-linked transitions create clear visual hierarchy
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Layers, Zap, Brain } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { typography } from '../../lib/typography';
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

// Visual 1: Multi-Bill Accordion
function MultiBillVisual() {
  const bills = [
    { name: 'ALDI SÜD', date: 'Oct 21', total: '12.50', items: 6 },
    { name: 'Bar Bill', date: 'Oct 21', total: '45.00', items: 8 },
    { name: 'Café Luna', date: 'Oct 22', total: '18.30', items: 4 },
  ];

  return (
    <div className="w-full h-full rounded-2xl border-2 border-border bg-background p-6 shadow-2xl overflow-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-primary/10 p-2">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Your Bills</h4>
            <p className="text-xs text-muted-foreground">3 receipts</p>
          </div>
        </div>

        {/* Bill accordion items */}
        {bills.map((bill, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">{bill.date} · {bill.items} items</p>
                </div>
              </div>
              <div className="text-sm font-semibold">€{bill.total}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual 2: Custom Split Popover
function CustomSplitVisual() {
  const participants = ['Alice', 'Bob', 'Charlie'];

  return (
    <div className="w-full h-full rounded-2xl border-2 border-border bg-background p-6 shadow-2xl overflow-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-primary/10 p-2">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Custom Split</h4>
            <p className="text-xs text-muted-foreground">Pizza · €12.00</p>
          </div>
        </div>

        {/* Split inputs */}
        <div className="space-y-4">
          {participants.map((name, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {name[0]}
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">€</span>
                <div className="w-20 h-10 rounded-lg border bg-card flex items-center justify-center text-sm font-semibold">
                  4.00
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-sm font-semibold text-green-600">€12.00 ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual 3: Proactive Suggestion
function ProactiveSuggestionVisual() {
  return (
    <div className="w-full h-full rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-background p-6 shadow-2xl overflow-auto">
      <div className="flex h-full flex-col items-center justify-center gap-6">
        {/* Brain icon */}
        <div className="rounded-full bg-primary/20 p-6">
          <Brain className="h-12 w-12 text-primary" />
        </div>

        {/* Suggestion card */}
        <div className="w-full rounded-lg border-2 border-primary/30 bg-card p-6 text-center space-y-4">
          <p className="font-semibold">💡 Split like last time?</p>
          <p className="text-sm text-muted-foreground">
            You usually split pizza equally among 3 people
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Yes, please
            </button>
            <button className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors">
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DifferentiatorFeature {
  id: number;
  headline: string;
  description: string;
  visualComponent: React.ReactNode;
}

/**
 * Desktop Cinematic Experience
 */
function DesktopLogicSection({ features }: { features: DifferentiatorFeature[] }) {
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

  // Calculate active text index based on scroll progress
  const breakpoints = [0, 0.33, 0.66, 1];
  const activeTextIndex = useTransform(scrollYSpring, breakpoints, [0, 1, 2, 2]);

  // Create opacity/scale transforms for each feature based on activeTextIndex
  // This creates smoother transitions than fixed scroll breakpoints
  const createTextTransforms = (index: number) => {
    const opacity = useTransform(
      activeTextIndex,
      [index - 0.5, index, index + 0.5],
      [0.3, 1, 0.3]
    );
    const scale = useTransform(
      activeTextIndex,
      [index - 0.5, index, index + 0.5],
      prefersReducedMotion ? [1, 1, 1] : [0.98, 1, 0.98]
    );
    return { opacity, scale };
  };

  const textTransforms = [
    createTextTransforms(0),
    createTextTransforms(1),
    createTextTransforms(2),
  ];

  // Visual opacity cross-fades (unchanged)
  const visualOpacity1 = useTransform(scrollYSpring, [0, 0.25, 0.33], [1, 1, 0]);
  const visualOpacity2 = useTransform(scrollYSpring, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0]);
  const visualOpacity3 = useTransform(scrollYSpring, [0.58, 0.66, 1], [0, 1, 1]);

  // Visual scale (subtle depth effect)
  const visualScale1 = useTransform(scrollYSpring, [0, 0.33], prefersReducedMotion ? [1, 1] : [1, 0.95]);
  const visualScale2 = useTransform(scrollYSpring, [0.33, 0.66], prefersReducedMotion ? [1, 1] : [0.95, 0.95]);
  const visualScale3 = useTransform(scrollYSpring, [0.66, 1], prefersReducedMotion ? [1, 1] : [0.95, 1]);

  const visualOpacities = [visualOpacity1, visualOpacity2, visualOpacity3];
  const visualScales = [visualScale1, visualScale2, visualScale3];

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: All 3 Text Blocks */}
        <div className="space-y-12">
          {features.map((feature) => (
            <div key={feature.id}>
              <h3 className="text-3xl font-bold md:text-4xl tracking-tighter mb-4">
                {feature.headline}
              </h3>
              <p className="text-lg text-muted-foreground md:text-xl">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Show all visuals stacked */}
        <div className="space-y-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reducedTransition}
            >
              {feature.visualComponent}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: '300vh' }}>
      <div className="sticky top-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[70vh]">
        {/* Left: All 3 Text Blocks Stacked (Only One Highlighted at a Time) */}
        <div className="flex flex-col justify-center space-y-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              style={{ 
                opacity: textTransforms[i].opacity,
                scale: textTransforms[i].scale,
              }}
              className="transition-all break-words"
            >
              <h3 className="text-3xl font-bold md:text-4xl tracking-tighter mb-4">
                {feature.headline}
              </h3>
              <p className="text-lg text-muted-foreground md:text-xl">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right: Sticky Visuals with Layered Opacity (One Container, Visuals Cross-Fade) */}
        <div className="relative aspect-square max-w-md mx-auto w-full">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              style={{ 
                opacity: visualOpacities[i], 
                scale: visualScales[i],
              }}
              className="absolute inset-0 w-full h-full"
              transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.3 }}
            >
              {feature.visualComponent}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Simple Stack
 */
function MobileLogicSection({ features }: { features: DifferentiatorFeature[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-24">
      {features.map((feature) => (
        <div key={feature.id} className="space-y-8">
          {/* Text */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReducedMotion ? reducedTransition : springTransition}
          >
            <h3 className={`${typography.landing.featureHeading} mb-4`}>
              {feature.headline}
            </h3>
            <p className={typography.landing.featureDescription}>
              {feature.description}
            </p>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReducedMotion ? reducedTransition : springTransition}
          >
            {feature.visualComponent}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export function TheLogicSection() {
  const { t } = useTranslation();
  
  const features: DifferentiatorFeature[] = [
    {
      id: 1,
      headline: t('landing.logic.features.0.headline'),
      description: t('landing.logic.features.0.description'),
      visualComponent: <MultiBillVisual />,
    },
    {
      id: 2,
      headline: t('landing.logic.features.1.headline'),
      description: t('landing.logic.features.1.description'),
      visualComponent: <CustomSplitVisual />,
    },
    {
      id: 3,
      headline: t('landing.logic.features.2.headline'),
      description: t('landing.logic.features.2.description'),
      visualComponent: <ProactiveSuggestionVisual />,
    },
  ];

  return (
    <section className="container max-w-7xl px-4 py-16 md:py-24">
      {/* Desktop: Cinematic Scroll */}
      <div className="hidden md:block">
        <DesktopLogicSection features={features} />
      </div>

      {/* Mobile: Simple Stack */}
      <div className="block md:hidden">
        <MobileLogicSection features={features} />
      </div>
    </section>
  );
}
