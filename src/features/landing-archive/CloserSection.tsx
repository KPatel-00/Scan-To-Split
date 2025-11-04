/**
 * Closer Section - "Final CTA"
 * 
 * ✨ PROMPT 13: Inverted theme with single CTA
 * - Dark/light inversion for visual impact
 * - Clear single call-to-action
 * - Staggered entry animation
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { ScanLine } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

const springTransition = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 25,
};

const reducedTransition = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: reducedTransition,
  },
};

export function CloserSection() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();

  const handleScanBill = () => {
    navigate('/setup');
  };

  const variants = prefersReducedMotion ? reducedItemVariants : itemVariants;
  const parentVariants = prefersReducedMotion ? reducedItemVariants : containerVariants;

  return (
    <section className="relative overflow-hidden">
      {/* Inverted Background */}
      <div className="bg-foreground text-background py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={parentVariants}
          className="container max-w-4xl px-4 text-center"
        >
          {/* Headline */}
          <motion.h2
            variants={variants}
            className="text-4xl font-bold md:text-5xl tracking-tighter mb-6"
          >
            {t('landing.closer.headline')}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={variants}
            className="text-lg md:text-xl text-background/80 mb-10 max-w-2xl mx-auto"
          >
            {t('landing.closer.subheadline')}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={variants}>
            <Button
              onClick={handleScanBill}
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 text-base font-semibold shadow-2xl"
            >
              <ScanLine />
              {t('landing.closer.cta')}
            </Button>
          </motion.div>

          {/* Trust Indicator */}
          <motion.p
            variants={variants}
            className="mt-8 text-sm opacity-60"
          >
            {t('landing.closer.trustIndicator')}
          </motion.p>
        </motion.div>
      </div>

      {/* Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
