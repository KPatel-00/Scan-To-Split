/**
 * ParticipantsSection - Premium participant management container
 * 
 * Design upgrades:
 * - Glass morphism background (bg-card/50 backdrop-blur-sm)
 * - Premium section header with icon and count
 * - fadeInUp animation matching DataHub premium design
 * - Smooth hover states and shadow transitions
 */

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../components/ui/card';
import { ParticipantsList } from './participants';
import { fadeInUp } from '@/lib/motion';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { useStore } from '@/store/useStore';

export function ParticipantsSection() {
  const { t } = useTranslation();
  const participants = useStore((state) => state.participants);

  return (
    <motion.div variants={fadeInUp}>
      <Card className="overflow-hidden border border-border/40 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md">
        {/* Premium Header */}
        <div className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-transparent p-6 pb-4">
          <PremiumSectionHeader
            icon={Users}
            title={t('setup.participants.title', 'Participants')}
            count={participants.length}
          />
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <ParticipantsList />
        </CardContent>
      </Card>
    </motion.div>
  );
}
