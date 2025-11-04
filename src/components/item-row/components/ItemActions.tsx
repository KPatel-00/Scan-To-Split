import { Check, X, Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '../../ui/icon-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { useTranslation } from 'react-i18next';

interface ItemActionsProps {
  isEditing: boolean;
  itemName: string;
  onEditToggle: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export function ItemActions({
  isEditing,
  itemName,
  onEditToggle,
  onCancelEdit,
  onDelete,
}: ItemActionsProps) {
  const { t } = useTranslation();

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <IconButton
          className="h-8 w-8"
          onClick={onEditToggle}
          aria-label={t('buttons.save')}
        >
          <Check className="h-4 w-4 text-green-600" />
        </IconButton>
        <IconButton
          className="h-8 w-8"
          onClick={onCancelEdit}
          aria-label={t('buttons.cancel')}
        >
          <X className="h-4 w-4 text-red-600" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              className="h-8 w-8"
              onClick={onEditToggle}
              aria-label={t('ariaLabels.editItem', { name: itemName })}
            >
              <Pencil className="h-4 w-4" />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{t('setup.itemsList.item.edit')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
              aria-label={t('ariaLabels.deleteItem', { name: itemName })}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{t('setup.itemsList.item.delete')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
