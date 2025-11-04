import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { typography } from '@/lib/typography';
import { ChapterBadge } from '../../../components/ChapterBadge';
import { smoothSlow } from '@/lib/motion/physics';

/**
 * Step 2: Add people avatars
 * Duration: 4 seconds (4-8s)
 * Shows 4 people being added with staggered animations
 */

export interface Person {
  id: number;
  name: string;
  initial: string;
  color: string;
}

interface Step2PeopleProps {
  people: Person[];
}

export function Step2People({ people }: Step2PeopleProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChapterBadge 
            icon={Users} 
            text="Add 4 People" 
            variant="primary" 
            size="md" 
            className="mb-4" 
          />
        </motion.div>

        {/* Avatar grid */}
        <div className="grid grid-cols-2 gap-8">
          {people.map((person, index) => (
            <motion.div
              key={person.id}
              className="flex flex-col items-center gap-3"
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                ...smoothSlow,
                delay: 0.3 + index * 0.25,
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-background"
                style={{ backgroundColor: person.color }}
              >
                {person.initial}
              </div>
              <span className={typography.label.lg}>{person.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

