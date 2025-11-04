import { useState, useRef } from 'react';
import { useStore } from '../../../../store/useStore';
import { useToast } from '../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../../../lib/feedback';
import { validateParticipantName } from '../utils/participantValidation';

export function useParticipantForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const addParticipant = useStore((state) => state.addParticipant);

  const handleAdd = () => {
    const validated = validateParticipantName(name);
    if (!validated) return;

    feedback.success();
    addParticipant(validated);
    setName('');

    toast({
      title: t('messages.participantAdded', { name: validated }),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
      feedback.click();
    }
  };

  return {
    name,
    setName,
    inputRef,
    handleAdd,
    handleKeyDown,
  };
}
