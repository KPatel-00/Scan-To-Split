/**
 * First-Time User Welcome Modal
 * 
 * Premium multi-step onboarding for new users.
 * Shows feature highlights, quick tips, and app overview.
 * 
 * ✨ REFACTORED: Now self-manages open state via Zustand store
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Sparkles,
  Camera,
  Users,
  Receipt,
  Share2,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../lib/feedback';
import { completeOnboarding } from '../../lib/session';
import { useStore } from '../../store/useStore';

interface WelcomeModalProps {
  // ✨ No more 'open' prop! Modal reads its own state from store
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 'intro',
    icon: Sparkles,
    titleKey: 'onboarding.intro.title',
    descriptionKey: 'onboarding.intro.description',
    features: [
      { icon: Camera, textKey: 'onboarding.intro.feature1' },
      { icon: Users, textKey: 'onboarding.intro.feature2' },
      { icon: Receipt, textKey: 'onboarding.intro.feature3' },
    ],
  },
  {
    id: 'howItWorks',
    icon: Receipt,
    titleKey: 'onboarding.howItWorks.title',
    descriptionKey: 'onboarding.howItWorks.description',
    steps: [
      { number: 1, textKey: 'onboarding.howItWorks.step1' },
      { number: 2, textKey: 'onboarding.howItWorks.step2' },
      { number: 3, textKey: 'onboarding.howItWorks.step3' },
      { number: 4, textKey: 'onboarding.howItWorks.step4' },
    ],
  },
  {
    id: 'quickTips',
    icon: Sparkles,
    titleKey: 'onboarding.quickTips.title',
    descriptionKey: 'onboarding.quickTips.description',
    tips: [
      { textKey: 'onboarding.quickTips.tip1' },
      { textKey: 'onboarding.quickTips.tip2' },
      { textKey: 'onboarding.quickTips.tip3' },
      { textKey: 'onboarding.quickTips.tip4' },
    ],
  },
];

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  
  // ✨ Read open state directly from store - no prop drilling!
  const open = useStore((state) => state.isWelcomeModalOpen);
  
  const totalSteps = onboardingSteps.length;
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    feedback.click();
    
    if (currentStep === totalSteps - 1) {
      // Last step - complete onboarding
      completeOnboarding();
      feedback.success();
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    feedback.click();
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    feedback.click();
    completeOnboarding();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl">
                    {t(step.titleKey)}
                  </DialogTitle>
                  {/* Premium step badge */}
                  <Badge variant="outline" className="text-xs">
                    {currentStep + 1}/{totalSteps}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('onboarding.stepCounter', { current: currentStep + 1, total: totalSteps })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              {t('buttons.skip')}
            </Button>
          </div>
        </DialogHeader>

        <div className="relative min-h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <DialogDescription className="text-base">
                {t(step.descriptionKey)}
              </DialogDescription>

              {/* Step 1: Features */}
              {step.id === 'intro' && step.features && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {step.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 text-center overflow-hidden group hover:border-primary/40 transition-colors"
                    >
                      {/* Premium shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 relative">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <p className="text-sm font-medium leading-snug relative">
                        {t(feature.textKey)}
                      </p>
                      
                      {/* Premium "New" badge for first feature */}
                      {index === 0 && (
                        <Badge className="absolute top-2 right-2 gap-1 text-xs bg-gradient-to-r from-primary to-primary/80">
                          <Sparkles className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 2: How It Works */}
              {step.id === 'howItWorks' && step.steps && (
                <div className="space-y-4">
                  {step.steps.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 rounded-lg border bg-card p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {item.number}
                      </div>
                      <p className="pt-1 text-sm leading-relaxed">
                        {t(item.textKey)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 3: Quick Tips */}
              {step.id === 'quickTips' && step.tips && (
                <div className="space-y-4">
                  {step.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 rounded-lg bg-muted/50 p-4 hover:bg-muted/70 transition-colors group"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 group-hover:scale-110 transition-transform">
                        {/* Use Share2 icon for the last tip about sharing */}
                        {index === step.tips.length - 1 ? (
                          <Share2 className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          {t(tip.textKey)}
                        </p>
                        {/* Premium badge for special tips */}
                        {index === 0 && (
                          <Badge variant="secondary" className="mt-2 text-xs gap-1">
                            <Sparkles className="h-3 w-3" />
                            {t('onboarding.recommended')}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('buttons.back')}
          </Button>
          <Button onClick={handleNext} className="min-w-36">
            {currentStep === totalSteps - 1 ? (
              <>
                {t('buttons.getStarted')}
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                {t('buttons.next')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
