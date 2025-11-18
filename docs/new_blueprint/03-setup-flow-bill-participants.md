# Part 3: Setup Flow (Bill & Participants)

**Last Updated**: November 18, 2025  
**Status**: ✅ Fully Implemented  
**Estimated Reading Time**: 50 minutes

---

## 3.1 Setup Page Architecture

**File**: `src/pages/Setup.tsx` (Main wrapper)

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useHydration } from '@/hooks/useHydration';
import { RouteLoadingScreen } from '@/components/LoadingStates';
import { PageTransition } from '@/components/PageTransition';
import { ScanPortal } from '@/features/setup/ScanPortal';
import { DataHub } from '@/features/setup/DataHub';

export function Setup() {
  const isHydrated = useHydration();
  const navigate = useNavigate();
  
  // ✅ Hydration check prevents localStorage mismatch
  if (!isHydrated) return <RouteLoadingScreen />;
  
  const items = useStore((state) => state.items);
  const receipts = useStore((state) => state.receipts);
  const participants = useStore((state) => state.participants);
  const managementMode = useStore((state) => state.managementMode);
  
  const [showDataHub, setShowDataHub] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  const hasExistingData = items.length > 0 || receipts.length > 0 || participants.length > 0;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    // Scan files with AI (lazy-loaded module)
    // After scanning completes, setShowDataHub(true)
  };

  const handleContinueToAssignment = () => {
    navigate('/assignment');
  };

  return (
    <PageTransition>
      {!showDataHub ? (
        <ScanPortal
          onFileUpload={handleFileUpload}
          managementMode={managementMode}
          hasExistingData={hasExistingData}
          onContinueEditing={() => setShowDataHub(true)}
        />
      ) : (
        <DataHub
          managementMode={managementMode}
          items={items}
          receipts={receipts}
          participants={participants}
          itemSearchQuery={itemSearchQuery}
          onBackToUpload={() => setShowDataHub(false)}
        />
      )}
    </PageTransition>
  );
}
```

**State Machine**:
1. **ScanPortal** → User uploads receipt or enters data manually
2. **DataHub** → User reviews items, adds participants
3. **Assignment** → Navigate to `/assignment` page

---

## 3.2 ScanPortal Component (Receipt Upload Hero)

**File**: `src/features/setup/ScanPortal.tsx` (202 lines, down from 658 via Nov 4 refactor)

### Architecture (Post-Refactor)

**3 Extraction Phases** (Nov 4, 2025):
- **Phase 1**: UI components → `src/features/setup/components/`
- **Phase 2**: Business logic → `src/features/setup/hooks/`
- **Phase 3**: Animations → `@/lib/motion/fadeInUp` (global library)

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { typography } from '@/lib/typography';

// ✅ Extracted UI components (Phase 1)
import { FeatureHighlights } from './components/FeatureHighlights';
import { ReturningUserBanner } from './components/ReturningUserBanner';
import { AlternativeActions } from './components/AlternativeActions';
import { UploadDropzone } from './components/UploadDropzone';
import { FilePreviewList } from './components/FilePreviewList';
import { ManualEntryBox } from './components/ManualEntryBox';

// ✅ Extracted business logic hooks (Phase 2)
import { useFilePreview } from './hooks/useFilePreview';
import { useDemoData } from './hooks/useDemoData';

export function ScanPortal({ 
  onFileUpload, 
  managementMode,
  hasExistingData,
  onContinueEditing,
}: ScanPortalProps) {
  const { t } = useTranslation();
  
  // ✅ Hooks encapsulate file handling logic
  const {
    selectedFiles,
    filePreviews,
    isProcessing,
    handleFilesSelected,
    handleRemoveFile,
    handleStartScanning,
  } = useFilePreview();

  const { loadDemoData } = useDemoData();

  // UI state
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');
  const [manualText, setManualText] = useState('');

  // ✅ Combined state check (prevents feature icons disappearing on back navigation)
  const hasData = hasExistingData || items.length > 0 || participants.length > 0;

  return (
    <motion.div
      className="mx-auto max-w-4xl px-4 py-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Returning User Banner */}
      {hasExistingData && !isDemoData && (
        <ReturningUserBanner
          itemCount={items.length}
          participantCount={participants.length}
          receiptCount={receipts.length}
          managementMode={managementMode}
          onContinueEditing={onContinueEditing}
        />
      )}

      {/* Main Hero Section */}
      {!hasData && (
        <motion.div variants={fadeInUp} className="mb-12 text-center">
          <h1 className={typography.display.xl}>
            {t('setup.scanPortal.title', 'Split Your Bill')}
          </h1>
          <p className={typography.body.lgMuted}>
            {t('setup.scanPortal.subtitle', 'Scan receipt or enter items manually')}
          </p>
        </motion.div>
      )}

      {/* Upload Dropzone */}
      {inputMode === 'upload' && (
        <motion.div variants={fadeInUp}>
          <UploadDropzone
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
            disabled={filePreviews.length >= 3}
          />
        </motion.div>
      )}

      {/* File Previews */}
      {filePreviews.length > 0 && (
        <FilePreviewList
          filePreviews={filePreviews}
          onRemove={handleRemoveFile}
          onStartScanning={handleStartScanning}
          isProcessing={isProcessing}
        />
      )}

      {/* Manual Entry Alternative */}
      {inputMode === 'manual' && (
        <ManualEntryBox
          manualText={manualText}
          setManualText={setManualText}
          onParse={handleManualParse}
        />
      )}

      {/* Alternative Actions (Switch mode, Try Demo) */}
      <AlternativeActions
        inputMode={inputMode}
        onToggleMode={() => setInputMode(prev => prev === 'upload' ? 'manual' : 'upload')}
        onTryDemo={loadDemoData}
      />

      {/* Feature Highlights (Icons grid) */}
      {!hasData && <FeatureHighlights />}
    </motion.div>
  );
}
```

### Extracted Components (Phase 1)

**1. UploadDropzone** (`src/features/setup/components/UploadDropzone.tsx`)

```tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export function UploadDropzone({ onFilesSelected, isProcessing, disabled }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    maxFiles: 3,
    disabled: disabled || isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-[300px] cursor-pointer flex-col items-center justify-center",
        "rounded-xl border-2 border-dashed border-border bg-card/50 p-8 backdrop-blur-sm",
        "transition-all duration-200",
        isDragActive && "border-primary bg-primary/5",
        (disabled || isProcessing) && "cursor-not-allowed opacity-50",
        !disabled && !isProcessing && "hover:border-primary/60 hover:bg-card/70"
      )}
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      ) : (
        <Upload className="h-12 w-12 text-muted-foreground" />
      )}

      <p className={`${typography.body.lg} mt-4 text-center`}>
        {isDragActive
          ? 'Drop files here...'
          : 'Drag & drop receipts, or click to browse'}
      </p>

      <p className={`${typography.body.sm} text-muted-foreground mt-2`}>
        PNG, JPG, WebP up to 10MB (max 3 files)
      </p>
    </div>
  );
}
```

**2. ReturningUserBanner** (`src/features/setup/components/ReturningUserBanner.tsx`)

```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Receipt } from 'lucide-react';
import { fadeInUp } from '@/lib/motion';
import { typography } from '@/lib/typography';

interface ReturningUserBannerProps {
  itemCount: number;
  participantCount: number;
  receiptCount: number;
  managementMode: 'merged' | 'separate';
  onContinueEditing: () => void;
}

export function ReturningUserBanner({
  itemCount,
  participantCount,
  receiptCount,
  managementMode,
  onContinueEditing,
}: ReturningUserBannerProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className={typography.heading.h3}>
            Welcome back!
          </h3>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{itemCount} items</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{participantCount} people</span>
            </div>
            {managementMode === 'separate' && (
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span>{receiptCount} receipts</span>
              </div>
            )}
          </div>
        </div>

        <Button onClick={onContinueEditing}>
          Continue Editing
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
```

**3. FeatureHighlights** (`src/features/setup/components/FeatureHighlights.tsx`)

```tsx
import { motion } from 'framer-motion';
import { Zap, Shield, Globe } from 'lucide-react';
import { fadeInUp } from '@/lib/motion';
import { typography } from '@/lib/typography';

const features = [
  { icon: Zap, label: 'AI Powered' },
  { icon: Shield, label: 'Private & Secure' },
  { icon: Globe, label: 'Works Offline' },
];

export function FeatureHighlights() {
  return (
    <motion.div
      variants={fadeInUp}
      className="mt-12 flex justify-center gap-8"
    >
      {features.map((feature) => (
        <div key={feature.label} className="flex items-center gap-2 text-muted-foreground">
          <feature.icon className="h-5 w-5" />
          <span className={typography.body.sm}>{feature.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
```

### Business Logic Hooks (Phase 2)

**1. useFilePreview** (`src/features/setup/hooks/useFilePreview.ts`)

```tsx
import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { feedback } from '@/lib/feedback';

interface FilePreview {
  file: File;
  preview: string;
  id: string;
}

export function useFilePreview() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: File[]) => {
    feedback.click();
    
    const previews: FilePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveFile = (id: string) => {
    feedback.click();
    
    setFilePreviews((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleStartScanning = async () => {
    setIsProcessing(true);
    feedback.click();

    try {
      // ✅ Lazy-load AI scanning module (saves 28kb on initial load)
      const { scanReceiptsClient } = await import('@/lib/scanReceiptsClient');
      
      const results = await scanReceiptsClient(selectedFiles);
      
      // ✅ Sanitize ALL AI results before Zustand storage
      const sanitizedResults = results.map(item => ({
        ...item,
        name: sanitizeInput(item.name),
        storeName: item.storeName ? sanitizeInput(item.storeName) : undefined,
      }));

      // Store results in Zustand
      useStore.getState().addItems(sanitizedResults);
      
      feedback.success();
    } catch (error) {
      console.error('Scan failed:', error);
      feedback.error();
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    selectedFiles,
    filePreviews,
    isProcessing,
    fileInputRef,
    handleFilesSelected,
    handleRemoveFile,
    triggerFileInput,
    handleStartScanning,
  };
}
```

**2. useDemoData** (`src/features/setup/hooks/useDemoData.ts`)

```tsx
import { useStore } from '@/store/useStore';
import { feedback } from '@/lib/feedback';

export function useDemoData() {
  const setIsDemoData = useStore((state) => state.setIsDemoData);

  const loadDemoData = (onComplete?: () => void) => {
    feedback.click();

    const demoItems = [
      { id: '1', name: 'Organic Milk', price: 3.49, quantity: 2, category: { id: 'GROC.DAIRY' } },
      { id: '2', name: 'Sourdough Bread', price: 4.99, quantity: 1, category: { id: 'GROC.BAKERY' } },
      { id: '3', name: 'Avocados', price: 2.99, quantity: 3, category: { id: 'GROC.PRODUCE' } },
    ];

    const demoParticipants = [
      { id: '1', name: 'Alice', color: '#FF6B6B' },
      { id: '2', name: 'Bob', color: '#4ECDC4' },
    ];

    useStore.getState().addItems(demoItems);
    useStore.getState().addParticipants(demoParticipants);
    setIsDemoData(true);

    feedback.success();
    onComplete?.();
  };

  return { loadDemoData };
}
```

---

## 3.3 DataHub Component (Items & Participants)

**File**: `src/features/setup/DataHub.tsx` (163 lines)

### Responsive Layout Strategy

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemsManagementSection } from './ItemsManagementSection';
import { ParticipantsSection } from './ParticipantsSection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { staggerContainer, fadeInUp } from '@/lib/motion';

export function DataHub({ managementMode, items, receipts, participants }: DataHubProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeTab, setActiveTab] = useState('items');

  const itemsCount = managementMode === 'merged' 
    ? items.length 
    : receipts.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 py-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Section Header */}
      <motion.div variants={fadeInUp} className="mb-12 text-center">
        <h2 className={typography.display.md}>Your Bill Details</h2>
        <p className={typography.body.lgMuted}>Review items and add participants</p>
      </motion.div>

      {/* Mobile: Tabs Layout */}
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="items">
              Items ({itemsCount})
            </TabsTrigger>
            <TabsTrigger value="people">
              People ({participants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <ItemsManagementSection {...props} />
          </TabsContent>

          <TabsContent value="people">
            <ParticipantsSection />
          </TabsContent>
        </Tabs>
      ) : (
        /* Desktop: Side-by-Side with Sticky Participants */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Items Section (2/3 width) */}
          <motion.div className="md:col-span-2" variants={fadeInUp}>
            <ItemsManagementSection {...props} />
          </motion.div>

          {/* Participants Section (1/3 width, sticky) */}
          <motion.div className="md:col-span-1" variants={fadeInUp}>
            <div className="sticky top-24">
              <ParticipantsSection />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
```

**Why This Layout?**
- **Mobile (<768px)**: Tabs save vertical space, prevent scrolling fatigue
- **Desktop (≥768px)**: Side-by-side layout shows both sections at once
- **Sticky participants**: Stays visible when scrolling items (desktop only)

---

## 3.4 ItemsList Component (Premium Upgrade)

**File**: `src/features/setup/ItemsList.tsx` (521 lines)

### Collapsible Section Headers

```tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Tag, RecycleIcon, Coins, ChevronDown } from 'lucide-react';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { PremiumItemCard } from './components/PremiumItemCard';
import { staggerContainer } from '@/lib/motion';

export function ItemsList() {
  const items = useStore((state) => state.items);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Group items by type (regular, discounts, deposits, tax, tips, fees)
  const itemGroups = useMemo(() => {
    const regularItems = filteredItems.filter(item => 
      !item.category || !isSpecialLine(item.category.id)
    );
    const discountItems = filteredItems.filter(item => 
      item.category && isDiscountLine(item.category.id)
    );
    const depositItems = filteredItems.filter(item => 
      item.category && isPfandLine(item.category.id)
    );
    // ... more groups

    return { regular, discounts, deposits, tax, tips, fees };
  }, [filteredItems]);

  return (
    <div className="space-y-8">
      {/* Regular Items Section */}
      {itemGroups.regular.length > 0 && (
        <div>
          {/* Collapsible Header */}
          <button
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            className="w-full mb-6"
          >
            <div className="flex items-center justify-between">
              <PremiumSectionHeader
                icon={Package}
                title="Items"
                count={itemGroups.regular.length}
              />
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isItemsExpanded && "rotate-180"
                )}
              />
            </div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence initial={false}>
            {isItemsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {itemGroups.regular.map((item) => (
                  <motion.div key={item.id} layout>
                    <PremiumItemCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Discounts Section */}
      {itemGroups.discounts.length > 0 && (
        <div>
          <PremiumSectionHeader
            icon={Tag}
            title="Discounts"
            count={itemGroups.discounts.length}
            variant="success"
          />
          <div className="mt-4 space-y-3">
            {itemGroups.discounts.map((item) => (
              <PremiumItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Deposits Section (Pfand) */}
      {itemGroups.deposits.length > 0 && (
        <div>
          <PremiumSectionHeader
            icon={RecycleIcon}
            title="Deposits (Pfand)"
            count={itemGroups.deposits.length}
            variant="info"
          />
          <div className="mt-4 space-y-3">
            {itemGroups.deposits.map((item) => (
              <PremiumItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      {itemGroups.tips.length > 0 && (
        <div>
          <PremiumSectionHeader
            icon={Coins}
            title="Tips & Gratuity"
            count={itemGroups.tips.length}
            variant="warning"
          />
          <div className="mt-4 space-y-3">
            {itemGroups.tips.map((item) => (
              <PremiumItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Search & Filter

```tsx
// Search bar at top of ItemsList
<div className="mb-6 flex gap-4">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      placeholder="Search items..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />
  </div>
  <CurrencySelector />
</div>

// Filter logic
const filteredItems = useMemo(() => {
  if (!searchQuery.trim()) return items;
  const query = searchQuery.toLowerCase();
  return items.filter((item) =>
    item.name.toLowerCase().includes(query) ||
    getCategoryName(item.category, 'de')?.toLowerCase().includes(query)
  );
}, [items, searchQuery]);
```

---

## 3.5 PremiumItemCard Component

**File**: `src/features/setup/components/PremiumItemCard.tsx` (118 lines)

### Glass Morphism Design

```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cardTactile } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function PremiumItemCard({ item, receiptId }: PremiumItemCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isNegativePrice = item.price < 0;

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : cardTactile.hover}
      whileTap={prefersReducedMotion ? undefined : cardTactile.tap}
      className={cn(
        // Premium glass morphism base
        "group flex items-center gap-4 rounded-xl border p-4",
        "bg-card/50 backdrop-blur-sm shadow-sm",
        "transition-all duration-200",
        
        // Hover state - subtle border/shadow (NO lift)
        "hover:shadow-md hover:border-border/60",
        
        // Negative price variant (discounts, refunds)
        isNegativePrice && "bg-red-50/50 border-red-200",
        isNegativePrice && "dark:bg-red-950/10 dark:border-red-900/50",
        
        // Editing state
        isEditing && "ring-2 ring-primary/20 border-primary/40"
      )}
    >
      {/* Category Icon Badge */}
      <CategoryBadge
        category={item.category}
        itemName={item.name}
        IconComponent={IconComponent}
      />

      {/* Item Info (name, quantity × price) */}
      <ItemInfo
        item={item}
        isEditing={isEditing}
        editedName={editedName}
        editedQuantity={editedQuantity}
        editedPrice={editedPrice}
        onNameChange={setEditedName}
        onQuantityChange={setEditedQuantity}
        onPriceChange={setEditedPrice}
      />

      {/* Actions (Edit, Delete) */}
      <ItemActions
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onDelete={() => setShowDeleteDialog(true)}
        onCancel={handleCancelEdit}
      />
    </motion.div>
  );
}
```

**Design Tokens**:
- **Background**: `bg-card/50 backdrop-blur-sm` (glass morphism)
- **Border**: `border border-border` (subtle outline)
- **Hover**: `hover:shadow-md hover:border-border/60` (NO scale/lift)
- **Tactile**: `cardTactile.hover` = `{ scale: 1.02 }` (subtle)
- **Negative prices**: Red tint (`bg-red-50/50 border-red-200`)

---

## 3.6 PremiumSectionHeader Component

**File**: `src/features/setup/components/PremiumSectionHeader.tsx` (80 lines)

### 4 Variants

```tsx
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { typography } from '@/lib/typography';
import { fadeInUp } from '@/lib/motion';
import { LucideIcon } from 'lucide-react';

interface PremiumSectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  count?: number;
  variant?: 'default' | 'success' | 'info' | 'warning';
}

const variantStyles = {
  default: {
    text: 'text-foreground',
    badge: 'bg-primary/10 text-primary border-primary/20',
  },
  success: {
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  info: {
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  warning: {
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  },
};

export function PremiumSectionHeader({ icon: Icon, title, count, variant = 'default' }: PremiumSectionHeaderProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3">
      {Icon && (
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 ${styles.text}`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
      
      <h3 className={`${typography.h3} ${styles.text}`}>
        {title}
      </h3>

      {count !== undefined && (
        <Badge variant="outline" className={`${styles.badge} min-w-[2rem] justify-center`}>
          {count}
        </Badge>
      )}
    </motion.div>
  );
}
```

**Usage Examples**:
```tsx
// Default (primary blue)
<PremiumSectionHeader icon={Package} title="Items" count={12} />

// Success (green) - for discounts
<PremiumSectionHeader icon={Tag} title="Discounts" count={3} variant="success" />

// Info (blue) - for deposits
<PremiumSectionHeader icon={RecycleIcon} title="Deposits" count={2} variant="info" />

// Warning (orange) - for tips/fees
<PremiumSectionHeader icon={Coins} title="Tips" count={1} variant="warning" />
```

---

## 3.7 Category Taxonomy System

**Files**: `src/lib/taxonomy/` (8 files total)

### Taxonomy Structure

**24 Merchandise Categories**:
```typescript
// src/lib/taxonomy/types.ts
export type MerchandiseCategoryCode =
  | 'GROC'   // Grocery
  | 'ALCO'   // Alcohol
  | 'TOBA'   // Tobacco
  | 'DRUG'   // Drugstore
  | 'PHAR'   // Pharmacy
  | 'HOME'   // Household Items
  | 'PETS'   // Pet Supplies
  | 'DIYH'   // DIY & Hardware
  | 'FURN'   // Furniture & Homeware
  | 'ELEC'   // Electronics
  | 'APPL'   // Appliances
  | 'OFFI'   // Office Supplies
  | 'BOOK'   // Books & Media
  | 'TOYS'   // Toys & Games
  | 'CLTH'   // Clothing & Accessories
  | 'SPOR'   // Sports & Outdoor
  | 'AUTO'   // Automotive
  | 'GARD'   // Garden & Plants
  | 'REST'   // Restaurant & Dining
  | 'SERV'   // Services
  | 'TCOM'   // Telecom & Utilities
  | 'GIFT'   // Gift Cards & Vouchers
  | 'POST'   // Postal & Shipping
  | 'MISC';  // Miscellaneous
```

**15 Grocery Subcategories**:
```typescript
export type GroceryCategoryCode =
  | 'GROC.DAIRY'         // Dairy
  | 'GROC.MEAT'          // Meat & Poultry
  | 'GROC.SEAFOOD'       // Seafood
  | 'GROC.BAKERY'        // Bakery
  | 'GROC.PRODUCE'       // Produce
  | 'GROC.FROZEN'        // Frozen Foods
  | 'GROC.CANNED'        // Canned & Jarred
  | 'GROC.SNACKS'        // Snacks & Sweets
  | 'GROC.CONDIMENTS'    // Condiments
  | 'GROC.BEVERAGES_NA'  // Beverages (Non-Alcoholic)
  | 'GROC.BREAKFAST'     // Breakfast Foods
  | 'GROC.PASTA'         // Pasta & Grains
  | 'GROC.DELI'          // Deli
  | 'GROC.SPECIALTY'     // International/Specialty
  | 'GROC.BABY'          // Baby Food
  | 'GROC.PET';          // Pet Food
```

**12 Special Lines**:
```typescript
export type SpecialLineCategoryCode =
  | 'TAX'        // Sales Tax / VAT
  | 'DEPO'       // Deposit (Pfand)
  | 'DEPO_RET'   // Deposit Return
  | 'DISC'       // Discount / Coupon
  | 'FEES'       // Service Fees
  | 'SHIP'       // Shipping / Delivery
  | 'TIP'        // Tip / Gratuity
  | 'ROUND'      // Rounding Adjustment
  | 'REFUND'     // Refund
  | 'CASHBK'     // Cashback
  | 'DONAT'      // Donation
  | 'PAYMT';     // Payment Line
```

### Helper Functions

**File**: `src/lib/taxonomy/helpers.ts`

```typescript
/**
 * Type guard: Check if category is a special line
 */
export function isSpecialLine(categoryId: string): boolean {
  const specialCodes = [
    'TAX', 'DEPO', 'DEPO_RET', 'DISC', 'FEES',
    'SHIP', 'TIP', 'ROUND', 'REFUND', 'CASHBK', 'DONAT', 'PAYMT',
  ];
  return specialCodes.includes(categoryId);
}

/**
 * Check if item is a Pfand/deposit line
 */
export function isPfandLine(categoryId: string): boolean {
  return categoryId === 'DEPO' || categoryId === 'DEPO_RET';
}

/**
 * Check if item is a discount/coupon
 */
export function isDiscountLine(categoryId: string): boolean {
  return categoryId === 'DISC';
}

/**
 * Check if item should be excluded from split calculation
 */
export function shouldExcludeFromSplit(categoryId: string): boolean {
  return [
    'TAX',      // VAT/Sales tax (usually inclusive)
    'PAYMT',    // Payment lines (not actual items)
    'CASHBK',   // Cashback (separate from bill)
  ].includes(categoryId);
}

/**
 * Get localized category name
 */
export function getCategoryName(category: Category, locale: string): string {
  const translations = {
    'GROC.DAIRY': { en: 'Dairy', de: 'Milchprodukte' },
    'GROC.MEAT': { en: 'Meat & Poultry', de: 'Fleisch & Geflügel' },
    'DISC': { en: 'Discount', de: 'Rabatt' },
    'DEPO': { en: 'Deposit', de: 'Pfand' },
    // ... 47 more entries
  };

  return translations[category.id]?.[locale] || category.id;
}

/**
 * Get emoji for category
 */
export function getCategoryEmoji(categoryId: string): string {
  const emojiMap = {
    'GROC.DAIRY': '🥛',
    'GROC.MEAT': '🥩',
    'GROC.BAKERY': '🥖',
    'GROC.PRODUCE': '🥬',
    'DISC': '🏷️',
    'DEPO': '♻️',
    'TIP': '💰',
    // ... 44 more mappings
  };

  return emojiMap[categoryId] || '📦';
}
```

### Migration System

**File**: `src/lib/taxonomy/migration.ts`

```typescript
/**
 * Migrate legacy category codes to new taxonomy
 * Handles 3 legacy formats:
 * 1. Old codes (GROCERY → GROC)
 * 2. String category names ("Dairy" → GROC.DAIRY)
 * 3. Missing categories (undefined → MISC)
 */

export function migrateCategory(oldCategory: any): Category {
  // Handle undefined/null
  if (!oldCategory) {
    return { id: 'MISC', icon: 'Package' };
  }

  // Handle legacy string codes
  const legacyMap: Record<string, CategoryCode> = {
    'GROCERY': 'GROC',
    'BEER': 'ALCO',
    'WINE': 'ALCO',
    'CIGARETTES': 'TOBA',
    'PHARMACY': 'PHAR',
    // ... 20 more mappings
  };

  if (typeof oldCategory === 'string') {
    const newCode = legacyMap[oldCategory.toUpperCase()];
    return {
      id: newCode || 'MISC',
      icon: getCategoryIcon(newCode || 'MISC'),
    };
  }

  // Handle legacy objects
  if (oldCategory.id) {
    const newCode = legacyMap[oldCategory.id] || oldCategory.id;
    return {
      id: newCode,
      icon: oldCategory.icon || getCategoryIcon(newCode),
    };
  }

  return { id: 'MISC', icon: 'Package' };
}
```

---

## 3.8 Participants Section

**File**: `src/features/setup/ParticipantsSection.tsx` (280 lines)

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ParticipantCard } from './participants/ParticipantCard';
import { PremiumSectionHeader } from './components/PremiumSectionHeader';
import { useStore } from '@/store/useStore';
import { sanitizeInput } from '@/lib/sanitize';
import { feedback } from '@/lib/feedback';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { typography } from '@/lib/typography';

export function ParticipantsSection() {
  const participants = useStore((state) => state.participants);
  const addParticipant = useStore((state) => state.addParticipant);
  
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;

    // ✅ CRITICAL: Sanitize user input before Zustand storage
    const sanitizedName = sanitizeInput(newName.trim());
    
    addParticipant(sanitizedName);
    setNewName('');
    setIsAdding(false);
    feedback.success();
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border/40 bg-gradient-to-b from-muted/30 to-transparent p-6 backdrop-blur-sm"
    >
      {/* Section Header */}
      <PremiumSectionHeader
        icon={Users}
        title="Participants"
        count={participants.length}
      />

      {/* Participants List */}
      <motion.div className="mt-6 space-y-3" variants={staggerContainer}>
        <AnimatePresence mode="popLayout">
          {participants.map((participant) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ParticipantCard participant={participant} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Participant Form */}
      <div className="mt-6">
        {!isAdding ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsAdding(true);
              feedback.click();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Person
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <Input
              autoFocus
              placeholder="Name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} size="sm">
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewName('');
              }}
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
```

### ParticipantCard Component

**File**: `src/features/setup/participants/ParticipantCard.tsx`

```tsx
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParticipantAvatar } from '@/components/ParticipantAvatar';
import { cardTactile } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ParticipantCard({ participant }: ParticipantCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : cardTactile.hover}
      whileTap={prefersReducedMotion ? undefined : cardTactile.tap}
      className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/50 p-3 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
    >
      {/* Avatar with color */}
      <ParticipantAvatar
        name={participant.name}
        color={participant.color}
        size="sm"
      />

      {/* Name */}
      <span className="flex-1 text-sm font-medium">
        {participant.name}
      </span>

      {/* Actions */}
      <div className="flex gap-1">
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </motion.div>
  );
}
```

---

## Summary: Setup Flow Checklist

✅ **ScanPortal**: Refactored 658→183 lines (6 components, 2 hooks)  
✅ **DataHub**: Responsive layout (tabs mobile, side-by-side desktop)  
✅ **ItemsList**: Collapsible sections, search/filter, grouped by type  
✅ **PremiumItemCard**: Glass morphism, tactile feedback, negative price variants  
✅ **PremiumSectionHeader**: 4 variants (default, success, info, warning)  
✅ **Category Taxonomy**: 51 total categories (24 merchandise, 15 grocery, 12 special)  
✅ **ParticipantsSection**: Glass morphism container, inline add form, animations  
✅ **Security**: ALL user input sanitized before Zustand storage  

---

**Next**: Part 4 - Assignment & Summary (Export Features)
