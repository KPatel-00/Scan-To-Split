import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { Users, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '../../lib/haptics';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { smoothNormal } from '@/lib/motion/physics';
import { buttonTactile } from '@/lib/motion';

// Stagger animation for participant list with index-based delays
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Dynamic item variants based on index for cascading effect
const itemVariants = (index: number) => ({
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.8,
    rotate: -5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
      delay: index * 0.08, // Cascading entrance based on position
    },
  },
});

interface ParticipantPaletteProps {
  selectedParticipants: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function ParticipantPalette({ selectedParticipants, onSelectionChange }: ParticipantPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const participants = useStore((state) => state.participants);
  
  // ACCESSIBILITY: Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Track recently selected participants for premium "pulse" animation
  const [recentlySelected, setRecentlySelected] = useState<string[]>([]);
  
  // Premium particle effect state for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // Clear recently selected after animation completes
  useEffect(() => {
    if (recentlySelected.length > 0) {
      const timer = setTimeout(() => {
        setRecentlySelected([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [recentlySelected]);

  // Celebrate when all participants are selected
  useEffect(() => {
    if (participants.length > 0 && selectedParticipants.length === participants.length) {
      setShowCelebration(true);
      haptics.success();
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedParticipants.length, participants.length]);

  const toggleParticipant = (id: string) => {
    const isSelected = selectedParticipants.includes(id);
    
    onSelectionChange(
      isSelected
        ? selectedParticipants.filter((p) => p !== id)
        : [...selectedParticipants, id]
    );

    // Track recently selected for premium animation
    if (!isSelected) {
      setRecentlySelected([id]);
      haptics.toggle();
    } else {
      haptics.tap();
    }
  };

  const handleAddParticipants = () => {
    haptics.tap();
    navigate('/setup');
    
    // Focus participant input field on arrival
    // We'll use a URL parameter to trigger focus
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="participant-name"]'
      );
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Empty state with premium design
  if (participants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smoothNormal}
      >
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-card to-muted/5 p-8">
          <EmptyState
            icon={<Users className="h-16 w-16 text-muted-foreground/40" />}
            title={t('assignment.noParticipants')}
            description={t('assignment.noParticipantsDesc')}
            action={
              <Button
                size="lg"
                onClick={handleAddParticipants}
                className="mt-4"
                aria-label={t('assignment.addParticipants')}
              >
                <Users className="mr-2 h-4 w-4" />
                {t('assignment.addParticipants')}
              </Button>
            }
          />
        </Card>
      </motion.div>
    );
  }

  // Premium participant palette with sticky mobile behavior
  return (
    <Card className="participant-palette sticky top-0 z-40 border-primary/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 p-4 shadow-md lg:static lg:z-0 lg:shadow-sm">
      {/* Header with contextual help and celebration animation */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground mb-1">
              {t('assignment.paletteTitle')}
            </p>
            {/* Celebration badge when all selected */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={buttonTactile.hover.transition}
                >
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    All Selected!
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('assignment.selectParticipants')}
          </p>
        </div>
        
        {/* Contextual help tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                aria-label="Help"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-xs"
              sideOffset={8}
            >
              <p className="text-sm">{t('assignment.paletteTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Horizontal scrollable participant list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {participants.map((participant, index) => {
            const isSelected = selectedParticipants.includes(participant.id);
            const isRecentlySelected = recentlySelected.includes(participant.id);
            
            return (
              <motion.button
                key={participant.id}
                custom={index}
                variants={itemVariants(index)}
                initial="hidden"
                animate="visible"
                layoutId={`palette-avatar-${participant.id}`}
                whileHover={prefersReducedMotion ? {} : { 
                  scale: 1.05,
                  transition: buttonTactile.hover.transition
                }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
                onClick={() => toggleParticipant(participant.id)}
                className={`
                  relative flex flex-col items-center gap-2 rounded-xl p-4 min-w-[80px]
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/50'
                  }
                `}
                style={{
                  // Use box-shadow for selection ring (no layout shift)
                  boxShadow: isSelected
                    ? '0 0 0 2px hsl(var(--primary))'
                    : '0 0 0 0px transparent',
                  // Premium gradient for recently selected
                  background: isRecentlySelected
                    ? 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))'
                    : undefined,
                }}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${participant.name}`}
                aria-pressed={isSelected}
              >
                {/* Avatar with bouncy animation on selection */}
                <motion.div
                  animate={
                    isSelected
                      ? {
                          scale: [1, 1.15, 1],
                          transition: { ...smoothNormal, duration: 0.3 },
                        }
                      : { scale: 1 }
                  }
                >
                  <ParticipantAvatar
                    name={participant.name}
                    color={participant.color}
                    size="md"
                  />
                </motion.div>

                {/* Name label */}
                <span
                  className={`
                    text-xs font-medium text-center line-clamp-1 max-w-[72px]
                    ${isSelected ? 'text-primary' : 'text-foreground'}
                  `}
                >
                  {participant.name}
                </span>

                {/* Premium shimmer effect for recently selected */}
                <AnimatePresence>
                  {isRecentlySelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 0.6s ease-out',
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Selection indicator badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { ...smoothNormal, duration: 0.2 },
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Position indicator badge for better UX (shows index + 1) */}
                {!isSelected && participants.length > 3 && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-muted text-[10px] font-medium flex items-center justify-center text-muted-foreground">
                    {index + 1}
                  </div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Selected count indicator */}
      <AnimatePresence>
        {selectedParticipants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="mt-3 pt-3 border-t border-border/50 origin-top overflow-hidden"
          >
            <p className="text-xs text-center text-muted-foreground">
              {t('assignment.selectedCount', {
                count: selectedParticipants.length,
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
