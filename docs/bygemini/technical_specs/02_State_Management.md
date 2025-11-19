# 02. State Management (Zustand)

ScanToSplit.ai uses **Zustand** for global state management. The store is modularized into "slices" and persisted to `localStorage`.

## 1. Store Structure
The store is a combination of multiple slices:

```typescript
type StoreState = ItemsSlice &
  ParticipantsSlice &
  ReceiptsSlice &
  UISlice &
  GroupsSlice &
  UndoSlice &
  ModalsSlice &
  SettingsSlice &
  ScanningSlice;
```

## 2. Key Slices

### Items Slice (`itemsSlice.ts`)
Manages the "Merged Mode" item list.
*   **State:** `items: Item[]`
*   **Actions:**
    *   `addItem(item)`: Adds a new item (sanitized).
    *   `editItem(id, updates)`: Updates an item.
    *   `deleteItem(id)`: Removes an item.
    *   `assignItemToParticipant(itemId, participantId)`: Toggles assignment.

### Receipts Slice (`receiptsSlice.ts`)
Manages the "Separate Mode" receipts.
*   **State:** `receipts: Receipt[]`
*   **Actions:**
    *   `addReceipt(receipt)`: Adds a full receipt object.
    *   `updateReceipt(id, updates)`: Updates store name, date, etc.
    *   `setReceiptPayer(receiptId, participantId)`: Sets who paid.

### UI Slice (`uiSlice.ts`)
Manages global UI state.
*   **State:**
    *   `managementMode`: `'merged' | 'separate'`
    *   `theme`: `'light' | 'dark' | 'system'`
    *   `language`: `'en' | 'de'`
    *   `activeStep`: Current step in the wizard.

## 3. Persistence & Hydration
*   **Middleware:** `persist` from `zustand/middleware`.
*   **Storage:** `localStorage`.
*   **Hydration:** We use a custom `useHydration()` hook to prevent SSR mismatches. Components check `if (!isHydrated) return <Loader />` before accessing state.

### Store Initialization Code
The store is created using the `persist` middleware to automatically save state to `localStorage`.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      // ...slice creators...
      ...createItemsSlice(set, get, api),
      ...createParticipantsSlice(set, get, api),
      // ...
    }),
    {
      name: 'splitter-storage', // unique name in localStorage
    }
  )
);
```

### Full Store Implementation (`src/store/useStore.ts`)
This is the "glue" file that combines all slices.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createItemsSlice, type ItemsSlice } from './slices/itemsSlice';
import { createParticipantsSlice, type ParticipantsSlice } from './slices/participantsSlice';
import { createReceiptsSlice, type ReceiptsSlice, receiptItemOperations } from './slices/receiptsSlice';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { createGroupsSlice, type GroupsSlice } from './slices/groupsSlice';
import { createUndoSlice, type UndoSlice } from './slices/undoSlice';
import { createModalsSlice, type ModalsSlice } from './slices/modalsSlice';
import { createSettingsSlice, type SettingsSlice } from './slices/settingsSlice';
import { createScanningSlice, type ScanningSlice } from './slices/scanningSlice';

// Combined store type
type StoreState = ItemsSlice &
  ParticipantsSlice &
  ReceiptsSlice &
  UISlice &
  GroupsSlice &
  UndoSlice &
  ModalsSlice &
  SettingsSlice &
  ScanningSlice & {
    clearSession: () => void;
    clearAll: () => void;
  };

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createItemsSlice(set, get, api),
      ...createParticipantsSlice(set, get, api),
      ...createReceiptsSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createGroupsSlice(set, get, api),
      ...createUndoSlice(set, get, api),
      ...createModalsSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createScanningSlice(set, get, api),

      // Override item actions to handle both merged and receipt modes
      addItem: (item, receiptId) => {
        const newItem = {
          ...item,
          id: `item-${Date.now()}-${Math.random()}`,
          assignedTo: [],
        };
        if (receiptId) {
          receiptItemOperations.addItemToReceipt(set)(item, receiptId);
        } else {
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },
      // ... other overrides (editItem, deleteItem) follow same pattern
      
      clearSession: () => {
        set((state) => ({
          items: [],
          participants: [],
          receipts: [],
          activeStep: 0,
        }));
      },
      
      clearAll: () => {
        localStorage.removeItem('splitter-storage');
        window.location.reload();
      }
    }),
    { name: 'splitter-storage' }
  )
);
```

## 4. Selectors (Performance)
**Critical Rule:** Always use fine-grained selectors to prevent re-renders.

```typescript
// ✅ Good
const items = useStore((state) => state.items);

// ❌ Bad (Re-renders on ANY store change)
const { items } = useStore();
```
