/**
 * i18n Configuration
 * Modular internationalization setup with lazy loading support
 * 
 * Structure:
 * - locales/en/ - English translations (modular: setup, assignment, summary, landing, messages, common)
 * - locales/de/ - German translations (modular: setup, assignment, summary, landing, messages, common)
 * 
 * Usage:
 * import i18n from './lib/i18n';
 * // i18n is already initialized and ready to use
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { de } from './locales/de';

// Combine all resources
const resources = {
  en,
  de,
};

// Initialize i18n synchronously with eager loading
// Note: This maintains backward compatibility with the original setup
// Future enhancement: Can add lazy loading per page for better performance
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  debug: true,
  keySeparator: '.',
  nsSeparator: ':',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
