import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';
import { ChapterBadge } from '../../../components/ChapterBadge';
import type { Person } from './Step2People';

/**
 * Step 3: Assign items to people
 * Duration: 6 seconds (8-14s)
 * Shows items being assigned to people with animated connection lines
 */

export interface ReceiptItem {
  id: number;
  name: string;
  price: number;
  assignedTo: number[]; // Array of person IDs - supports multiple people per item
}

interface Step3AssignProps {
  items: ReceiptItem[];
  people: Person[];
}

export function Step3Assign({ items, people }: Step3AssignProps) {
  return (
    <motion.div
      className="absolute inset-0 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-full flex items-center justify-between gap-6">
        {/* Left: Receipt items */}
        <div className="flex-1">
          <ChapterBadge 
            icon={Zap} 
            text="Assigning Items..." 
            variant="primary" 
            size="sm" 
            className="mb-6" 
          />
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border",
                  item.price < 0 
                    ? "bg-green-500/5 border-green-500/20" 
                    : "bg-primary/5 border-primary/20"
                )}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.3 }}
              >
                <div className={cn(typography.label.md, 'flex-1 truncate')}>{item.name}</div>
                <div className="flex items-center gap-2">
                  {item.assignedTo.length > 1 && (
                    <span className={cn(typography.label.xs, 'text-muted-foreground')}>
                      ÷{item.assignedTo.length}
                    </span>
                  )}
                  <div className={cn(
                    typography.label.md,
                    "font-bold",
                    item.price < 0 && "text-green-600"
                  )}>
                    {item.price < 0 ? '-' : ''}€{Math.abs(item.price).toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: People avatars */}
        <div className="flex flex-col gap-4 justify-center">
          {people.map((person, index) => (
            <motion.div
              key={person.id}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.15 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md border-2 border-background"
                style={{ backgroundColor: person.color }}
              >
                {person.initial}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection lines SVG overlay */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {items.flatMap((item, itemIndex) => {
          const itemY = 140 + itemIndex * 56; // Approximate item positions
          
          // Draw a line from this item to EACH assigned person
          return item.assignedTo.map((personId, assignmentIndex) => {
            const person = people[personId];
            const personY = 200 + personId * 72; // Approximate avatar positions

            return (
              <motion.path
                key={`line-${item.id}-${personId}`}
                d={`M 200 ${itemY} Q 280 ${(itemY + personY) / 2}, 360 ${personY}`}
                stroke={person.color}
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{
                  delay: 0.5 + itemIndex * 0.3 + assignmentIndex * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            );
          });
        })}
      </svg>
    </motion.div>
  );
}
