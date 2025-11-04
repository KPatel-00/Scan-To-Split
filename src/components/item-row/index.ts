// Main component
export { ItemRow } from './ItemRow';

// Sub-components (optional exports)
export { CategoryBadge } from './components/CategoryBadge';
export { ItemInfo } from './components/ItemInfo';
export { ItemActions } from './components/ItemActions';
export { DeleteConfirmDialog } from './components/DeleteConfirmDialog';

// Hooks (optional exports)
export { useItemActions } from './hooks/useItemActions';
export type { UseItemActionsReturn, ItemEditState } from './hooks/useItemActions';

// Utils (optional exports)
export { getIconComponent, isNegativePrice } from './utils/iconHelpers';
