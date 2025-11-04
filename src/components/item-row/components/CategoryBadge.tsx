import { Badge } from '../../ui/badge';
import { IconButton } from '../../ui/icon-button';
import { CategoryEditorPopover } from '../../CategoryEditorPopover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../../store/types';
import { getCategoryName } from '../../../lib/taxonomy/migration';
import { getDefaultCategory } from '../../../lib/taxonomy';
import { getCategoryIconComponent, getCategoryDisplayName, getCategoryColor } from '../../../lib/taxonomy/helpers';

interface CategoryBadgeProps {
  category?: Category;
  itemName: string;
  IconComponent: React.ComponentType<any>;
  onSave: (category: Category) => void;
  onRemove: () => void;
  showOriginBadge?: boolean;
  originReceiptId?: string;
}

export function CategoryBadge({
  category,
  itemName,
  IconComponent,
  onSave,
  onRemove,
  showOriginBadge,
  originReceiptId,
}: CategoryBadgeProps) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'de') as 'en' | 'de';

  // Detect special line categories
  const isSpecialLine = category?.isSpecialLine || false;
  const SpecialIcon = category ? getCategoryIconComponent(category.icon) : null;
  const categoryName = category ? getCategoryDisplayName(category, locale) : '';
  const colorClass = category ? getCategoryColor(category) : 'text-primary';

  return (
    <>
      {/* Origin Badge */}
      {showOriginBadge && originReceiptId && (
        <Badge variant="outline" className="shrink-0 text-xs">
          {t('setup.itemsList.item.origin', { number: originReceiptId.slice(-1) })}
        </Badge>
      )}

      {/* Special Line Badge (TAX, DEPO, DISC, etc.) */}
      {isSpecialLine && category && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className={`shrink-0 gap-1.5 ${colorClass}`}
              >
                {SpecialIcon && <SpecialIcon className="h-3 w-3" />}
                <span className="text-xs font-semibold uppercase">
                  {category.id}
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{categoryName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Regular Category Icon & Editor (only for non-special lines) */}
      {!isSpecialLine && category && getCategoryName(category) ? (
        <TooltipProvider>
          <Tooltip>
            <CategoryEditorPopover
              category={category}
              onSave={onSave}
              onRemove={onRemove}
            >
              <TooltipTrigger asChild>
                <IconButton
                  className="h-8 w-8 rounded-full shrink-0"
                  aria-label={t('ariaLabels.editCategory', { name: itemName })}
                >
                  <IconComponent className="h-4 w-4" />
                </IconButton>
              </TooltipTrigger>
            </CategoryEditorPopover>
            <TooltipContent>
              <p className="text-xs">{categoryName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : !isSpecialLine ? (
        <CategoryEditorPopover
          category={getDefaultCategory()}
          onSave={onSave}
          onRemove={onRemove}
        >
          <IconButton className="h-8 w-8 rounded-full shrink-0 opacity-40 hover:opacity-100" aria-label="Add category">
            <LucideIcons.Tag className="h-4 w-4" />
          </IconButton>
        </CategoryEditorPopover>
      ) : null}
    </>
  );
}
