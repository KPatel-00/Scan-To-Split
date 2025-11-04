import { motion } from 'framer-motion';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ParticipantAvatar } from '../../../../components/ParticipantAvatar';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGroupManagement } from '../hooks/useGroupManagement';
import { feedback } from '../../../../lib/feedback';
import { smoothSlow } from '@/lib/motion/physics';

interface GroupManagementProps {
  hasParticipants: boolean;
}

export function GroupManagement({ hasParticipants }: GroupManagementProps) {
  const { t } = useTranslation();
  const {
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
  } = useGroupManagement();

  if (!hasParticipants) {
    return null;
  }

  return (
    <>
      {/* Group Management Buttons */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smoothSlow}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={openSaveDialog}
          className="flex-1"
        >
          <Save className="mr-2 h-4 w-4" />
          {t('setup.participants.saveGroup')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openLoadDialog}
          className="flex-1"
          disabled={savedGroups.length === 0}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          {t('setup.participants.loadGroup')}
        </Button>
      </motion.div>

      {/* Save Group Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={closeSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('setup.participants.saveGroupTitle')}</DialogTitle>
            <DialogDescription>{t('setup.participants.saveGroupDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">{t('setup.participants.saveGroup')}</Label>
              <Input
                id="group-name"
                placeholder={t('setup.participants.saveGroupPlaceholder')}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveGroup();
                    feedback.click();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeSaveDialog}>
              {t('setup.participants.cancel')}
            </Button>
            <Button onClick={handleSaveGroup} disabled={!groupName.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {t('setup.participants.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Group Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={closeLoadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('setup.participants.loadGroupTitle')}</DialogTitle>
            <DialogDescription>{t('setup.participants.loadGroupDesc')}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {savedGroups.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-semibold text-sm mb-1">
                  {t('setup.participants.noSavedGroups')}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t('setup.participants.noSavedGroupsDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={smoothSlow}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{group.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {group.participants.length}{' '}
                        {group.participants.length === 1
                          ? t('setup.verification.items')
                          : t('setup.verification.items')}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {group.participants.slice(0, 5).map((p) => (
                          <ParticipantAvatar
                            key={p.id}
                            name={p.name}
                            color={p.color}
                            size="sm"
                          />
                        ))}
                        {group.participants.length > 5 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            +{group.participants.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          feedback.click();
                          handleLoadGroup(group.id);
                        }}
                      >
                        {t('setup.participants.load')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          feedback.click();
                          handleDeleteGroup(group.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeLoadDialog}>
              {t('buttons.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
