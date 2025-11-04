import { useState } from 'react';
import { useStore } from '../../../../store/useStore';
import { useToast } from '../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';
import { feedback } from '../../../../lib/feedback';
import { validateGroupName } from '../utils/participantValidation';

export function useGroupManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');

  const savedGroups = useStore((state) => state.savedGroups);
  const saveGroup = useStore((state) => state.saveGroup);
  const loadGroup = useStore((state) => state.loadGroup);
  const deleteGroup = useStore((state) => state.deleteGroup);

  const handleSaveGroup = () => {
    const validated = validateGroupName(groupName);
    if (!validated) return;

    feedback.success();
    saveGroup(validated);

    toast({
      title: t('setup.participants.groupSaved', { name: validated }),
    });

    setSaveDialogOpen(false);
    setGroupName('');
  };

  const handleLoadGroup = (groupId: string) => {
    const group = savedGroups.find((g) => g.id === groupId);
    if (!group) return;

    feedback.success();
    loadGroup(groupId);

    toast({
      title: t('setup.participants.groupLoaded', {
        count: group.participants.length,
        name: group.name,
      }),
    });

    setLoadDialogOpen(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = savedGroups.find((g) => g.id === groupId);
    if (!group) return;

    feedback.select();
    deleteGroup(groupId);

    toast({
      title: t('setup.participants.groupDeleted', { name: group.name }),
    });
  };

  const openSaveDialog = () => {
    feedback.click();
    setSaveDialogOpen(true);
  };

  const openLoadDialog = () => {
    feedback.click();
    setLoadDialogOpen(true);
  };

  const closeSaveDialog = () => {
    feedback.click();
    setSaveDialogOpen(false);
    setGroupName('');
  };

  const closeLoadDialog = () => {
    feedback.click();
    setLoadDialogOpen(false);
  };

  return {
    saveDialogOpen,
    loadDialogOpen,
    groupName,
    setGroupName,
    savedGroups,
    handleSaveGroup,
    handleLoadGroup,
    handleDeleteGroup,
    openSaveDialog,
    openLoadDialog,
    closeSaveDialog,
    closeLoadDialog,
  };
}
