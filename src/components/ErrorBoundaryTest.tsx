/**
 * Error Boundary Test Component
 * 
 * This component is for DEVELOPMENT ONLY.
 * It helps test the ErrorBoundary by intentionally throwing errors.
 * 
 * Usage:
 * 1. Import this component in any page (e.g., Landing.tsx)
 * 2. Add <ErrorBoundaryTest /> to the JSX
 * 3. Click the "Throw Error" button to test the error boundary
 * 4. Remove this component before production
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

export function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // This will trigger the error boundary
  if (shouldThrow) {
    throw new Error('Test error: This is intentional to verify ErrorBoundary is working!');
  }

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <Button
        onClick={() => setShouldThrow(true)}
        variant="destructive"
        size="sm"
        className="gap-2 shadow-lg"
      >
        <AlertTriangle className="h-4 w-4" />
        Test Error Boundary
      </Button>
    </div>
  );
}
