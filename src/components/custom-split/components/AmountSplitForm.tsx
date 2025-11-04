import { motion } from 'framer-motion';
import { Input } from '../../ui/input';
import { ParticipantAvatar } from '../../ParticipantAvatar';
import type { Participant } from '../../../store/types';
import { smoothNormal } from '@/lib/motion/physics';

interface AmountSplitFormProps {
  participants: Participant[];
  values: Record<string, string>;
  modeSymbol: string;
  step: string;
  onValueChange: (participantId: string, value: string) => void;
}

export function AmountSplitForm({
  participants,
  values,
  modeSymbol,
  step,
  onValueChange,
}: AmountSplitFormProps) {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {participants.map((participant, index) => (
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            ...smoothNormal,
            delay: index * 0.05,
          }}
          className="flex items-center justify-between gap-4"
        >
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ParticipantAvatar
              name={participant.name}
              color={participant.color}
              size="sm"
            />
            <span className="text-sm font-medium truncate">{participant.name}</span>
          </div>

          {/* Right: Input with Leading Symbol */}
          <div className="relative w-32 shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none z-10">
              {modeSymbol}
            </span>
            <Input
              type="number"
              step={step}
              min="0"
              value={values[participant.id] || ''}
              onChange={(e) => onValueChange(participant.id, e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
