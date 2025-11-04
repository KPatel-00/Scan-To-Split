import { useState } from 'react';
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
import { ParticipantAvatar } from '../../../../components/ParticipantAvatar';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../hooks/useToast';
import { ToastAction } from '../../../../components/ui/toast';
import { useStore } from '../../../../store/useStore';
import { feedback } from '../../../../lib/feedback';
import type { Participant } from '../../../../store/types';
import { smoothSlow } from '@/lib/motion/physics';

interface ParticipantCardProps {
  participant: Participant;
  index: number;
  staggerDelay: number;
}

export function ParticipantCard({ participant, index, staggerDelay }: ParticipantCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const removeParticipant = useStore((state) => state.removeParticipant);
  const pushUndoAction = useStore((state) => state.pushUndoAction);
  const undoLastAction = useStore((state) => state.undoLastAction);

  const handleRemoveClick = () => {
    setRemoveDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    // Execute immediately (frictionless)
    feedback.select();
    removeParticipant(participant.id);

    // Push to undo stack
    pushUndoAction({
      type: 'deleteParticipant',
      data: participant,
      timestamp: Date.now(),
    });

    // Show toast with undo action
    const { dismiss } = toast({
      title: t('messages.participantDeleted', { name: participant.name }),
      description: t('messages.undoAvailable'),
      duration: 5000,
      action: (
        <ToastAction
          altText={t('buttons.undo')}
          onClick={() => {
            undoLastAction();
            feedback.success();
            dismiss();
          }}
        >
          {t('buttons.undo')}
        </ToastAction>
      ),
    });

    setRemoveDialogOpen(false);
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-between rounded-lg border p-4 bg-card hover:bg-muted/50 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
        transition={{
          ...smoothSlow,
          delay: index * staggerDelay,
        }}
        layout
      >
        <div className="flex items-center gap-4">
          <ParticipantAvatar
            name={participant.name}
            color={participant.color}
            size="md"
          />
          <span className="font-medium">{participant.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            feedback.click();
            handleRemoveClick();
          }}
          aria-label={t('ariaLabels.removeParticipant', {
            name: participant.name,
          })}
        >
          <X className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Remove Participant Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('setup.participants.removeConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('setup.participants.removeConfirmDesc', { name: participant.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                feedback.click();
                setRemoveDialogOpen(false);
              }}
            >
              {t('setup.participants.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm}>
              <X className="mr-2 h-4 w-4" />
              {t('buttons.remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
