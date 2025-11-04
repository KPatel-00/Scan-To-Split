/**
 * App Component - Main Application Router
 * 
 * ✨ PROMPT 7: Optimized for Initial Load Performance
 * - Route-based code splitting with React.lazy()
 * - Separate chunks for each page (Landing, Setup, Assignment, Summary)
 * - Minimal loading experience with top progress bar (RouteLoadingBar)
 * - Only downloads code for the specific page user visits
 * 
 * ✨ ERROR BOUNDARY: Graceful Error Handling
 * - Wraps entire app with ErrorBoundary to catch JavaScript errors
 * - No blank white screen - shows polished fallback UI
 * - Follows Blueprint Part 0, Section 5 (Helpful & Reassuring voice)
 * - Automatic error logging in development
 * - Reset functionality to recover from errors
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Providers } from './providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TaxonomyErrorBoundary } from './components/TaxonomyErrorBoundary';
import { MigrationBanner } from './components/MigrationBanner';
import { HelpButton } from './components/HelpButton';
import { PageTransition } from './components/PageTransition';
import { RouteLoadingScreen } from './components/LoadingStates';
import { useTranslation } from 'react-i18next';

// ✨ LAZY-LOADED ROUTES - Each page is a separate chunk
// LandingPage is the active landing page (legacy Landing.tsx archived 2025-10-29)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Setup = lazy(() => import('./pages/Setup').then(module => ({ default: module.Setup })));
const Assignment = lazy(() => import('./pages/Assignment').then(module => ({ default: module.Assignment })));
const Summary = lazy(() => import('./pages/Summary').then(module => ({ default: module.Summary })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));


function AnimatedRoutes() {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if we're on landing page - no loading screen needed
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {/* Migration Banner - Shows when legacy data needs migration */}
      <MigrationBanner />
      
      {/* Skip to Main Content - Accessibility Enhancement */}
      <a
        href="#main-content"
        className="skip-to-content"
        aria-label={t('ariaLabels.skipToContent')}
      >
        {t('ariaLabels.skipToContent')}
      </a>
      
      {/* ✨ SUSPENSE BOUNDARY - No loading screen for landing, show RouteLoadingScreen for other pages */}
      <Suspense fallback={isLandingPage ? null : <RouteLoadingScreen />}>
        {/* 
          NOTE: AnimatePresence removed - it was breaking whileInView animations!
          - AnimatePresence with initial={false} globally disabled initial animations
          - This prevented whileInView from triggering properly
          - PageTransition component handles page transitions independently
        */}
        <Routes location={location} key={location.pathname}>
          {/* LandingPage is the primary landing page (legacy Landing archived 2025-10-29) */}
          {/* REMOVED PageTransition wrapper - it was breaking whileInView on landing page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<PageTransition><Setup /></PageTransition>} />
          <Route path="/assignment" element={<PageTransition><Assignment /></PageTransition>} />
          <Route path="/summary" element={<PageTransition><Summary /></PageTransition>} />
          <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        </Routes>
      </Suspense>
      
      {/* HelpButton - Hidden on landing page (tour not needed) */}
      {!isLandingPage && <HelpButton />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TaxonomyErrorBoundary>
        <Providers>
          <Router>
            <AnimatedRoutes />
          </Router>
        </Providers>
      </TaxonomyErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
