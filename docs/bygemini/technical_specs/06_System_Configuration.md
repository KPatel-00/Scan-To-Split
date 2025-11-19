# 06. Project Structure & Configuration

This document is the **Master Setup Guide** for the ScanToSplit.ai repository. It contains the exact file structure, dependencies, and entry points required to bootstrap the application from scratch.

## 1. Project File Structure
The application follows a strict feature-based architecture.

```text
src/
├── animations/                 # Lottie JSON files
│   └── hero-scan-receipt.json
├── components/                 # Global shared components
│   ├── analytics/              # Analytics-specific components
│   ├── custom-split/           # Complex split logic UI
│   ├── item-row/               # Reusable item row component
│   ├── separate-bills/         # Separate mode UI
│   ├── settings/               # Settings panels
│   ├── storage/                # Storage management UI
│   └── ui/                     # shadcn/ui primitives (Button, Card, etc.)
├── features/                   # Feature modules (Page-level logic)
│   ├── assignment/             # Step 2: Assign Items
│   ├── landing-archive/        # Legacy landing page components
│   ├── landing-page/           # Current Landing Page (v2)
│   ├── setup/                  # Step 1: Bill & Participants
│   └── summary/                # Step 3: Final Summary
├── hooks/                      # Global custom hooks
├── lib/                        # Core utilities & logic
│   ├── constants/              # App-wide constants
│   ├── i18n/                   # Internationalization
│   ├── motion/                 # Animation system
│   ├── pdf/                    # PDF generation engine
│   ├── storage/                # LocalStorage management
│   └── taxonomy/               # Category system
├── pages/                      # Route components (Lazy loaded)
├── store/                      # Zustand state management
│   ├── selectors/              # Performance optimized selectors
│   └── slices/                 # Domain-specific state logic
├── App.tsx                     # Main Router & Shell
├── index.css                   # Global Styles & Tailwind
├── main.tsx                    # React Entry Point
├── providers.tsx               # Global Context Providers
└── vite-env.d.ts               # Type definitions
```

## 2. Dependencies (`package.json`)
**Critical:** Use these exact versions to ensure stability.

```json
{
  "name": "scantosplit-ai",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@tabler/icons-react": "^3.35.0",
    "@tsparticles/engine": "^3.9.1",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.9.1",
    "browser-image-compression": "^2.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "dompurify": "^3.3.0",
    "driver.js": "^1.3.1",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^11.5.4",
    "html-to-image": "^1.11.11",
    "i18next": "^23.15.1",
    "jspdf": "^2.5.2",
    "lottie-react": "^2.4.1",
    "lucide-react": "^0.445.0",
    "motion": "^12.23.24",
    "react": "^18.3.1",
    "react-confetti": "^6.1.0",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.3.8",
    "react-error-boundary": "^6.0.0",
    "react-hook-form": "^7.65.0",
    "react-hot-toast": "^2.6.0",
    "react-i18next": "^14.1.3",
    "react-resizable-panels": "^3.0.6",
    "react-router-dom": "^6.26.1",
    "react-use": "^17.5.1",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.6.0",
    "vaul": "^1.1.2",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.11",
    "postcss": "^8.4.45",
    "shadcn": "^3.5.0",
    "tailwindcss": "^3.4.11",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.5.4",
    "vite": "^5.4.5"
  }
}
```

## 3. Entry Points

### HTML Entry (`index.html`)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <title>ScanToSplit.ai - AI-Powered Bill Splitting</title>
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="AI-powered bill splitting with smart receipt scanning - Split bills effortlessly" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### React Entry (`src/main.tsx`)
**Note:** `React.StrictMode` is intentionally removed to fix Framer Motion `whileInView` issues.

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> removed for Framer Motion compatibility
  <App />
)
```

### Global Providers (`src/providers.tsx`)
Handles Theme (with View Transitions), i18n, and Toasts.

```tsx
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { useStore } from './store/useStore';
import { Toaster } from './components/ui/toaster';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    const updateTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => updateTheme());
    } else {
      updateTheme();
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const language = useStore((state) => (mounted ? state.language : 'en'));

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted) i18n.changeLanguage(language); }, [language, mounted]);

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
        <Toaster />
      </I18nextProvider>
    </ThemeProvider>
  );
}
```

### Type Definitions (`src/vite-env.d.ts`)
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
```

## 4. Vite Configuration (`vite.config.ts`)
Configures path aliases, manual chunk splitting for performance, and build settings.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies into separate chunks (lazy-loaded only when needed)
          'pdf-export': ['jspdf'],
          'image-export': ['html2canvas', 'html-to-image'],
          'ai-scanning': ['@google/generative-ai'],
          // Keep React/Router in main bundle (needed everywhere)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Framer Motion separate (used across many pages)
          'motion': ['framer-motion'],
          // UI components separate
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase to 600kB (we're splitting manually now)
  },
})
```

## 2. Tailwind Configuration (`tailwind.config.js`)
Defines the design system tokens, colors, and animations.

```javascript
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	screens: {
  		xs: '414px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1366px',
  		'2xl': '1920px'
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 3. TypeScript Configuration (`tsconfig.json`)
Ensures strict type safety and proper path alias resolution.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 5. App Shell & Routing (`src/App.tsx`)
Configures the router, lazy loading, and global error boundaries.

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Providers } from './providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTransition } from './components/PageTransition';
import { RouteLoadingScreen } from './components/LoadingStates';

// Lazy-loaded routes
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Setup = lazy(() => import('./pages/Setup').then(module => ({ default: module.Setup })));
const Assignment = lazy(() => import('./pages/Assignment').then(module => ({ default: module.Assignment })));
const Summary = lazy(() => import('./pages/Summary').then(module => ({ default: module.Summary })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));

function AnimatedRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <Suspense fallback={isLandingPage ? null : <RouteLoadingScreen />}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<PageTransition><Setup /></PageTransition>} />
        <Route path="/assignment" element={<PageTransition><Assignment /></PageTransition>} />
        <Route path="/summary" element={<PageTransition><Summary /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Router>
          <AnimatedRoutes />
        </Router>
      </Providers>
    </ErrorBoundary>
  );
}
```

## 6. Global Providers (`src/providers.tsx`)
Handles theme switching (with View Transitions) and i18n initialization.

```tsx
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { useStore } from './store/useStore';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    const updateTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };
    
    // View Transition API support
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => updateTheme());
    } else {
      updateTheme();
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  );
}
```
