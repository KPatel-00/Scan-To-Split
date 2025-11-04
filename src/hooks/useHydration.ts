import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatch errors with Zustand persist
 * Returns true only after client-side hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
