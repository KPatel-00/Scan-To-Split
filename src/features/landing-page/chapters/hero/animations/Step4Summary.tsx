import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { typography } from '@/lib/typography';
import { ChapterBadge } from '../../../components/ChapterBadge';
import { smoothSlow } from '@/lib/motion/physics';
import type { Person } from './Step2People';

/**
 * Step 4: Summary with payment cards
 * Duration: 4 seconds (14-18s)
 * Shows final split amounts for each person
 */

export interface PersonWithTotal extends Person {
  total: number;
}

interface Step4SummaryProps {
  people: PersonWithTotal[];
  static?: boolean;
}

export function Step4Summary({ people, static: isStatic = false }: Step4SummaryProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-8"
      initial={isStatic ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={isStatic ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChapterBadge 
            icon={CheckCircle2} 
            text="Split Complete!" 
            variant="solid" 
            size="lg" 
            className="shadow-lg" 
          />
        </motion.div>

        {/* Payment cards grid */}
        <div className="grid grid-cols-2 gap-5">
          {people.map((person, index) => (
            <motion.div
              key={person.id}
              className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 shadow-lg"
              initial={isStatic ? false : { scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                ...smoothSlow,
                delay: isStatic ? 0 : 0.2 + index * 0.15,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md"
                  style={{ backgroundColor: person.color }}
                >
                  {person.initial}
                </div>
                <span className={typography.label.md}>{person.name}</span>
              </div>
              <div className={typography.number.lg}>
                €{person.total.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

