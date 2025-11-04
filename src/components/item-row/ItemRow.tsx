import { useStore, type Item } from '../../store/useStore';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useItemActions } from './hooks/useItemActions';
import { getIconComponent, isNegativePrice as checkNegativePrice } from './utils/iconHelpers';
import { CategoryBadge } from './components/CategoryBadge';
import { ItemInfo } from './components/ItemInfo';
import { ItemActions } from './components/ItemActions';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';

interface ItemRowProps {
  item: Item;
  receiptId?: string;
  showOriginBadge?: boolean;
}

export function ItemRow({ item, receiptId, showOriginBadge = false }: ItemRowProps) {
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg border transition-colors",
          isNegativePrice && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
          !isNegativePrice && "bg-card hover:bg-accent/50"
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
      </motion.div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        itemName={item.name}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
}
