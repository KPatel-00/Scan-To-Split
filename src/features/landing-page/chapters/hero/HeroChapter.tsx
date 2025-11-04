/**
 * Hero Chapter - Ultra-Minimalist Premium Design
 * 
 * Philosophy: Less is more. Premium through simplicity.
 * Inspired by: Apple product pages, Revolut, Linear.app, Gemini AI
 * 
 * Core Principles:
 * - Single powerful headline (word-by-word reveal)
 * - One clear value proposition
 * - Generous whitespace everywhere
 * - One confident CTA (with shimmer effect)
 * - Clean elegant visual
 * - Zero clutter
 * 
 * Premium Enhancements:
 * - Word-by-word spring animation for headline
 * - ChapterBadge for branding
 * - Feature Pills highlighting key benefits
 * - Improved responsive typography
 * - Custom ScrollHint with context
 * - Button shimmer on hover
 * - Text-wrap balance for perfect typography
 * - Premium spring physics (stiffness: 300-400)
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, DollarSign, Copy, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PremiumCTA } from '@/components/ui/premium-cta';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { wordByWordContainer, wordByWordItem, staggerContainer, staggerItem } from '@/lib/motion';
import { ChapterContainer } from '../../components/ChapterContainer';
import { ScrollHint } from '../../components/ScrollHint';
import { FeaturePill } from './components/FeaturePill';


export function HeroChapter() {
  const { t } = useTranslation();
  const [headlineComplete, setHeadlineComplete] = useState(false);
  
  // Split headline into words for animated reveal
  const headline = t('landing.hero.headline');
  const words = headline.split(" ");

  return (
    <ChapterContainer id="hero" background="gradient">
      {/* Centered vertical layout with stagger animation */}
      <motion.div 
        className="flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto space-y-8 md:space-y-10 xl:space-y-12"
        variants={staggerContainer}
        initial="initial"
        animate={headlineComplete ? "animate" : "initial"}
      >
        
        {/* Headline Section */}
        <div className="space-y-4 md:space-y-6 xl:space-y-8 max-w-5xl px-4">{/* Main Headline - Word by Word Reveal - Improved responsive typography */}
            <motion.h1 
              className={cn(
                // Responsive typography: Mobile → Tablet → Desktop
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
                "font-bold tracking-tight leading-[1.1]"
              )}
              style={{ textWrap: 'balance' }}
              variants={wordByWordContainer}
              initial="hidden"
              animate="visible"
              onAnimationComplete={() => setHeadlineComplete(true)}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordByWordItem}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                  className={i === 2 ? 'text-primary' : ''}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle - Fades in after headline completes */}
            <motion.p 
              className={cn(
                typography.body.xl,
                "text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              )}
              style={{ textWrap: 'balance' }}
              variants={staggerItem}
            >
              {t('landing.hero.subtitle')}
            </motion.p>
          </div>

          {/* Single CTA - Button fades in after subtitle */}
          <motion.div variants={staggerItem}>
            <PremiumCTA
              href="/setup"
              icon={ArrowRight}
              iconPosition="right"
              size="lg"
              shimmerSpeed="slow"
            >
              {t('landing.hero.cta')}
            </PremiumCTA>
          </motion.div>

          {/* Feature Pills - Fade in after CTA */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 px-4"
            variants={staggerItem}
          >
            <FeaturePill 
              icon={DollarSign} 
              text={t('landing.hero.features.free')} 
            />
            <FeaturePill 
              icon={Sparkles} 
              text={t('landing.hero.features.ai')} 
            />
            <FeaturePill 
              icon={Copy} 
              text={t('landing.hero.features.multiBill')} 
            />
          </motion.div>

          {/* ScrollHint - Fades in last */}
          <motion.div className="pt-4 md:pt-6" variants={staggerItem}>
            <ScrollHint text={t('landing.hero.scroll')} targetChapterId="problem" />
          </motion.div>
      </motion.div>
    </ChapterContainer>
  );
}

