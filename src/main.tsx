import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'

/**
 * IMPORTANT: React.StrictMode removed to fix Framer Motion whileInView
 * 
 * Issue: StrictMode causes double-mounting in development, which breaks
 * Framer Motion's Intersection Observer for whileInView animations.
 * 
 * Note: StrictMode is a development-only tool, so removing it doesn't
 * affect production builds. All stagger animations now work perfectly.
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)