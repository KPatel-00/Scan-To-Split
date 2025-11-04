/**
 * Summary Page translations
 * Includes celebration, settlement, participant breakdowns, and actions
 */
export const summary = {
  title: 'Summary',
  
  celebration: {
    title: 'All Done! 🎉',
    subtitle: 'Here\'s how the split looks',
    complete: 'Complete',
  },
  
  grandTotal: 'Grand Total',
  subtotal: 'Subtotal',
  tax: 'Tax',
  tip: 'Tip',
  
  settlement: {
    title: 'Final Settlement',
    subtitle: 'Who owes whom',
    everyoneEven: 'Everyone\'s even! 🎉',
    everyoneEvenDesc: 'No money needs to be transferred.',
    pays: '{{from}} pays {{to}}',
    costBreakdown: 'Cost Breakdown',
    costBreakdownSubtitle: 'Total cost per person',
  },
  
  ofTotal: 'of total',
  
  pennyProblem: {
    label: 'About Rounding',
    tooltip: 'Ever wonder what happens to the \'leftover penny\'? We rounded the last indivisible cent to ensure the sum perfectly matches the bill. No one gets stuck with the odd cent!',
  },
  
  actions: {
    backToAssign: 'Back to Assign',
    downloadPDF: 'Download PDF',
    share: 'Share Summary',
    startNewBill: 'Start New Bill',
    generating: 'Generating...',
    sharing: 'Sharing...',
    newBillDialogTitle: 'Start a fresh bill?',
    newBillDialogDescription: 'This will clear your current bill and summary. Are you sure you want to continue?',
    cancel: 'Cancel',
    confirm: 'Start Fresh',
  },
  
  participantCards: {
    title: 'Individual Breakdowns',
    subtitle: 'Click to view',
    itemCount_one: '{{count}} item',
    itemCount_other: '{{count}} items',
    itemsFrom: 'Items from {{source}}',
    yourItems: 'Your items',
    totalCost: 'Total cost',
    status: 'Status',
  },
  
  // Final Summary - restructured for proper namespace
  finalSummary: {
    title: 'Summary',
    grandTotal: 'Grand Total',
    settlementTitle: 'Final Settlement',
    everyoneEven: 'Everyone\'s even!',
    owes: 'Owes',
    owed: 'Owed',
    even: 'Even',
    items: '{{count}} items',
    from: 'From',
  },
};
