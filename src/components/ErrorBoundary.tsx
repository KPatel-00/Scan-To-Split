import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { gentleNormal } from '@/lib/motion/physics';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Premium Error Fallback UI
 * 
 * Blueprint: Part 0, Section 5 - Voice & Tone
 * - Helpful & Reassuring
 * - Clear & Direct
 * - Subtly Witty
 */
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentleNormal}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center shadow-2xl">
          {/* Icon with gentle bounce animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3 },
              y: { 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              },
            }}
            className="mb-6 flex justify-center"
          >
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Title - Reassuring & Clear */}
          <h1 className="mb-3 text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>

          {/* Description - Helpful & Direct */}
          <p className="mb-6 text-sm text-muted-foreground">
            Don't worry—this happens sometimes. Your data is safe. Try refreshing the page, or head back home.
          </p>

          {/* Error Details (Collapsible in production, helpful for debugging) */}
          {import.meta.env.DEV && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-mono text-destructive break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={resetErrorBoundary}
              size="lg"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/**
 * Error Boundary Wrapper Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Features:
 * - Graceful error handling (no blank white screen)
 * - Premium fallback UI with animations
 * - Automatic error logging
 * - Reset functionality to recover from errors
 * - Development mode shows error details
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, info: ErrorInfo) => {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, info);
    }

    // In production, you could send this to an error tracking service
    // Example: Sentry, LogRocket, etc.
    // if (import.meta.env.PROD) {
    //   logErrorToService(error, info);
    // }
  };

  const handleReset = () => {
    // Optional: Clear any corrupted state from localStorage
    // This can help recover from errors caused by bad data
    try {
      // You could clear specific keys if needed
      // localStorage.removeItem('some-corrupted-key');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Class-based Error Boundary (Alternative Implementation)
 * 
 * This is a custom implementation if you prefer not to use react-error-boundary.
 * The library version above is recommended for better TypeScript support and features.
 */
export class ClassErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null });
            window.location.href = '/';
          }}
        />
      );
    }

    return this.props.children;
  }
}
