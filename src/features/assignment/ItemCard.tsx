import { motion } from 'framer-motion';
import { Check, Pencil, Trash, X, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { ParticipantAvatar } from '../../components/ParticipantAvatar';
import { CustomSplitPopover } from '../../components/custom-split';
import { useStore } from '../../store/useStore';
import { feedback } from '../../lib/feedback';
import type { Item, Participant } from '../../store/useStore';
import { smoothSlow } from '@/lib/motion/physics';

interface ItemCardProps {
  item: Item;
  participants: Participant[];
  selectedParticipants: string[];
  receiptId?: string;
  showOriginBadge?: boolean;
  originLabel?: string;
}

export default function ItemCard({
  item,
  participants,
  selectedParticipants,
  receiptId,
  showOriginBadge = false,
  originLabel,
}: ItemCardProps) {
  const { t } = useTranslation();
  const { currency } = useStore();
  const assignItemToParticipant = useStore((state) => state.assignItemToParticipant);
  const unassignItemFromParticipant = useStore((state) => state.unassignItemFromParticipant);
  const clearItemAssignments = useStore((state) => state.clearItemAssignments);
  const assignItemToAll = useStore((state) => state.assignItemToAll);
  const deleteItem = useStore((state) => state.deleteItem);
  const pushUndoAction = useStore((state) => state.pushUndoAction);

  const isNegative = item.price < 0;
  const assignedTo = item.assignedTo || [];
  const hasAssignments = assignedTo.length > 0;
  const isFullyAssigned = assignedTo.length === participants.length;

  // Get category icon component
  const getCategoryIcon = () => {
    if (!item.category?.icon) return Package;
    
    // Convert kebab-case to PascalCase (e.g., "shopping-bag" -> "ShoppingBag")
    const iconName = item.category.icon
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    // Safely get icon from LucideIcons, fallback to Package
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Package;
  };
  
  const CategoryIcon = getCategoryIcon();

  const handleToggleParticipant = (participantId: string) => {
    const isAssigned = assignedTo.includes(participantId);
    
    if (isAssigned) {
      unassignItemFromParticipant(item.id, participantId, receiptId);
      feedback.toggle();
    } else {
      assignItemToParticipant(item.id, participantId, receiptId);
      feedback.toggle();
    }
  };

  const handleAssignAll = () => {
    assignItemToAll(item.id, receiptId);
    feedback.success();
  };

  const handleClearAssignments = () => {
    clearItemAssignments(item.id, receiptId);
    feedback.click();
  };

  const handleDelete = () => {
    // Save undo action
    const itemSnapshot = { ...item };
    pushUndoAction({
      type: 'deleteItem',
      data: itemSnapshot,
      timestamp: Date.now(),
      receiptId,
    });
    
    deleteItem(item.id, receiptId);
    feedback.click();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={smoothSlow}
    >
      <Card
        className={`p-4 transition-all ${
          isNegative
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
            : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Top Row: Item Info */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Left: Category Icon + Details */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Category Icon Badge */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-primary" />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base truncate">
                    {item.name}
                  </h3>
                  {showOriginBadge && originLabel && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {originLabel}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {item.quantity}x
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isNegative
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-primary'
                    }`}
                  >
                    {currency.symbol}
                    {Math.abs(item.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <TooltipProvider delayDuration={300}>
                {/* Assign All Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        isFullyAssigned
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                      onClick={handleAssignAll}
                      disabled={participants.length === 0}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('assignment.assignAll')}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Clear Assignments Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={handleClearAssignments}
                      disabled={!hasAssignments}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('assignment.clearAssignments')}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Custom Split Popover */}
                <CustomSplitPopover
                  item={item}
                  assignedParticipants={participants.filter((p) =>
                    assignedTo.includes(p.id)
                  )}
                  receiptId={receiptId}
                />

                {/* Edit Button (Placeholder for future) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('assignment.editItem')}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('assignment.deleteItem')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Bottom Row: Participant Toggles */}
          {participants.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
              {participants.map((participant, index) => {
                const isAssigned = assignedTo.includes(participant.id);
                const isSelected = selectedParticipants.includes(participant.id);
                
                return (
                  <motion.button
                    key={participant.id}
                    onClick={() => handleToggleParticipant(participant.id)}
                    className={`relative shrink-0 rounded-full transition-all ${
                      isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                    style={{
                      boxShadow: isAssigned
                        ? `0 0 0 2px ${participant.color}`
                        : 'none',
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isSelected ? 1 : 0.5, scale: 1 }}
                    transition={{
                      ...smoothSlow,
                      delay: index * 0.05,
                    }}
                  >
                    <ParticipantAvatar
                      name={participant.name}
                      color={participant.color}
                      size="sm"
                    />
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Empty State: No Participants */}
          {participants.length === 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                {t('assignment.noParticipantsForItem')}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
