import { useState, useEffect } from 'react';
import { useStore } from '../../../../store/useStore';
import { useToast } from '../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../../../lib/feedback';

export function useHabitRecognition() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);

  const participants = useStore((state) => state.participants);
  const recordGroupUsage = useStore((state) => state.recordGroupUsage);
  const getSuggestedGroupName = useStore((state) => state.getSuggestedGroupName);
  const saveGroup = useStore((state) => state.saveGroup);

  // Record group usage when participants change (3+)
  useEffect(() => {
    if (participants.length >= 3) {
      recordGroupUsage();
    }
  }, [participants, recordGroupUsage]);

  // Check for habit recognition suggestion
  const habitSuggestion = getSuggestedGroupName();
  const showSuggestion =
    habitSuggestion?.shouldSuggest && !dismissed && participants.length >= 3;

  const handleAccept = () => {
    feedback.success();
    saveGroup('The Usuals');
    setDismissed(true);

    toast({
      title: t('setup.participants.groupSaved', { name: 'The Usuals' }),
    });
  };

  const handleDismiss = () => {
    feedback.click();
    setDismissed(true);
  };

  return {
    showSuggestion,
    suggestionCount: habitSuggestion?.count || 3,
    handleAccept,
    handleDismiss,
  };
}
