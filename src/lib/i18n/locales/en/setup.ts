/**
 * Setup Page translations
 * Includes bill details, participants, items list, and bill modifiers
 */
export const setup = {
  title: 'Bill & People',
  subtitle: 'Add your bill details and invite friends to split',
  
  // Bill Details Section
  billDetails: {
    title: 'Bill Details',
    scanReceipt: 'Scan Receipt',
    enterManually: 'Enter Manually',
    dropzone: 'Drop up to 3 receipts here or click to upload',
    dropzoneHint: 'Images will be auto-compressed and scanned for sensitive data',
    privacyProtected: 'Privacy Protected',
    chooseFiles: 'Choose Files',
    tryDemo: 'Want to see an example?',
    tryDemoBold: 'Try our demo bill.',
    storeName: 'Store',
    date: 'Date',
    itemList: 'Item-Price List',
    itemListPlaceholder: 'Coffee 3.50\nSandwich 5.99\nOrange Juice 2.50',
    itemListHint: 'Format: Item name followed by price (one per line)',
    addItems: 'Add Items',
    manualDisabled: 'Manual entry is disabled in separate mode.',
    manualDisabledHint: 'Please add items directly to a specific bill below.',
    tooltip: 'Supported formats: JPG, PNG, HEIC. Max 3 receipts. File size auto-optimized.',
    pasteItems: 'Paste item-price list here',
  },
  
  // PII Redaction Modal
  piiModal: {
    title: 'We\'ve Got Your Back.',
    subtitle: 'Privacy Mode Active',
    description: 'We automatically detected and hid suspected sensitive info on your bill. We only send this "masked" version for scanning.',
    detailsCount: '{{count}} potentially sensitive items found in {{files}} receipt(s)',
    showOriginal: 'Show Original',
    hideOriginal: 'Hide Sensitive Info',
    itemsDetected: 'Items Detected',
    scanOriginal: 'Scan Original Anyway',
    notRecommended: 'Not Recommended',
    confirmMasked: 'Confirm & Scan Masked Image',
    learnMore: 'For 100% privacy, we recommend covering sensitive numbers before taking a photo. This is an automatic detection system and may not catch everything.',
  },
  
  // Participants Section
  participants: {
    title: 'Participants',
    addPrompt: 'Enter a name',
    add: 'Add',
    saveGroup: 'Save Group',
    loadGroup: 'Load Group',
    remove: 'Remove {{name}} from bill?',
    removeConfirmTitle: 'Remove Participant?',
    removeConfirmDesc: 'Are you sure you want to remove {{name}} from the bill? You can undo this for 5 seconds.',
    saveGroupTitle: 'Save This Group',
    saveGroupDesc: 'Give this group a name to quickly load it in the future.',
    saveGroupPlaceholder: 'e.g. "The Usuals", "Work Lunch Crew"',
    loadGroupTitle: 'Load Saved Group',
    loadGroupDesc: 'Choose a previously saved group to add all participants at once.',
    noSavedGroups: 'No saved groups yet',
    noSavedGroupsDesc: 'Save your first group to quickly reload participants in the future.',
    groupSaved: 'Group "{{name}}" saved!',
    groupLoaded: '{{count}} participants loaded from "{{name}}"',
    groupDeleted: 'Group "{{name}}" deleted',
    habitRecognitionTitle: 'Do you use this group often?',
    habitRecognitionDesc: 'We noticed you\'ve used this exact group {{count}} times. Want to save it for quick access?',
    habitRecognitionAction: 'Save as "The Usuals"',
    habitRecognitionDismiss: 'No thanks',
    deleteGroup: 'Delete Group',
    cancel: 'Cancel',
    save: 'Save',
    load: 'Load',
  },
  
  // Labels
  labels: {
    paidBy: 'Paid by',
    tax: 'Tax',
    tip: 'Tip',
    currency: 'Currency',
  },
  
  // Items List
  itemsList: {
    currency: 'Currency',
    searchPlaceholder: 'Search items...',
    searching: 'Searching for',
    noItems: 'Scan a receipt or add items manually.',
    noResults: 'No items found for "{{query}}"',
    
    billInfo: {
      paidBy: 'Paid by:',
      totalAmount: 'Total',
      totalItems: '{{count}} items',
      totalItems_one: '{{count}} item',
      storeName: 'Store',
      date: 'Date',
    },
    
    item: {
      origin: 'Bill {{number}}',
      category: 'Category',
      editCategory: 'Edit category',
      removeCategory: 'Remove category',
      quantity: 'Qty',
      edit: 'Edit item',
      delete: 'Delete item',
      
      deleteConfirm: {
        title: 'Delete this item?',
        description: 'Are you sure you want to permanently delete "{{name}}"? You can undo this for 5 seconds after deleting.',
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },
    
    categoryEditor: {
      title: 'Edit Category',
      nameLabel: 'Category Name',
      namePlaceholder: 'e.g. Drinks, Meals',
      iconLabel: 'Icon',
      iconPlaceholder: 'glass-water',
      presets: 'Quick Picks',
      remove: 'Remove Category',
      save: 'Save',
    },
    
    addItem: {
      title: 'Add Item Manually',
      name: 'Item Name',
      namePlaceholder: 'e.g. Coffee',
      quantity: 'Quantity',
      quantityPlaceholder: '1',
      price: 'Price',
      pricePlaceholder: '0.00',
      submit: 'Add Item',
      cancel: 'Cancel',
    },
    
    undo: {
      undoTimeLimit: 'Click undo within 5 seconds',
      itemDeleted: '"{{name}}" removed',
      itemAdded: '"{{name}}" added',
      nameUpdated: 'Name of "{{name}}" updated',
      quantityUpdated: 'Quantity of "{{name}}" updated',
      priceUpdated: 'Price of "{{name}}" updated',
      categoryUpdated: 'Category of "{{name}}" updated',
    },
    
    emptyStates: {
      noItems: {
        title: 'No Items Yet',
        description: 'Scan a receipt or add items manually.',
        action: 'Scan Receipt',
      },
      noResults: {
        title: 'No Results',
        description: 'No items match "{{query}}". Try a different search term.',
        action: 'Clear Search',
      },
    },
  },
  
  // Bill Modifiers
  billModifiers: {
    title: 'Bill Adjustments',
    tax: 'Tax',
    tip: 'Tip / Service',
    taxHint: 'Add tax if not included in item prices',
    tipHint: 'Add tip or service charge',
    taxTooltip: 'Tax will be split proportionally based on each person\'s share of the subtotal. For example, if someone ordered 30% of the items, they pay 30% of the tax.',
    tipTooltip: 'Tip will be split proportionally based on each person\'s share of the subtotal. This way everyone pays their fair share of the service charge.',
    subtotal: 'Subtotal',
    total: 'Total with adjustments',
  },
  
  // Verification
  verification: {
    title: 'Bill Verification',
    grandTotalTitle: 'Grand Total Verification',
    tooltip: 'Check if the AI-scanned total matches the calculated sum of all items.',
    grandTotalTooltip: 'Check if the combined total of all bills matches the calculated grand total.',
    totalFromBill: 'Total from receipt',
    totalFromAllBills: 'Total from all receipts',
    calculatedTotal: 'Calculated total',
    calculatedGrandTotal: 'Calculated grand total',
    difference: 'Difference',
    perfect: '✓ Perfect!',
    checkItems: 'Check items',
    checkAllBills: 'Check all bills',
    fromAI: 'From AI scan',
    fromReceipts: 'From {{count}} receipts',
    itemsCount: '{{count}} items',
    itemsCount_one: '{{count}} item',
    billsCount: '{{count}} bills',
    billsCount_one: '{{count}} bill',
    acrossAllBills: 'Across all bills',
    perBillBreakdown: 'Per-bill breakdown',
    items: 'items',
  },
  
  // Multi-Bill Management
  multiBill: {
    modal: {
      title: 'How do you want to manage multiple bills?',
      description: 'Choose based on your needs.',
      detected: '{{count}} receipts detected',
      merged: {
        title: 'Merged',
        description: 'Combine all bills. Perfect for group meals where everyone shares everything.',
        badge: 'Recommended',
        tooltip: 'All receipts will be combined into a single list. Items from all bills will be merged, making it easier to split costs when everyone shares.',
        feature1: 'Single combined item list',
        feature2: 'One grand total for the whole group',
        feature3: 'Simpler splitting workflow',
      },
      separate: {
        title: 'Separate',
        description: 'Track each bill independently. Best when different people paid different receipts.',
        tooltip: 'Each receipt will be tracked separately with its own payer, tax, and tip. Perfect for tracking who paid which bill at different stores or times.',
        feature1: 'Individual bill tracking',
        feature2: 'Per-bill payer, tax, and tip',
        feature3: 'Detailed breakdown by receipt',
        confirmed: '{{count}} bills will be managed separately',
      },
      comparison: {
        title: 'Quick Comparison',
        workflow: 'Workflow',
        tracking: 'Tracking',
        bestFor: 'Best For',
        simpler: 'Simpler',
        detailed: 'Detailed',
        combined: 'Combined total',
        perBill: 'Per-bill breakdown',
        sameGroup: 'Same Group Shares',
        different: 'Different Payers/Times',
      },
    },
    accordion: {
      title: 'Your Bills',
    },
  },
};
