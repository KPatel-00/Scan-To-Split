/**
 * Premium Item Card Component
 * 
 * Enhanced version of ItemRow with premium design language:
 * - Glass morphism background (bg-card/50 backdrop-blur-sm)
 * - Tactile hover feedback (scale 1.02) via safeTactile
 * - Smooth animations for all interactions
 * - Premium typography using typography.ts scales
 * - Reduced motion support
 * 
 * Supports all item types:
 * - Regular items (merchandise, groceries)
 * - Special lines (discounts, deposits, tax, tips, fees)
 * - Negative price highlighting (discounts, refunds)
 */

import { useStore, type Item } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useItemActions } from '@/components/item-row/hooks/useItemActions';
import { getIconComponent, isNegativePrice as checkNegativePrice } from '@/components/item-row/utils/iconHelpers';
import { CategoryBadge } from '@/components/item-row/components/CategoryBadge';
import { ItemInfo } from '@/components/item-row/components/ItemInfo';
import { ItemActions } from '@/components/item-row/components/ItemActions';
import { DeleteConfirmDialog } from '@/components/item-row/components/DeleteConfirmDialog';

interface PremiumItemCardProps {
  item: Item;
  receiptId?: string;
  showOriginBadge?: boolean;
}

export function PremiumItemCard({ item, receiptId, showOriginBadge = false }: PremiumItemCardProps) {
  const currency = useStore((state) => state.currency);
  
  const {
    isEditing,
    editedName,
    editedQuantity,
    editedPrice,
    showDeleteDialog,
    setEditedName,
    setEditedQuantity,
    setEditedPrice,
    setShowDeleteDialog,
    handleEditToggle,
    handleCategoryUpdate,
    handleCategoryRemove,
    handleDelete,
    handleCancelEdit,
  } = useItemActions(item, receiptId);

  const IconComponent = getIconComponent(item.category?.icon);
  const isNegativePrice = checkNegativePrice(item.price);

  return (
    <>
      <div
        className={cn(
          // Premium glass morphism base
          "group flex items-center gap-4 rounded-xl border p-4",
          "bg-card/50 backdrop-blur-sm shadow-sm",
          "transition-all duration-200",
          
          // Hover state - subtle border/shadow only (no lift)
          "hover:shadow-md hover:border-border/60",
          
          // Negative price variant (discounts, refunds)
          isNegativePrice && "bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/50",
          isNegativePrice && "hover:bg-red-50/70 hover:shadow-red-200/50",
          
          // Editing state
          isEditing && "ring-2 ring-primary/20 border-primary/40"
        )}
      >
        <CategoryBadge
          category={item.category}
          itemName={item.name}
          IconComponent={IconComponent}
          onSave={handleCategoryUpdate}
          onRemove={handleCategoryRemove}
          showOriginBadge={showOriginBadge}
          originReceiptId={item.originReceiptId}
        />

        <ItemInfo
          name={item.name}
          quantity={item.quantity}
          price={item.price}
          currency={currency}
          isNegativePrice={isNegativePrice}
          isEditing={isEditing}
          editedName={editedName}
          editedQuantity={editedQuantity}
          editedPrice={editedPrice}
          onNameChange={setEditedName}
          onQuantityChange={setEditedQuantity}
          onPriceChange={setEditedPrice}
        />

        <ItemActions
          isEditing={isEditing}
          itemName={item.name}
          onEditToggle={handleEditToggle}
          onCancelEdit={handleCancelEdit}
          onDelete={() => setShowDeleteDialog(true)}
        />
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        itemName={item.name}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
}
