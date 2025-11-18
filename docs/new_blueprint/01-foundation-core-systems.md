# Part 1: Foundation & Core Systems

**Last Updated**: November 18, 2025  
**Status**: ✅ Fully Implemented  
**Estimated Reading Time**: 45 minutes

---

## 1.1 Technology Stack

### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.2"
}
```

### State Management
```json
{
  "zustand": "^4.5.2"
}
```

### Routing & Navigation
```json
{
  "react-router-dom": "^6.26.1"
}
```

### UI & Styling
```json
{
  "@radix-ui/*": "Various (shadcn/ui primitives)",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.5.4",
  "lucide-react": "^0.344.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.51.0",
  "dompurify": "^3.0.9",
  "@types/dompurify": "^3.0.5"
}
```

### Internationalization
```json
{
  "react-i18next": "^14.0.5",
  "i18next": "^23.10.0"
}
```

### Build Configuration

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'pdf-export': ['jspdf'],
          'image-export': ['html2canvas', 'html-to-image'],
          'ai-scanning': ['@google/generative-ai'],
        },
      },
    },
  },
});
```

---

## 1.2 Project Structure

```
src/
├── components/          # Global reusable components
│   ├── ui/             # shadcn/ui primitives (30+ components)
│   ├── AddItemDialog.tsx
│   ├── AppFooter.tsx
│   ├── AppHeader.tsx
│   ├── EmptyState.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingStates.tsx
│   ├── PageTransition.tsx
│   ├── ParticipantAvatar.tsx
│   ├── ProgressStepper.tsx
│   └── ThemeToggle.tsx
├── features/           # Feature modules
│   ├── assignment/
│   │   └── components/
│   ├── landing-page/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── USPSection.tsx
│   ├── setup/
│   │   ├── components/
│   │   │   ├── PremiumItemCard.tsx
│   │   │   ├── PremiumSectionHeader.tsx
│   │   │   └── ScanAnimation.tsx
│   │   ├── hooks/
│   │   │   ├── useFileUpload.ts
│   │   │   └── useScanAnimation.ts
│   │   ├── DataHub.tsx
│   │   ├── ItemsList.tsx
│   │   └── ScanPortal.tsx
│   └── summary/
│       ├── ActionButtonsSection.tsx
│       ├── ParticipantSummarySection.tsx
│       └── ShareableImageCard.tsx
├── hooks/              # Global custom hooks
│   ├── useHydration.ts
│   ├── useMediaQuery.ts
│   ├── useReducedMotion.ts
│   └── useToast.ts
├── lib/                # Utilities & configurations
│   ├── motion/         # Animation presets (43 exports)
│   │   ├── index.ts
│   │   ├── physics.ts
│   │   ├── tactile.ts
│   │   └── variants.ts
│   ├── taxonomy/       # Category system (8 files)
│   │   ├── categories.ts
│   │   ├── grocerySubcategories.ts
│   │   ├── specialLines.ts
│   │   ├── helpers.ts
│   │   └── migration.ts
│   ├── constants/
│   │   └── app.ts
│   ├── feedback.ts
│   ├── sanitize.ts
│   └── typography.ts
├── pages/              # Route pages
│   ├── Landing.tsx
│   ├── Setup.tsx
│   ├── Assignment.tsx
│   └── Summary.tsx
├── store/              # Zustand state management
│   ├── slices/         # 9 domain slices
│   │   ├── itemsSlice.ts
│   │   ├── participantsSlice.ts
│   │   ├── receiptsSlice.ts
│   │   ├── uiSlice.ts
│   │   ├── groupsSlice.ts
│   │   ├── undoSlice.ts
│   │   ├── modalsSlice.ts
│   │   ├── settingsSlice.ts
│   │   └── scanningSlice.ts
│   ├── selectors/      # Computed values
│   ├── types.ts
│   ├── useStore.ts     # Combined store
│   └── README.md
├── App.tsx             # Root component with routes
├── main.tsx            # Entry point
├── providers.tsx       # Global providers
└── index.css           # Global styles + Tailwind
```

**File Organization Rules**:
1. Used 3+ features → `src/components/`
2. Used 1 feature → `src/features/[name]/components/`
3. Pure utilities → `src/lib/`
4. State logic → `src/store/slices/`

---

## 1.3 Design System

### Color Palette (CSS Variables)

**File**: `src/index.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
}
```

### Typography System

**File**: `src/lib/typography.ts` (40+ variants)

```typescript
export const typography = {
  display: {
    '2xl': 'text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight',
    xl: 'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight',
    lg: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
    md: 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight',
    sm: 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight',
    xs: 'text-lg sm:text-xl md:text-2xl font-bold tracking-tight',
  },
  heading: {
    h1: 'text-3xl sm:text-4xl font-bold tracking-tight',
    h2: 'text-2xl sm:text-3xl font-bold tracking-tight',
    h3: 'text-xl sm:text-2xl font-semibold tracking-tight',
    h4: 'text-lg sm:text-xl font-semibold',
    h5: 'text-base sm:text-lg font-semibold',
    h6: 'text-sm sm:text-base font-semibold',
  },
  body: {
    xl: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    md: 'text-sm sm:text-base leading-normal',
    sm: 'text-xs sm:text-sm leading-normal',
    xs: 'text-xs leading-normal',
  },
};
```

**Usage**:
```tsx
import { typography } from '@/lib/typography';

<h1 className={typography.display.xl}>Hero Headline</h1>
<p className={typography.body.lg}>Description text</p>
```

### Spacing System

**4px Grid**: All margins, paddings, and gaps use Tailwind's default scale (multiples of 4px):
- `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-12` = 48px

### Border Radius

- **Major cards**: `rounded-xl` (12px)
- **Buttons/inputs**: `rounded-lg` (8px)
- **Avatars**: `rounded-full`

---

## 1.4 Motion System

### Physics Configurations

**File**: `src/lib/motion/physics.ts`

```typescript
export const springPhysics = {
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const springTransition = {
  type: 'spring' as const,
  ...springPhysics,
};

export const smoothSlow = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 25,
};

export const smoothNormal = {
  type: 'spring' as const,
  stiffness: 250,
  damping: 30,
};

export const quickTap = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
};
```

### Tactile Feedback

**File**: `src/lib/motion/tactile.ts`

```typescript
export const buttonTactile = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: quickTap,
};

export const cardTactile = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
  transition: smoothNormal,
};

// Accessibility wrapper
export function safeTactile(
  preset: typeof buttonTactile,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return {};
  }
  return preset;
}
```

**Usage**:
```tsx
import { buttonTactile, safeTactile } from '@/lib/motion/tactile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prefersReducedMotion = useReducedMotion();

<motion.button {...safeTactile(buttonTactile, prefersReducedMotion)}>
  Click me
</motion.button>
```

### Animation Variants

**File**: `src/lib/motion/variants.ts`

```typescript
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSlow,
  },
};

export const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothNormal,
  },
};
```

### Complete Motion Library

**File**: `src/lib/motion/index.ts` (43 named exports)

All animations imported from single source:
```typescript
export * from './physics';
export * from './tactile';
export * from './variants';
export { layoutTransition } from './layout';
```

---

## 1.5 State Management (Zustand)

### Architecture Overview

**9 Domain Slices**:
1. **itemsSlice** - Bill items (merged mode)
2. **participantsSlice** - Participant list
3. **receiptsSlice** - Multiple bills (separate mode)
4. **uiSlice** - Theme, language, currency, mode
5. **groupsSlice** - Saved participant groups
6. **undoSlice** - Undo/redo functionality
7. **modalsSlice** - Modal state management
8. **settingsSlice** - User preferences
9. **scanningSlice** - AI scan state

### Combined Store

**File**: `src/store/useStore.ts` (302 lines)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreState = ItemsSlice &
  ParticipantsSlice &
  ReceiptsSlice &
  UISlice &
  GroupsSlice &
  UndoSlice &
  ModalsSlice &
  SettingsSlice &
  ScanningSlice;

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
      
      clearSession: () => set({
        items: [],
        participants: [],
        receipts: [],
        managementMode: 'merged',
        lastActivePage: '/',
      }),
    }),
    {
      name: 'splitter-storage',
    }
  )
);
```

### Fine-Grained Selector Pattern

**✅ CORRECT** - Only re-renders when specific state changes:
```tsx
const items = useStore((state) => state.items);
const addItem = useStore((state) => state.addItem);
```

**❌ WRONG** - Re-renders on ANY store change:
```tsx
const store = useStore();
const items = store.items;
```

### Dual-Mode System

```typescript
interface UISlice {
  managementMode: 'merged' | 'separate';
  // ...
}
```

**Merged Mode** (Single bill):
- Uses `state.items[]`
- Uses `state.mergedPaidBy`
- Uses `state.mergedTax`, `state.mergedTip`

**Separate Mode** (Multiple bills):
- Uses `state.receipts[]` array
- Each receipt has own `paidBy`, `tax`, `tip`

### Hydration Pattern

**File**: `src/hooks/useHydration.ts`

```typescript
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
```

**Usage**:
```tsx
import { useHydration } from '@/hooks/useHydration';
import { RouteLoadingScreen } from '@/components/LoadingStates';

function MyPage() {
  const isHydrated = useHydration();
  if (!isHydrated) return <RouteLoadingScreen />;
  
  // ✅ Safe - localStorage loaded
  const items = useStore((state) => state.items);
}
```

**Why needed?**
- Zustand persist loads localStorage **asynchronously**
- Without check, components show empty state briefly
- Creates flicker: empty → populated
- `RouteLoadingScreen` shows smooth progress bar (~50ms)

---

**[Continue in next response - sections 1.6-1.9]**

## 1.6 Security Architecture

### XSS Prevention with DOMPurify

**File**: `src/lib/sanitize.ts`

```typescript
import DOMPurify from 'dompurify';

export function sanitizeInput(value: string): string {
  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  return sanitized.trim();
}
```

**Applied in ALL user input points**:

1. **Participants** (`src/store/slices/participantsSlice.ts`):
```typescript
addParticipant: (name) => {
  const sanitizedName = sanitizeInput(name);
  // ...
}
```

2. **Items** (`src/store/slices/itemsSlice.ts`):
```typescript
addItem: (item) => {
  const sanitizedItem = {
    ...item,
    name: sanitizeInput(item.name),
  };
  // ...
}
```

3. **AI Scan Results** (before Zustand storage)
4. **All text inputs** (form submissions)

**Rule**: NO `dangerouslySetInnerHTML` allowed anywhere

---

## 1.7 Performance Architecture

### Bundle Splitting Strategy

**Production Build Results** (Nov 2025):

```
Main bundle:        587 kB (190 kB gzipped)
Landing chunk:      353 kB (89 kB gzipped)
Setup chunk:        190 kB (57 kB gzipped)
Assignment chunk:    54 kB (18 kB gzipped)
Summary chunk:       48 kB (14 kB gzipped)
```

**Lazy-Loaded Dependencies**:
```
PDF export:         359 kB (lazy)
AI scanning:         28 kB (lazy)
Image export:       215 kB (lazy)
```

### Route-Based Code Splitting

**File**: `src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { LoadingScreen } from './components/LoadingStates';

const Landing = lazy(() => import('./pages/Landing'));
const Setup = lazy(() => import('./pages/Setup'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Summary = lazy(() => import('./pages/Summary'));

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
            {/* ... */}
          </Routes>
        </Suspense>
      </Providers>
    </ErrorBoundary>
  );
}
```

### Lazy-Loaded Utilities

**PDF Export**:
```typescript
const exportPDF = async () => {
  const { generatePDF } = await import('./lib/pdf/exportPDF');
  await generatePDF(data);
};
```

**AI Scanning**:
```typescript
const scanReceipts = async (files) => {
  const { scanReceiptsClient } = await import('./lib/scanReceiptsClient');
  return await scanReceiptsClient(files);
};
```

---

## 1.8 Internationalization (i18n)

### Setup

**File**: `src/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: require('./locales/en/common.json') },
    de: { translation: require('./locales/de/common.json') },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
```

### Translation Files

**Structure**:
```
src/locales/
+-- en/
�   +-- common.json
+-- de/
    +-- common.json
```

**Example Keys**:
```json
{
  "setup": {
    "itemsList": {
      "searchPlaceholder": "Search items...",
      "collapseItems": "Collapse items",
      "expandItems": "Expand items"
    }
  },
  "buttons": {
    "addParticipant": "Add Participant",
    "continue": "Continue"
  }
}
```

### Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <button>{t('buttons.addParticipant')}</button>
  );
}
```

---

## 1.9 Global Constants

**File**: `src/lib/constants/app.ts` (74 lines)

```typescript
export const APP_NAME = 'ScanToSplit.ai';
export const APP_TAGLINE = 'AI-powered bill splitting made simple';
export const APP_DESCRIPTION = 'Split bills instantly with smart receipt scanning';
export const APP_VERSION = '1.0.0';
export const APP_WEBSITE = 'https://scantosplit.ai';

export const FEATURE_FLAGS = {
  enableAnalytics: true,
  enableGroups: true,
  enableMultiBill: true,
};

export const LIMITS = {
  maxFiles: 3,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxParticipants: 20,
  maxItemsPerBill: 100,
};

export const UI_DEFAULTS = {
  currency: { symbol: '�', code: 'EUR' },
  theme: 'system',
  language: 'en',
};

// Helper functions
export function getAppTitle(subtitle?: string) {
  return subtitle ? `${subtitle} | ${APP_NAME}` : APP_NAME;
}

export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS) {
  return FEATURE_FLAGS[feature];
}
```

**Usage**:
```tsx
import { APP_NAME, APP_TAGLINE } from '@/lib/constants/app';

<h1>{APP_NAME}</h1>
<p>{APP_TAGLINE}</p>
```

---

## Summary: Foundation Checklist

? **Tech Stack**: React 18.3, TypeScript 5.5, Vite 5.4, Zustand 4.5  
? **Project Structure**: Feature-based organization  
? **Design System**: CSS variables, 40+ typography variants  
? **Motion System**: 43 named presets, accessibility support  
? **State Management**: 9 Zustand slices, fine-grained selectors  
? **Security**: DOMPurify sanitization on all inputs  
? **Performance**: Bundle splitting, lazy loading, route splitting  
? **i18n**: English/German support with react-i18next  
? **Constants**: Centralized app configuration

---

**Next**: Part 2 - Landing Page & App Shell

