import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ParticipantsList } from './participants';
import { smoothSlow } from '@/lib/motion/physics';

export function ParticipantsSection() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...smoothSlow,
        delay: 0.35,
      }}
    >
      <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('setup.participants.title', 'Participants')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ParticipantsList />
        </CardContent>
      </Card>
    </motion.div>
  );
}
