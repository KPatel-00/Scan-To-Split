/**
 * Item Actions Hook - Manages item editing, category updates, and deletion
 * ✨ PROMPT 9: Enhanced with proper undo flow for all edits
 */

import { useState, useCallback } from 'react';
import { useStore, type Item } from '../../../store/useStore';
import { useUndo } from '../../../hooks/useUndo';
import { feedback } from '../../../lib/feedback';
import type { Category } from '../../../store/types';
import { getDefaultCategory } from '../../../lib/taxonomy';

export interface ItemEditState {
  isEditing: boolean;
  editedName: string;
  editedQuantity: string;
  editedPrice: string;
}

export interface UseItemActionsReturn {
  // State
  isEditing: boolean;
  editedName: string;
  editedQuantity: string;
  editedPrice: string;
  showDeleteDialog: boolean;
  
  // State Setters
  setEditedName: (name: string) => void;
  setEditedQuantity: (quantity: string) => void;
  setEditedPrice: (price: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
  
  // Handlers
  handleEditToggle: () => void;
  handleCategoryUpdate: (category: Category) => void;
  handleCategoryRemove: () => void;
  handleDelete: () => void;
  handleCancelEdit: () => void;
}

export function useItemActions(item: Item, receiptId?: string): UseItemActionsReturn {
  const deleteItem = useStore((state) => state.deleteItem);
  const { handleDeleteItem, handleEditItem } = useUndo();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedQuantity, setEditedQuantity] = useState((item.quantity ?? 1).toString());
  const [editedPrice, setEditedPrice] = useState((item.price ?? 0).toString());

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // ✨ PROMPT 9: Save changes with undo flow
      const updates: Partial<Item> = {};
      let hasChanges = false;

      if (editedName.trim() !== item.name) {
        updates.name = editedName.trim();
        hasChanges = true;
      }

      const newQuantity = parseInt(editedQuantity) || 1;
      if (newQuantity !== item.quantity) {
        updates.quantity = newQuantity;
        hasChanges = true;
      }

      const newPrice = parseFloat(editedPrice) || 0;
      if (newPrice !== item.price) {
        updates.price = newPrice;
        hasChanges = true;
      }

      if (hasChanges) {
        // Call undo hook with old item state, updated fields, and receiptId
        handleEditItem(item.id, item, updates, receiptId);
        feedback.success();
      }
    } else {
      // Enter edit mode
      setEditedName(item.name);
      setEditedQuantity(item.quantity.toString());
      setEditedPrice(item.price.toString());
      feedback.click();
    }
    setIsEditing(!isEditing);
  }, [isEditing, editedName, editedQuantity, editedPrice, item, receiptId, handleEditItem]);

  const handleCategoryUpdate = useCallback((category: Category) => {
    // ✨ PROMPT 9: Category update with undo flow
    handleEditItem(item.id, item, { category }, receiptId);
    feedback.success();
  }, [item, receiptId, handleEditItem]);

  const handleCategoryRemove = useCallback(() => {
    handleEditItem(item.id, item, { category: getDefaultCategory() }, receiptId);
    feedback.click();
  }, [item, receiptId, handleEditItem]);

  const handleDelete = useCallback(() => {
    // ✨ PROMPT 9: Delete uses Dialog confirmation (no undo)
    deleteItem(item.id, receiptId);
    handleDeleteItem(item, receiptId);
    feedback.error();
    setShowDeleteDialog(false);
  }, [item, receiptId, deleteItem, handleDeleteItem]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    feedback.click();
  }, []);

  return {
    // State
    isEditing,
    editedName,
    editedQuantity,
    editedPrice,
    showDeleteDialog,
    
    // State Setters
    setEditedName,
    setEditedQuantity,
    setEditedPrice,
    setShowDeleteDialog,
    
    // Handlers
    handleEditToggle,
    handleCategoryUpdate,
    handleCategoryRemove,
    handleDelete,
    handleCancelEdit,
  };
}
