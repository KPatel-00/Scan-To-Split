/**
 * Trust Section - "Testimonials"
 * 
 * ✨ PROMPT 13: Pattern 3.2 (Staggered Entry)
 * - Social proof through user testimonials
 * - Staggered card animations on scroll
 * - 3-column grid on desktop, stacked on mobile
 */

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
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

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        prefersReducedMotion
          ? reducedTransition
          : { ...springTransition, delay: index * 0.1 }
      }
      className="group relative"
    >
      <div className="h-full rounded-2xl border-2 border-border bg-card p-6 shadow-lg transition-all hover:shadow-2xl hover:border-primary/50">
        {/* Quote icon */}
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-full bg-primary/10 p-2">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <span className="text-4xl" role="img" aria-label="Avatar">
            {testimonial.avatar}
          </span>
        </div>

        {/* Quote */}
        <p className="mb-6 text-base leading-relaxed text-foreground">
          "{testimonial.quote}"
        </p>

        {/* Author */}
        <div className="border-t pt-4">
          <p className="font-semibold text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();

  // Get testimonials from translation
  const testimonials: Testimonial[] = t('landing.trust.testimonials', { returnObjects: true }) as Testimonial[];

  return (
    <section className="container max-w-7xl px-4 py-16 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={prefersReducedMotion ? reducedTransition : springTransition}
        className="mb-12 text-center md:mb-16"
      >
        <h2 className="text-4xl font-bold md:text-5xl tracking-tighter mb-4">
          {t('landing.trust.sectionTitle')}
        </h2>
        <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
          {t('landing.trust.sectionSubtitle')}
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={{ ...testimonial, id: index + 1 }}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
