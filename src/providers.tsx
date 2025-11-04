import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { useStore } from './store/useStore';
import { Toaster } from './components/ui/toaster';

// Simple theme provider for Vite
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // ✨ Ultra-smooth theme transitions using View Transition API
    const updateTheme = () => {
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    // Use View Transition API if supported (Chrome 111+, Edge 111+)
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => updateTheme());
    } else {
      // Fallback to requestAnimationFrame for older browsers
      requestAnimationFrame(() => updateTheme());
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const language = useStore((state) => (mounted ? state.language : 'en'));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      i18n.changeLanguage(language);
    }
  }, [language, mounted]);

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
        <Toaster />
      </I18nextProvider>
    </ThemeProvider>
  );
}
