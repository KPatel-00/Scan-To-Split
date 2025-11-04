/**
 * Theme Toggle - Premium Design
 * 
 * Premium icon-based theme switcher with fluid animations.
 * Features:
 * - Vertical slide animation (y-axis)
 * - AnimatePresence for smooth enter/exit
 * - Fast, fluid transitions (200ms)
 * - Ghost button variant
 * - Direct light/dark toggle (no system mode)
 */

import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { feedback } from '../lib/feedback';
import { IconButton } from './ui/icon-button';
import { snappyNormal } from '@/lib/motion/physics';

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const handleToggle = () => {
    feedback.select();
    // Direct toggle: light ↔ dark (no system mode for premium feel)
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Determine current theme (handle system preference)
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <IconButton
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ y: -12, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.8 }}
            transition={{ ...snappyNormal, mass: 0.5 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -12, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.8 }}
            transition={{ ...snappyNormal, mass: 0.5 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
}
