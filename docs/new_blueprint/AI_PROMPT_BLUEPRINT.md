# ScanToSplit.ai - Complete Build Blueprint

**Goal**: Build a premium bill-splitting web app with AI receipt scanning, smooth animations, glass morphism UI, and flawless UX. Inspired by Apple iOS and Revolut design language.

---

## 🎯 Core Concept

**What**: Split restaurant/grocery bills fairly among friends. Upload receipt photo → AI extracts items → Assign items to people → See who owes what.

**Premium Experience**: 
- Glass morphism design (bg-card/50 backdrop-blur-sm)
- Buttery 60fps animations (Framer Motion with spring physics)
- Smart tactile feedback (hover scale 1.05, tap scale 0.98)
- Generous white space (py-12, gap-8)
- Responsive typography (40+ semantic variants)

---

## 🏗️ Tech Stack

```json
{
  "react": "^18.3.1",
  "typescript": "^5.5.3",
  "vite": "^5.4.2",
  "zustand": "^4.5.2",
  "framer-motion": "^11.5.4",
  "tailwindcss": "^3.4.1",
  "react-router-dom": "^6.26.1",
  "react-hook-form": "^7.51.0",
  "dompurify": "^3.0.9",
  "react-i18next": "^14.0.5",
  "@google/generative-ai": "latest",
  "shadcn/ui": "radix-ui primitives"
}
```

**Vite Config** - Manual chunks for optimal loading:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'motion': ['framer-motion'],
        'pdf-export': ['jspdf'],
        'image-export': ['html2canvas', 'html-to-image'],
        'ai-scanning': ['@google/generative-ai'],
      }
    }
  }
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn primitives (button, card, dialog, etc.)
│   ├── AppHeader.tsx    # Logo, theme toggle, settings
│   ├── ProgressStepper.tsx  # 3-step indicator
│   ├── PageTransition.tsx   # Route fade animation
│   └── LoadingStates.tsx    # Progress bar screens
├── features/
│   ├── landing-page/    # Hero, features, USP scroll
│   ├── setup/           # ScanPortal, DataHub, ItemsList
│   ├── assignment/      # ParticipantPalette, ItemCard
│   └── summary/         # Settlement cards, export buttons
├── lib/
│   ├── motion/          # 43 animation presets (buttonTactile, fadeInUp, etc.)
│   ├── typography.ts    # 40+ responsive text variants
│   ├── sanitize.ts      # XSS prevention with DOMPurify
│   └── taxonomy/        # 51 item categories (GROC.DAIRY, ALCO.BEER, etc.)
├── store/
│   ├── slices/          # 9 Zustand slices (items, participants, receipts, etc.)
│   └── useStore.ts      # Combined store with localStorage persist
└── hooks/
    ├── useHydration.ts      # Prevent SSR mismatches
    └── useReducedMotion.ts  # Accessibility motion detection
```

---

## 🎨 Design System

### Colors (CSS Variables)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --primary: 221.2 83.2% 53.3%;
  --border: 214.3 31.8% 91.4%;
  --muted: 210 40% 96.1%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --primary: 217.2 91.2% 59.8%;
  --border: 217.2 32.6% 17.5%;
  --muted: 217.2 32.6% 17.5%;
}
```

### Typography (src/lib/typography.ts)
```typescript
export const typography = {
  display: {
    xl: 'text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl',
    lg: 'text-4xl font-bold tracking-tight sm:text-5xl',
    md: 'text-3xl font-bold tracking-tight sm:text-4xl',
    sm: 'text-2xl font-bold tracking-tight sm:text-3xl',
  },
  heading: {
    h1: 'text-3xl font-bold tracking-tight sm:text-4xl',
    h2: 'text-2xl font-bold tracking-tight sm:text-3xl',
    h3: 'text-xl font-semibold tracking-tight sm:text-2xl',
    h4: 'text-lg font-semibold tracking-tight',
  },
  body: {
    lg: 'text-lg text-muted-foreground',
    base: 'text-base text-muted-foreground',
    sm: 'text-sm text-muted-foreground',
  },
};
```

**Usage**: `<h1 className={typography.display.xl}>Hero Title</h1>`

### Animations (src/lib/motion/)

**43 Named Presets** - Never inline physics values:

```typescript
// Tactile feedback
export const buttonTactile = {
  hover: { scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } },
  tap: { scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } },
};

export const cardTactile = {
  hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
  tap: { scale: 0.99, transition: { duration: 0.1, ease: 'easeIn' } },
};

// Common patterns
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Accessibility wrapper
export function safeTactile(preset: any, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) return {};
  return preset;
}
```

**Usage**:
```tsx
import { buttonTactile, safeTactile } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prefersReducedMotion = useReducedMotion();
<motion.button {...safeTactile(buttonTactile, prefersReducedMotion)}>
  Click me
</motion.button>
```

### Glass Morphism Pattern
```tsx
// Standard card
className="bg-card/50 backdrop-blur-sm border border-border/40 shadow-sm"

// With gradient
className="bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm"

// Hover effect
className="hover:shadow-md hover:border-border/60 transition-all duration-300"
```

---

## 🗄️ State Management (Zustand)

### Store Architecture (src/store/)

**9 Domain Slices**:
1. `itemsSlice` - Items list, add/edit/delete, tax/tip
2. `participantsSlice` - Participant list, add/edit/delete
3. `receiptsSlice` - Multiple receipts (when mode = 'separate')
4. `groupsSlice` - Item groups (discounts, special lines)
5. `scanningSlice` - AI scan status, progress
6. `settingsSlice` - Language, theme, analytics
7. `uiSlice` - managementMode ('merged'|'separate'), lastActivePage
8. `modalsSlice` - Dialog open states
9. `undoSlice` - Undo/redo history

**Combined Store** (src/store/useStore.ts):
```typescript
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...itemsSlice(set, get),
      ...participantsSlice(set, get),
      ...receiptsSlice(set, get),
      // ... other slices
    }),
    { name: 'scantosplit-storage' }
  )
);
```

### Critical Pattern: Fine-Grained Selectors

```tsx
// ✅ CORRECT - Only re-renders when items change
const items = useStore((state) => state.items);
const addItem = useStore((state) => state.addItem);

// ❌ WRONG - Re-renders on ANY store change
const store = useStore();
const items = store.items;
```

### Hydration Pattern (Prevents SSR Mismatches)

```tsx
import { useHydration } from '@/hooks/useHydration';
import { RouteLoadingScreen } from '@/components/LoadingStates';

function MyPage() {
  const isHydrated = useHydration();
  if (!isHydrated) return <RouteLoadingScreen />;
  
  // ✅ Safe to use store - localStorage has loaded
  const items = useStore((state) => state.items);
}
```

**Why?** Zustand persist middleware loads localStorage async. Without this check, components read empty state before hydration completes (causes flicker).

---

## 🛣️ Routes & Pages

### App Router (src/App.tsx)

```tsx
import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing'));
const Setup = lazy(() => import('./pages/Setup'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Summary = lazy(() => import('./pages/Summary'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📄 Page Implementations

### 1. Landing Page (/)

**Hero Section** - Scan receipt animation (Lottie), gradient headline:
```tsx
<section className="py-20 lg:py-32">
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="show"
    className="text-center"
  >
    <h1 className={cn(
      typography.display.xl,
      "bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent"
    )}>
      Split Bills Instantly with AI
    </h1>
    <p className={cn(typography.body.lg, "mt-6 max-w-2xl mx-auto")}>
      Upload receipt photos. AI extracts items. Split fairly in seconds.
    </p>
    <Button size="lg" className="mt-8">
      Get Started <ArrowRight className="ml-2" />
    </Button>
  </motion.div>
  
  {/* Lottie animation */}
  <Lottie animationData={scanReceiptAnimation} className="w-full max-w-lg mx-auto mt-12" />
</section>
```

**Features Grid** - 3 cards with icons:
```tsx
<section className="py-16">
  <div className="grid md:grid-cols-3 gap-8">
    {[
      { icon: Scan, title: 'AI Receipt Scanning', description: 'Snap a photo, AI does the rest' },
      { icon: Users, title: 'Smart Assignment', description: 'Tap items to assign to people' },
      { icon: Calculator, title: 'Fair Splits', description: 'Tax/tip split proportionally' },
    ].map((feature, i) => (
      <motion.div
        key={i}
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <feature.icon className="h-8 w-8 text-primary" />
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    ))}
  </div>
</section>
```

**USP Cinematic Scroll** - Parallax cards with code snippets:
```tsx
<section className="py-32 overflow-hidden">
  {uspCards.map((card, i) => (
    <motion.div
      key={i}
      style={{ y: useParallax(i * 0.1) }}
      className="mb-32"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <h3 className={typography.heading.h2}>{card.title}</h3>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{card.codeSnippet}</code>
          </pre>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</section>
```

### 2. Setup Page (/setup)

**State Machine**: ScanPortal (upload) → DataHub (review)

**ScanPortal** - Receipt upload with drag-drop:
```tsx
export function ScanPortal({ onFileUpload, hasExistingData }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Returning user banner */}
      {hasExistingData && (
        <motion.div variants={fadeInUp}>
          <Alert>Continue editing your existing bill?</Alert>
        </motion.div>
      )}

      {/* Upload card */}
      <motion.div variants={fadeInUp}>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <h2 className={typography.heading.h2}>Upload Receipt</h2>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className={typography.body.lg}>Drop receipt image or click to browse</p>
              <input type="file" accept="image/*" multiple onChange={onFileUpload} hidden ref={fileInputRef} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature highlights */}
      <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          { icon: Zap, text: 'AI extracts items in seconds' },
          { icon: Shield, text: 'Images deleted after processing' },
          { icon: Languages, text: 'Works with any language' },
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <feature.icon className="h-4 w-4 text-primary" />
            {feature.text}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

**AI Scanning** (lazy-loaded):
```typescript
// src/lib/scanReceiptsClient.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function scanReceipts(files: File[]) {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Extract items from receipt as JSON array:
  [{ name: string, price: number, category: 'GROC.DAIRY'|'ALCO.BEER'|etc }]`;

  const images = await Promise.all(
    files.map(f => compressImage(f).then(toBase64))
  );

  const result = await model.generateContent([prompt, ...images]);
  const json = JSON.parse(result.response.text());
  
  // ✅ Sanitize all AI results before storing
  return json.map(item => ({
    ...item,
    name: sanitizeInput(item.name),
  }));
}
```

**DataHub** - Items + Participants review:
```tsx
export function DataHub({ managementMode, items, participants }) {
  return (
    <div className="container max-w-screen-xl py-12 space-y-12">
      {/* Bill info header */}
      <Card className="bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
        <CardHeader>
          <h2 className={typography.display.md}>Bill Information</h2>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Store className="h-5 w-5" />
            <span>{storeName || 'Unknown Store'}</span>
            <Calendar className="h-5 w-5 ml-4" />
            <span>{date || 'Today'}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Items list */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <PremiumSectionHeader icon={Package} title="Items" count={items.length} />
        </motion.div>
        
        {items.map(item => (
          <motion.div key={item.id} layout>
            <PremiumItemCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
          </motion.div>
        ))}
      </motion.div>

      {/* Participants section */}
      <ParticipantsSection participants={participants} />
      
      {/* Continue button */}
      <Button size="lg" onClick={() => navigate('/assignment')}>
        Continue to Assignment <ArrowRight />
      </Button>
    </div>
  );
}
```

**PremiumItemCard** - Glass morphism + tactile feedback:
```tsx
export function PremiumItemCard({ item, onEdit, onDelete }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      layout
      whileHover={prefersReducedMotion ? undefined : cardTactile.hover}
      whileTap={prefersReducedMotion ? undefined : cardTactile.tap}
      className={cn(
        'group flex items-center gap-4 rounded-xl border p-4',
        'bg-card/50 backdrop-blur-sm shadow-sm',
        'hover:shadow-md hover:border-border/60 transition-all duration-300'
      )}
    >
      {/* Category icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span className="text-xl">{getCategoryEmoji(item.category)}</span>
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{item.name}</h4>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>

      {/* Price */}
      <div className={typography.display.md}>${item.price.toFixed(2)}</div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
```

### 3. Assignment Page (/assignment)

**Three-Part Layout**: Participant Palette (top) → Bill Info (middle) → Items List (bottom)

**ParticipantPalette** - Multi-select chips:
```tsx
export function ParticipantPalette({ selectedParticipants, onSelectionChange }) {
  const participants = useStore((state) => state.participants);
  
  return (
    <Card>
      <CardHeader>
        <h3 className={typography.heading.h3}>Select Participants</h3>
        <p className="text-sm text-muted-foreground">Tap to select, then click items to assign</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {participants.map(p => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSelection(p.id)}
              className={cn(
                'px-6 py-3 rounded-full border-2 transition-all',
                selectedParticipants.includes(p.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              )}
            >
              {p.name}
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**AssignmentItemCard** - Click to assign:
```tsx
export function AssignmentItemCard({ item, selectedParticipants, onAssign }) {
  const assignItem = useStore((state) => state.assignItem);
  
  const handleClick = () => {
    if (selectedParticipants.length === 0) {
      toast.error('Select participants first');
      return;
    }
    assignItem(item.id, selectedParticipants);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={cn(
        'p-4 rounded-xl border cursor-pointer',
        'bg-card/50 backdrop-blur-sm',
        'hover:border-primary/50 hover:shadow-md transition-all'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.assignedTo?.map(pid => {
              const p = participants.find(x => x.id === pid);
              return (
                <Badge key={pid} variant="secondary">
                  {p?.name}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className={typography.display.sm}>${item.price.toFixed(2)}</div>
      </div>
    </motion.div>
  );
}
```

**Custom Split Popover** - 3 modes (Equal/Percentage/Custom):
```tsx
export function CustomSplitPopover({ item, onSave }) {
  const [mode, setMode] = useState<'equal' | 'percentage' | 'custom'>('equal');
  const [splits, setSplits] = useState<Record<string, number>>({});
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">Custom Split</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equal">Equal</TabsTrigger>
            <TabsTrigger value="percentage">%</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="equal">
            <p className="text-sm">Each person pays equal share</p>
          </TabsContent>

          <TabsContent value="percentage">
            {participants.map(p => (
              <div key={p.id} className="flex items-center gap-2 mb-2">
                <Label>{p.name}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={splits[p.id] || 0}
                  onChange={e => setSplits({ ...splits, [p.id]: Number(e.target.value) })}
                />
                <span>%</span>
              </div>
            ))}
            {/* ✅ Validation: Must sum to 100% */}
            {Object.values(splits).reduce((a,b)=>a+b,0) !== 100 && (
              <Alert variant="destructive">Must sum to 100%</Alert>
            )}
          </TabsContent>

          <TabsContent value="custom">
            {/* Custom dollar amounts */}
          </TabsContent>
        </Tabs>

        <Button onClick={() => onSave(splits)} className="w-full mt-4">
          Apply Split
        </Button>
      </PopoverContent>
    </Popover>
  );
}
```

### 4. Summary Page (/summary)

**Settlement Algorithm** (src/lib/settlement.ts):
```typescript
export function calculateSettlement(participants, items, tax, tip, receipts) {
  // 1. Calculate item subtotals per person
  const balances: Record<string, number> = {};
  
  items.forEach(item => {
    if (!item.assignedTo?.length) return;
    
    const splitAmount = item.customSplit
      ? calculateCustomSplit(item)
      : item.price / item.assignedTo.length;
    
    item.assignedTo.forEach(pid => {
      balances[pid] = (balances[pid] || 0) + splitAmount;
    });
  });

  // 2. Proportionally split tax + tip
  const subtotal = Object.values(balances).reduce((a,b) => a+b, 0);
  const totalTaxTip = tax + tip;
  
  Object.keys(balances).forEach(pid => {
    const proportion = balances[pid] / subtotal;
    balances[pid] += totalTaxTip * proportion;
  });

  // 3. Find who paid
  const paidBy = receipts[0]?.paidBy || 'unknown';
  const totalPaid = subtotal + totalTaxTip;
  
  // 4. Calculate net balances (negative = owes, positive = owed)
  const netBalances = { ...balances };
  netBalances[paidBy] -= totalPaid;

  // 5. Minimize transactions (greedy algorithm)
  const debts = Object.entries(netBalances).filter(([,amt]) => amt < 0);
  const credits = Object.entries(netBalances).filter(([,amt]) => amt > 0);
  
  const transactions = [];
  let i = 0, j = 0;
  
  while (i < debts.length && j < credits.length) {
    const [debtor, debtAmt] = debts[i];
    const [creditor, creditAmt] = credits[j];
    
    const amount = Math.min(Math.abs(debtAmt), creditAmt);
    transactions.push({ from: debtor, to: creditor, amount });
    
    debts[i][1] += amount;
    credits[j][1] -= amount;
    
    if (debts[i][1] === 0) i++;
    if (credits[j][1] === 0) j++;
  }
  
  return { balances, transactions };
}
```

**SettlementCard** - Who owes whom:
```tsx
export function SettlementCard({ transaction }) {
  const fromPerson = participants.find(p => p.id === transaction.from);
  const toPerson = participants.find(p => p.id === transaction.to);
  
  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-gradient-to-br from-card/50 to-green-500/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ParticipantAvatar participant={fromPerson} size="lg" />
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <ParticipantAvatar participant={toPerson} size="lg" />
            </div>
            
            <div className="text-right">
              <div className={typography.display.md}>${transaction.amount.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">
                {fromPerson?.name} pays {toPerson?.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

**Export Buttons** - PDF + Image (lazy-loaded):
```tsx
export function ExportButtons({ summary }) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handlePdfExport = async () => {
    setIsExporting(true);
    // ✅ Lazy load jsPDF (saves 118kb gzipped on initial load)
    const { exportPDF } = await import('@/lib/exportPDF');
    await exportPDF(summary);
    setIsExporting(false);
  };

  const handleImageExport = async () => {
    setIsExporting(true);
    // ✅ Lazy load html-to-image (saves 53kb gzipped)
    const { shareableImage } = await import('@/lib/shareableImage');
    const blob = await shareableImage(document.getElementById('summary-card'));
    
    // ✅ Web Share API for mobile
    if (navigator.share && navigator.canShare({ files: [new File([blob], 'split.png')] })) {
      await navigator.share({
        files: [new File([blob], 'scantosplit-summary.png', { type: 'image/png' })],
        title: 'Bill Split Summary',
      });
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scantosplit-summary.png';
      a.click();
    }
    setIsExporting(false);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handlePdfExport} disabled={isExporting}>
        <FileText className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button onClick={handleImageExport} disabled={isExporting} variant="outline">
        <Share className="mr-2 h-4 w-4" />
        Share Image
      </Button>
    </div>
  );
}
```

---

## 🔒 Security

**XSS Prevention** (src/lib/sanitize.ts):
```typescript
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// ✅ ALWAYS sanitize before storing in Zustand
addParticipant(sanitizeInput(formData.name));
addItem({ name: sanitizeInput(aiScanResult.itemName), ... });
```

---

## 🌍 i18n (Internationalization)

**Setup** (src/i18n/config.ts):
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: require('./locales/en.json') },
    de: { translation: require('./locales/de.json') },
  },
  lng: 'en',
  fallbackLng: 'en',
});
```

**Usage**:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <>
      <h1>{t('landing.hero.title')}</h1>
      <Button onClick={() => i18n.changeLanguage('de')}>Deutsch</Button>
    </>
  );
}
```

---

## 📊 Category Taxonomy (51 Categories)

**File**: `src/lib/taxonomy/categories.ts`

```typescript
// 24 Merchandise Categories
export const MERCHANDISE_CATEGORIES = [
  { code: 'GROC', name: 'Groceries', emoji: '🛒' },
  { code: 'ALCO', name: 'Alcohol', emoji: '🍺' },
  { code: 'TOBA', name: 'Tobacco', emoji: '🚬' },
  { code: 'DRUG', name: 'Drugstore', emoji: '💊' },
  // ... 20 more
];

// 15 Grocery Subcategories
export const GROCERY_SUBCATEGORIES = [
  { code: 'GROC.DAIRY', name: 'Dairy', emoji: '🥛' },
  { code: 'GROC.MEAT', name: 'Meat', emoji: '🥩' },
  { code: 'GROC.BAKERY', name: 'Bakery', emoji: '🥖' },
  // ... 12 more
];

// 12 Special Line Codes
export const SPECIAL_LINE_CODES = [
  { code: 'TAX', name: 'Tax', emoji: '💰' },
  { code: 'TIP', name: 'Tip', emoji: '💵' },
  { code: 'DISC', name: 'Discount', emoji: '🏷️' },
  // ... 9 more
];

export function getCategoryEmoji(code: string): string {
  const all = [...MERCHANDISE_CATEGORIES, ...GROCERY_SUBCATEGORIES, ...SPECIAL_LINE_CODES];
  return all.find(c => c.code === code)?.emoji || '📦';
}
```

---

## ♿ Accessibility

### Reduced Motion
```tsx
// src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  
  return prefersReducedMotion;
}
```

### ARIA Labels
```tsx
<Button aria-label="Add new participant">
  <Plus className="h-4 w-4" />
</Button>

<input aria-describedby="price-help" />
<p id="price-help" className="sr-only">Enter price in dollars</p>
```

### Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
```

---

## 🎭 Responsive Design

**Tailwind Breakpoints**:
```typescript
// tailwind.config.js
screens: {
  'xs': '414px',   // iPhone 15 Pro
  'sm': '640px',   // Small tablets
  'md': '768px',   // iPad Mini portrait
  'lg': '1024px',  // iPad Pro portrait
  'xl': '1366px',  // Laptop
  '2xl': '1920px', // Desktop
}
```

**Mobile-First Pattern**:
```tsx
// Base styles for mobile (xs: 414px)
// Scale up for larger screens
<div className="py-8 md:py-12 lg:py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Orientation Variants**:
```tsx
<div className="portrait:text-sm landscape:text-base">
<div className="fold-v:gap-2 fold-h:gap-4">
```

---

## ⚡ Performance Optimization

### Bundle Splitting Results
- **Before**: 622 kB total (187 kB gzipped)
- **After**: 214 kB initial load (65% reduction)
- **Lazy-loaded chunks**:
  - `pdf-export.js`: 358 kB (118 kB gzipped) - loads on "Download PDF"
  - `image-export.js`: 214 kB (53 kB gzipped) - loads on "Share Image"
  - `ai-scanning.js`: 27 kB (6 kB gzipped) - loads on receipt upload

### Animation Performance
```tsx
// ✅ GPU-accelerated (transform, opacity)
<motion.div animate={{ opacity: 1, scale: 1 }} />

// ❌ CPU-bound (triggers layout reflow)
<motion.div animate={{ width: 200, height: 100 }} />
```

### Image Compression
```typescript
// src/lib/compressImage.ts
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
}
```

---

## ✅ Quality Checklist (Pre-Commit)

### Automated Checks
```bash
npm run build    # TypeScript: MUST pass with zero errors
npm run lint     # ESLint: MUST pass with zero warnings
```

### Manual Checks (40+ items)
1. **Security**: All user input sanitized with `sanitizeInput()`
2. **State**: Fine-grained selectors (`useStore(s => s.items)`)
3. **Hydration**: `useHydration()` before accessing Zustand
4. **Animations**: Named presets from `@/lib/motion/` (no inline)
5. **Typography**: `typography.*` semantic variants (no magic values)
6. **Accessibility**: ARIA labels, keyboard navigation, reduced motion
7. **Responsive**: Mobile-first Tailwind utilities (no JS detection)
8. **Performance**: Layout animations avoid `width`/`height`
9. **i18n**: All user-facing strings use `t()` function
10. **Glass morphism**: `bg-card/50 backdrop-blur-sm` pattern

---

## 🧪 Testing Strategy

### Browser Matrix
- ✅ Chrome 120+ (primary)
- ✅ Safari 17+ (iOS)
- ✅ Firefox 120+
- ✅ Edge 120+

### Device Testing
- ✅ iPhone 15 Pro (414px portrait)
- ✅ iPad Mini (768px portrait)
- ✅ iPad Pro (1024px landscape)
- ✅ MacBook Pro (1440px)
- ✅ 4K Desktop (3840px)

### Critical User Flows (50+ Test Cases)
1. **Landing → Setup**: Hero loads, animations smooth
2. **Receipt upload**: Drag-drop works, AI extracts items
3. **Item editing**: Add/edit/delete items, category icons render
4. **Participant management**: Add/edit/delete participants
5. **Assignment**: Select participants, click items, assignments save
6. **Custom split**: 3 modes work, validation blocks invalid splits
7. **Summary**: Balances correct, transactions minimized
8. **PDF export**: Lazy loads, generates valid PDF
9. **Image export**: Lazy loads, Web Share API works on mobile
10. **Dark mode**: All components render correctly
11. **i18n**: Language switch updates all strings
12. **Responsive**: All breakpoints (xs → 2xl) render correctly
13. **Accessibility**: Keyboard navigation, screen reader, reduced motion

---

## 🚀 Build & Deploy

### Local Development
```bash
npm install
npm run dev  # http://localhost:3000
```

### Production Build
```bash
npm run build   # Output: dist/
npm run preview # Test production build
```

### Environment Variables
```env
VITE_GOOGLE_GEMINI_API_KEY=your_key_here
```

### Deployment (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in dashboard

---

## 🎯 Success Criteria

**Premium Experience Achieved When**:
- ✅ Landing page loads in <2s (214kb gzipped)
- ✅ All animations 60fps (GPU-accelerated)
- ✅ Glass morphism on all cards (bg-card/50 backdrop-blur-sm)
- ✅ Tactile feedback on interactive elements (hover scale 1.05, tap 0.98)
- ✅ Responsive 414px → 3840px (mobile-first Tailwind)
- ✅ Accessible (ARIA, keyboard nav, reduced motion)
- ✅ Secure (DOMPurify on all user input)
- ✅ Fast exports (lazy-loaded PDF 118kb, image 53kb)
- ✅ AI scanning <5s (Gemini 1.5 Flash)
- ✅ Fair settlements (proportional tax/tip, min transactions)

**Visual Quality Checklist**:
- Generous white space (py-12, gap-8)
- Smooth micro-interactions (200ms ease-out)
- Semantic typography (display.xl → body.xs)
- Consistent glass morphism (50% opacity + blur)
- Premium gradients (from-card/50 to-primary/5)
- Subtle shadows (hover: shadow-md)

---

## 📝 Implementation Notes

**Critical Rules**:
1. **NO inline animations** - Import from `@/lib/motion/` only
2. **NO magic text sizes** - Use `typography.*` variants
3. **ALWAYS sanitize** - `sanitizeInput()` before Zustand storage
4. **Fine-grained selectors** - `useStore(s => s.items)` NOT `useStore()`
5. **Hydration check** - `useHydration()` before reading store
6. **Lazy-load heavy deps** - PDF (118kb), image (53kb), AI (6kb)
7. **GPU animations only** - Animate `transform`/`opacity` not `width`/`height`
8. **Mobile-first** - Tailwind `md:` `lg:` breakpoints
9. **ARIA everywhere** - Labels, descriptions, roles
10. **Glass morphism** - `bg-card/50 backdrop-blur-sm` pattern

**Common Pitfalls**:
- ❌ `useStore()` → Re-renders on ANY change (use selectors)
- ❌ AnimatePresence `initial={false}` → Breaks `whileInView`
- ❌ Inline `stiffness:` → Violates design system
- ❌ `text-4xl md:text-6xl` → Use `typography.display.xl`
- ❌ Forgetting `sanitizeInput()` → XSS vulnerability
- ❌ Skipping `useHydration()` → localStorage flicker
- ❌ Animating `width`/`height` → Janky 30fps

---

## 🎨 Design Philosophy

**Apple iOS Inspiration**:
- Generous white space (breathable layouts)
- Smooth spring physics (natural motion)
- Glass morphism (depth without shadows)
- Subtle tactile feedback (hover/tap scale)

**Revolut Influence**:
- Premium gradients (from-card to-primary/5)
- Bold display typography (display.xl 5xl→7xl)
- Smart data visualization (settlement cards)
- Proactive guidance (feature highlights, tooltips)

**Ultimate Premium Experience**:
1. **Fast** - 214kb initial load, lazy-loaded features
2. **Smooth** - 60fps animations, GPU-accelerated
3. **Beautiful** - Glass morphism, premium typography
4. **Intuitive** - Clear flows, proactive guidance
5. **Accessible** - ARIA, keyboard nav, reduced motion
6. **Secure** - XSS prevention, sanitized inputs
7. **Fair** - Proportional tax/tip, minimal transactions
8. **Delightful** - Tactile feedback, cinematic scrolls

---

**Build this app to deliver the ultimate bill-splitting experience. Every detail matters. Premium is in the polish.** ✨
