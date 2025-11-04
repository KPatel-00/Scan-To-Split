/**
 * Undo Hook - Non-Negotiable Undo Flow for In-Place Edits
 * ✨ PROMPT 9: Enhanced with Toast-based undo functionality
 * 
 * Features:
 * - Stores old item state before applying changes
 * - Shows Toast with Undo button immediately after edit
 * - onUndo callback reverts changes by calling editItem with old state
 * - Delete operations use Dialog confirmation instead of undo
 */

import { useRef } from 'react';
import { useToast } from './useToast';
import { useStore, type Item } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';

export function useUndo() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const editItem = useStore((state) => state.editItem);
  const deleteItem = useStore((state) => state.deleteItem);
  
  // Store old item state for undo
  const oldItemStateRef = useRef<{ item: Item; receiptId?: string } | null>(null);

  /**
   * ✨ PROMPT 9: Undo flow for item edits
   * 1. Store old state
   * 2. Apply changes via editItem
   * 3. Show Toast with Undo button
   * 4. Undo reverts to old state
   */
  const handleEditItem = (
    itemId: string,
    oldItem: Item,
    updatedFields: Partial<Item>,
    receiptId?: string
  ) => {
    // Step 1: Store old state for undo
    oldItemStateRef.current = { item: oldItem, receiptId };

    // Step 2: Apply changes to store
    editItem(itemId, updatedFields, receiptId);

    // Step 3: Show Toast with Undo button
    const fieldNames = Object.keys(updatedFields).join(', ');
    toast({
      title: t('setup.itemsList.undo.itemUpdated', { name: oldItem.name }),
      description: `Changed: ${fieldNames}`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Step 4: Revert to old state
            if (oldItemStateRef.current) {
              const { item, receiptId: rid } = oldItemStateRef.current;
              // Revert by applying the old item fields back
              const revertFields: Partial<Item> = {};
              Object.keys(updatedFields).forEach((key) => {
                revertFields[key as keyof Item] = item[key as keyof Item] as any;
              });
              editItem(itemId, revertFields, rid);
            }
          }}
        >
          {t('buttons.undo')}
        </Button>
      ),
    });
  };

  /**
   * ✨ PROMPT 9: Undo flow for manual item add
   */
  const handleAddItem = (addedItem: Item, receiptId?: string) => {
    toast({
      title: t('setup.itemsList.undo.itemAdded', { name: addedItem.name }),
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Undo: Delete the item we just added
            deleteItem(addedItem.id, receiptId);
          }}
        >
          {t('buttons.undo')}
        </Button>
      ),
    });
  };

  /**
   * Delete doesn't use undo - uses Dialog confirmation instead
   * (As per blueprint override)
   */
  const handleDeleteItem = (item: Item, _receiptId?: string) => {
    // This is called AFTER confirmation dialog
    // No undo needed - confirmation is the safety mechanism
    toast({
      title: t('setup.itemsList.undo.itemDeleted', { name: item.name }),
      variant: 'destructive',
    });
  };

  return {
    handleEditItem,
    handleAddItem,
    handleDeleteItem,
  };
}
