import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../../../../components/EmptyState';
import { ParticipantCard } from './ParticipantCard';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { layoutTransition } from '../../../../lib/motion';
import type { Participant } from '../../../../store/types';

interface ParticipantGridProps {
  participants: Participant[];
  staggerDelay?: number;
}

export function ParticipantGrid({ participants, staggerDelay = 0.05 }: ParticipantGridProps) {
  const { t } = useTranslation();

  if (participants.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-16 w-16" />}
        title={t('empty.noParticipants')}
        description={t('empty.noParticipantsDesc')}
      />
    );
  }

  return (
    <motion.div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            layout
            transition={layoutTransition}
          >
            <ParticipantCard
              participant={participant}
              index={index}
              staggerDelay={staggerDelay}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
