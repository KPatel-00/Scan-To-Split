import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export type TourPage = 'setup' | 'assignment' | 'summary';

// Setup Tour (Bill Input)
export const setupTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: [
      {
        popover: {
          title: 'Step 1: Add Your Bill 📝',
          description: 'Let\'s learn how to add your receipt and participants. This will only take a minute!',
        },
      },
      {
        element: '#receipt-upload',
        popover: {
          title: 'Scan Receipts',
          description: 'Upload up to 3 receipt images. Our AI will automatically extract items, prices, and totals!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.participants-section',
        popover: {
          title: 'Add Participants',
          description: 'Add everyone who\'s splitting the bill. Each person gets a unique color!',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '.items-list-section',
        popover: {
          title: 'Review Items',
          description: 'Check the scanned items. You can edit, delete, or add more items manually.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '.bill-modifiers-section',
        popover: {
          title: 'Add Tax & Tip',
          description: 'Include tax and tip if not already in item prices. They\'ll be split proportionally!',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '.verification-card',
        popover: {
          title: 'Verify Total',
          description: 'Make sure the calculated total matches your receipt. All good? Hit Next!',
          side: 'top',
          align: 'center',
        },
      },
    ],
    onDestroyStarted: () => {
      if (typeof window !== 'undefined') {
  localStorage.setItem('tour-setup-completed', 'true');
      }
      driverObj.destroy();
    },
  });

  return driverObj;
};

// Assignment Tour
export const assignmentTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: [
      {
        popover: {
          title: 'Step 2: Assign Items 🎯',
          description: 'Now let\'s assign items to people. You can split items equally or use custom amounts!',
        },
      },
      {
        element: '.participant-palette',
        popover: {
          title: 'Select Participants',
          description: 'Click on avatars to select who you\'re assigning items to. You can select multiple people!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.assignment-items-list',
        popover: {
          title: 'Toggle Assignments',
          description: 'Click the checkmark to assign an item to selected participants. Simple!',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '.custom-split-button',
        popover: {
          title: 'Custom Splits',
          description: 'Need granular control? Use the Split button to divide items by exact amount, percentage, or shares.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '.quick-actions',
        popover: {
          title: 'Quick Actions',
          description: 'Assign all items to everyone, clear assignments, or split items individually.',
          side: 'bottom',
          align: 'end',
        },
      },
    ],
    onDestroyStarted: () => {
      if (typeof window !== 'undefined') {
  localStorage.setItem('tour-assignment-completed', 'true');
      }
      driverObj.destroy();
    },
  });

  return driverObj;
};

// Summary Tour
export const summaryTour = () => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: [
      {
        popover: {
          title: 'Step 3: Summary & Export 🎊',
          description: 'You\'re done! Let\'s see who owes what and how to share the results.',
        },
      },
      {
        element: '.grand-total-card',
        popover: {
          title: 'Grand Total',
          description: 'The complete bill total including all items, tax, and tip.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.participant-summaries',
        popover: {
          title: 'Individual Breakdowns',
          description: 'Each person\'s total with proportional tax and tip. Click to expand and see their items!',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '.export-buttons',
        popover: {
          title: 'Download & Share',
          description: 'Download a PDF settlement or share a beautiful image on social media!',
          side: 'top',
          align: 'end',
        },
      },
      {
        popover: {
          title: 'You\'re All Set! ✨',
          description: 'That\'s it! Start a new bill anytime. Happy splitting!',
        },
      },
    ],
    onDestroyStarted: () => {
      if (typeof window !== 'undefined') {
  localStorage.setItem('tour-summary-completed', 'true');
      }
      driverObj.destroy();
    },
  });

  return driverObj;
};

// Helper to check if tour has been completed
export const isTourCompleted = (page: TourPage): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(`tour-${page}-completed`) === 'true';
};

// Helper to reset all tours
export const resetAllTours = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('tour-setup-completed');
  localStorage.removeItem('tour-assignment-completed');
  localStorage.removeItem('tour-summary-completed');
};
