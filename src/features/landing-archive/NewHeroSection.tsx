/**
 * Hero Section - "The Hook"
 * 
 * ✨ PROMPT 13: Minimal, focused hero with single CTA
 * - Pattern 3.2: Staggered Entry animation on page load
 * - Removed confusing "Try Demo" and "Get Started" buttons
 * - Single clear CTA: "Scan Your First Bill" → Part 2
 * - Full i18n support
 */

import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../lib/feedback';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { typography } from '../../lib/typography';
import { UploadCloud } from 'lucide-react';

// gentleLand spring physics (Blueprint Part 0, Section 2)
const gentleLand = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 25,
};

export function NewHeroSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const handleScanFirstBill = () => {
    feedback.click();
    navigate('/setup');
  };

  // Stagger container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  // Individual item variants
  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: prefersReducedMotion ?
      { opacity: 1, y: 0 } :
      {
        opacity: 1,
        y: 0,
        transition: gentleLand,
      },
  };

  return (
    <section className="container max-w-6xl px-4 py-32 md:py-48 lg:py-56">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center text-center space-y-10 md:space-y-12"
      >
        {/* Headline - Minimalist bold typography with word-break for German */}
        <motion.h1
          variants={itemVariants}
          className={`${typography.hero} break-words hyphens-auto text-center w-full`}
        >
          {t('landing.hero.title')}
        </motion.h1>

        {/* Subheadline - Muted, clean description with better line height */}
        <motion.p
          variants={itemVariants}
          className={`${typography.heroSubtitle} max-w-4xl mx-auto break-words text-center`}
        >
          {t('landing.hero.subtitle')}
        </motion.p>

        {/* CTA - Hero button with minimalist styling and pulsing icon */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Button
            variant="hero"
            size="lg"
            onClick={handleScanFirstBill}
            className="font-semibold text-base"
          >
            {/* Icon with attention pulse - infinite animation */}
            <motion.div
              animate={!prefersReducedMotion ? { 
                scale: [1, 1.15, 1] 
              } : {}}
              transition={!prefersReducedMotion ? { 
                duration: 1.2, 
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.3 
              } : {}}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <UploadCloud />
            </motion.div>
            {t('landing.hero.cta')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
