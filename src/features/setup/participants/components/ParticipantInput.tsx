import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParticipantForm } from '../hooks/useParticipantForm';

export function ParticipantInput() {
  const { t } = useTranslation();
  const { name, setName, inputRef, handleAdd, handleKeyDown } = useParticipantForm();

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        name="participant-name"
        placeholder={t('setup.participants.addPrompt')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={handleAdd} size="default">
        <Plus className="mr-2 h-4 w-4" />
        {t('setup.participants.add')}
      </Button>
    </div>
  );
}
