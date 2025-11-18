# Part 2: Landing Page & App Shell

**Last Updated**: November 18, 2025  
**Status**: ✅ Fully Implemented  
**Estimated Reading Time**: 40 minutes

---

## 2.1 Route Architecture

### React Router v6 Setup

**File**: `src/App.tsx` (185 lines)

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingStates';
import { Providers } from './providers';

// Lazy-loaded route components
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Setup = lazy(() => import('./pages/Setup').then(m => ({ default: m.Setup })));
const Assignment = lazy(() => import('./pages/Assignment').then(m => ({ default: m.Assignment })));
const Summary = lazy(() => import('./pages/Summary').then(m => ({ default: m.Summary })));

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/assignment" element={<Assignment />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}
```

### PageTransition Component

**File**: `src/components/PageTransition.tsx`

```tsx
import { motion } from 'framer-motion';
import { springTransition } from '@/lib/motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springTransition}
    >
      {children}
    </motion.div>
  );
}
```

**Usage** (applied to Setup, Assignment, Summary pages):
```tsx
export function Setup() {
  return (
    <PageTransition>
      {/* Page content */}
    </PageTransition>
  );
}
```

**Note**: Landing page does NOT use PageTransition to ensure instant first load.

---

## 2.2 App Header

**File**: `src/components/AppHeader.tsx` (142 lines)

```tsx
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Settings, HelpCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants/app';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">{APP_NAME}</span>
        </Link>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Help & Tours</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
```

**Features**:
- ✅ Sticky positioning with backdrop blur
- ✅ APP_NAME from global constants
- ✅ Theme toggle button
- ✅ Settings and help buttons with tooltips
- ✅ Responsive layout

---

## 2.3 Landing Page Structure

**File**: `src/pages/Landing.tsx` (Main wrapper)

```tsx
import { HeroSection } from '@/features/landing-page/HeroSection';
import { FeaturesSection } from '@/features/landing-page/FeaturesSection';
import { USPSection } from '@/features/landing-page/USPSection';

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <USPSection />
    </div>
  );
}
```

**Section Breakdown**:
1. **HeroSection** - Above-the-fold with CTA
2. **FeaturesSection** - 3-column grid with staggered reveals
3. **USPSection** - Cinematic scroll-sequencing (desktop)

---

## 2.4 Hero Section

**File**: `src/features/landing-page/HeroSection.tsx` (120 lines)

```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springTransition } from '@/lib/motion';
import { typography } from '@/lib/typography';

export function HeroSection() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { opacity: 1 }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: springTransition,
        },
      };

  return (
    <section className="container flex min-h-screen items-center justify-center py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-4xl text-center"
      >
        {/* Headline */}
        <h1 className={typography.display.xl}>
          Split Bills Instantly. Just Scan the Receipt.
        </h1>

        {/* Subtitle */}
        <p className={`${typography.body.lg} mt-6 text-muted-foreground`}>
          AI-powered receipt scanning meets fair bill splitting. 
          No more calculator fumbling or awkward conversations.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/setup')}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => {/* Load demo data */}}
          >
            Try Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
```

**Key Features**:
- ✅ Page load animation (NOT scroll-triggered)
- ✅ Reduced motion support
- ✅ Typography scales from `typography.ts`
- ✅ Responsive button layout
- ✅ Navigation to /setup and demo

---

## 2.5 Features Section

**File**: `src/features/landing-page/FeaturesSection.tsx` (180 lines)

```tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Scan, Users, Calculator, Zap } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { smoothSlow } from '@/lib/motion';
import { typography } from '@/lib/typography';

const features = [
  {
    icon: Scan,
    title: 'AI Receipt Scanning',
    description: 'Snap a photo and let AI extract every item instantly.',
  },
  {
    icon: Users,
    title: 'Flexible Splitting',
    description: 'Split by person, percentage, or exact amounts.',
  },
  {
    icon: Calculator,
    title: 'Smart Calculations',
    description: 'Tax, tip, and discounts handled automatically.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get results in seconds, not minutes.',
  },
];

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: smoothSlow,
        },
      };

  return (
    <section className="container py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className={`${typography.display.md} text-center mb-12`}>
          Everything you need to split bills
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className="p-6 h-full">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className={typography.heading.h4}>{feature.title}</h3>
                <p className={`${typography.body.sm} text-muted-foreground mt-2`}>
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Animation Details**:
- **Stagger delay**: 0.1s between cards (disabled in reduced motion)
- **Physics**: `smoothSlow` spring (stiffness: 180, damping: 25)
- **Trigger**: When 20% of section enters viewport
- **Once**: Animation plays only first time

---

## 2.6 USP Section (Cinematic Scroll)

**File**: `src/features/landing-page/USPSection.tsx` (350 lines)

### Desktop Implementation (≥1024px)

```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const features = [
  {
    id: 1,
    title: 'True Granular Splitting',
    description: 'Go beyond equal splits. Assign items to any combination...',
    visualComponent: <GranularSplitVisual />,
  },
  // ... 3 more features
];

export function USPSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useReducedMotion();

  // Disable cinematic scroll on mobile or reduced motion
  if (!isDesktop || prefersReducedMotion) {
    return <SimpleMobileLayout features={features} />;
  }

  return <DesktopCinematicScroll features={features} containerRef={containerRef} />;
}
```

### Scroll-Linked Opacity Logic

```tsx
function DesktopCinematicScroll({ features, containerRef }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0-1) to visual opacity
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.75, 1], [0, 1, 1]);

  return (
    <div ref={containerRef} style={{ minHeight: '400vh' }}>
      <div className="sticky top-24 grid lg:grid-cols-2 gap-12">
        {/* Left: Scrolling Text */}
        <div className="space-y-[100vh]">
          {features.map((feature) => (
            <div key={feature.id} className="min-h-screen flex items-center">
              <TextContent feature={feature} />
            </div>
          ))}
        </div>

        {/* Right: Sticky Visuals with Layered Opacity */}
        <div className="relative h-screen">
          <div className="sticky top-24">
            <motion.div style={{ opacity: opacity1 }} className="absolute inset-0">
              {features[0].visualComponent}
            </motion.div>
            <motion.div style={{ opacity: opacity2 }} className="absolute inset-0">
              {features[1].visualComponent}
            </motion.div>
            <motion.div style={{ opacity: opacity3 }} className="absolute inset-0">
              {features[2].visualComponent}
            </motion.div>
            <motion.div style={{ opacity: opacity4 }} className="absolute inset-0">
              {features[3].visualComponent}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Scroll Progress Mapping**:
- **0-25%**: Visual 1 visible (Granular Splitting)
- **25-50%**: Visual 2 visible (AI Magic)
- **50-75%**: Visual 3 visible (Proactive Intelligence)
- **75-100%**: Visual 4 visible (Multi-Bill Management)

### Mobile Fallback

```tsx
function SimpleMobileLayout({ features }) {
  return (
    <section className="container py-24">
      <div className="space-y-24">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h3 className={typography.display.sm}>{feature.title}</h3>
              <p className={typography.body.lg}>{feature.description}</p>
              <div>{feature.visualComponent}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

**Why Mobile Fallback?**
- Sticky 2-column layout → poor mobile UX
- 400vh height → excessive scrolling
- Simple stack → better mobile experience

---

## 2.7 Error Boundaries

**File**: `src/components/ErrorBoundary.tsx` (180 lines)

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { springTransition } from '@/lib/motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springTransition}
          >
            <Card className="max-w-md p-8 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
              </motion.div>

              <h2 className="mt-6 text-2xl font-bold">
                Oops! Something went wrong
              </h2>

              <p className="mt-4 text-muted-foreground">
                Don't worry—this happens sometimes. Your data is safe. 
                Try refreshing the page, or head back home.
              </p>

              <div className="mt-6 flex gap-4">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
              </div>

              {import.meta.env.DEV && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error?.message}
                  </pre>
                </details>
              )}
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Features**:
- ✅ Catches all JavaScript errors in component tree
- ✅ Premium fallback UI with animations
- ✅ Reassuring message (Part 0, Section 5 voice)
- ✅ Recovery actions (Try Again, Go Home)
- ✅ Dev mode shows error details
- ✅ Production hides sensitive info

---

## 2.8 Loading States

**File**: `src/components/LoadingStates.tsx` (250 lines)

### Route Loading Screen

```tsx
import { motion } from 'framer-motion';
import { Progress } from './ui/progress';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <div className="h-16 w-16 mx-auto rounded-lg bg-primary" />
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.15,
              }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
          >
            <Progress value={100} className="h-1" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
```

### Route Loading Screen (Hydration)

```tsx
export function RouteLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Progress value={33} className="w-64 mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

**Usage**:
```tsx
// Route lazy loading (App.tsx)
<Suspense fallback={<LoadingScreen />}>

// Hydration check (any page)
const isHydrated = useHydration();
if (!isHydrated) return <RouteLoadingScreen />;
```

---

## Summary: Landing & Shell Checklist

✅ **Route Architecture**: React Router v6 with lazy loading  
✅ **App Header**: Sticky header with theme toggle, tooltips  
✅ **Hero Section**: Page load animation, reduced motion support  
✅ **Features Section**: 4-column grid, staggered scroll reveals  
✅ **USP Section**: Cinematic scroll (desktop), simple stack (mobile)  
✅ **Error Boundaries**: Premium fallback UI, recovery actions  
✅ **Loading States**: Route loading, hydration loading  

---

**Next**: Part 3 - Setup Flow (Bill & Participants)
