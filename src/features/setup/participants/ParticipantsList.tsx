import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ParticipantInput } from './components/ParticipantInput';
import { ParticipantGrid } from './components/ParticipantGrid';
import { GroupManagement } from './components/GroupManagement';
import { HabitRecognition } from './components/HabitRecognition';
import { useStore } from '../../../store/useStore';
import { useTranslation } from 'react-i18next';

export function ParticipantsList() {
  const { t } = useTranslation();
  const participants = useStore((state) => state.participants);

  return (
    <Card className="participants-section">
      <CardHeader>
        <CardTitle>{t('setup.participants.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Participant Input */}
        <ParticipantInput />

        {/* Group Management Buttons */}
        <GroupManagement hasParticipants={participants.length > 0} />

        {/* Habit Recognition Suggestion */}
        <HabitRecognition />

        {/* Participants List */}
        <ParticipantGrid participants={participants} />
      </CardContent>
    </Card>
  );
}
