/**
 * Assignment Page translations
 * Includes assignment palette, item actions, and custom split features
 */
export const assignment = {
  title: 'Assign Items',
  description: 'Click on participant avatars to assign items. You can assign an item to multiple people or split it custom.',
  
  // Search
  searchPlaceholder: 'Search items...',
  
  // Empty States
  noItems: 'No items to assign yet!',
  noItemsDescription: 'Add items in the previous step.',
  addItems: 'Add Items',
  noParticipants: 'Add friends to the bill to start assigning!',
  noParticipantsDescription: 'Go back to the previous step to add participants.',
  addParticipants: 'Add Participants',
  noReceipts: 'No receipts found!',
  noReceiptsDescription: 'Scan receipts in the previous step.',
  scanReceipts: 'Scan Receipts',
  noSearchResults: 'No items match your search',
  noSearchResultsDescription: 'Try a different search term for "{{query}}"',
  noItemsInReceipt: 'No items in this receipt',
  noItemsInReceiptDescription: 'This receipt appears to be empty.',
  noParticipantsForItem: 'Add participants to start assigning',
  
  // Item Actions
  assignAll: 'Assign to All',
  clearAssignments: 'Clear All Assignments',
  editItem: 'Edit Item',
  deleteItem: 'Delete Item',
  items_one: 'item',
  items_other: 'items',
  
  // Custom Split Popover
  customSplit: {
    title: 'Split "{{itemName}}"',
    total: 'Total',
    modeLabel: 'Split Mode',
    byAmount: 'By Amount',
    byPercentage: 'By Percentage (%)',
    byShares: 'By Shares (x)',
    liveTotal: 'Live Total',
    errorMessage: 'Total must equal {{expected}}',
  },
  
  // Participant Palette (moved from nested assignment object to root)
  paletteTitle: 'Participant Palette',
  paletteTooltip: 'Select one or more people, then click the icons in an item row.',
  selectParticipants: 'Select one or more people, then click the icons in an item row.',
  selectedCount_one: '{{count}} person selected',
  selectedCount_other: '{{count}} people selected',
  noParticipantsDesc: 'Go back to the previous step to add participants.',
  noItemsDesc: 'Add items in the previous step to start assigning.',
  customSplitTooltip: 'Split this item three ways: by exact amount, by percentage, or by shares (e.g., 2 slices for Alice, 1 for Bob). Perfect for unequal splits!',
  byAmount: 'By Amount',
  byPercentage: 'By Percent',
  byShares: 'By Shares',
  
  // Bill Info Card
  billInfo: {
    storeName: 'Store',
    unknownStore: 'Unknown Store',
    calculatedTotal: 'Total',
    itemCount_one: '{{count}} item',
    itemCount_other: '{{count}} items',
  },
};