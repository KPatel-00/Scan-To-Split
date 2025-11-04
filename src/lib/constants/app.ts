/**
 * Global App Constants
 * 
 * Central location for app branding, metadata, and configuration.
 * Use these constants throughout the app for consistency.
 */

export const APP_CONFIG = {
  // Brand Identity
  name: 'ScanToSplit.ai',
  shortName: 'ScanToSplit',
  tagline: 'AI-powered bill splitting made simple',
  description: 'Smart receipt scanning and bill-splitting app with AI-powered OCR technology',
  
  // Logo & Assets
  logo: {
    // Path to logo file (relative to public folder)
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
    icon: '/favicon.ico',
  },
  
  // App Metadata
  version: '1.0.0',
  author: 'ScanToSplit Team',
  website: 'https://scantosplit.ai',
  supportEmail: 'support@scantosplit.ai',
  
  // Social Links
  social: {
    github: 'https://github.com/KPatel-00/Scan-To-Split',
    twitter: 'https://twitter.com/scantosplit',
    discord: 'https://discord.gg/scantosplit',
  },
  
  // Feature Flags
  features: {
    aiScanning: true,
    multipleReceipts: true,
    pdfExport: true,
    shareableImages: true,
    analytics: true,
    darkMode: true,
    multiLanguage: true,
  },
  
  // Limits & Constraints
  limits: {
    maxParticipants: 50,
    maxItemsPerBill: 100,
    maxReceiptSize: 10 * 1024 * 1024, // 10MB in bytes
    maxImageDimension: 4096,
  },
  
  // UI Configuration
  ui: {
    defaultCurrency: { symbol: '€', code: 'EUR' },
    defaultLanguage: 'en',
    defaultTheme: 'system' as 'system' | 'light' | 'dark',
    animationsEnabled: true,
  },
  
  // API Configuration (moved from env when safe)
  api: {
    // Don't put actual API keys here - use .env
    geminiModel: 'gemini-1.5-flash',
    geminiMaxTokens: 8192,
  },
} as const;

// Type-safe exports for common values
export const APP_NAME = APP_CONFIG.name;
export const APP_SHORT_NAME = APP_CONFIG.shortName;
export const APP_TAGLINE = APP_CONFIG.tagline;
export const APP_DESCRIPTION = APP_CONFIG.description;
export const APP_VERSION = APP_CONFIG.version;
export const APP_WEBSITE = APP_CONFIG.website;

// Helper function to get full app title
export function getAppTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} - ${APP_NAME}` : APP_NAME;
}

// Helper function to check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof APP_CONFIG.features): boolean {
  return APP_CONFIG.features[feature];
}
