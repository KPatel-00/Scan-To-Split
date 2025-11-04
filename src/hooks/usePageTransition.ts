import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { feedback } from '../lib/feedback';

// Track navigation history for directional transitions
let navigationHistory: string[] = [];
let currentIndex = 0;

export function usePageTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      navigationHistory = [pathname];
      currentIndex = 0;
      isInitialMount.current = false;
    }
  }, [pathname]);

  const navigateWithTransition = (path: string, playSound = true) => {
    if (playSound) {
      feedback.click();
    }

    // Update navigation history
    const newIndex = currentIndex + 1;
    navigationHistory = [...navigationHistory.slice(0, newIndex), path];
    currentIndex = newIndex;

    // Small delay for feedback to play
    setTimeout(() => {
      navigate(path);
    }, 50);
  };

  const navigateBack = (playSound = true) => {
    if (playSound) {
      feedback.click();
    }

    if (currentIndex > 0) {
      currentIndex--;
      const previousPath = navigationHistory[currentIndex];
      
      setTimeout(() => {
        navigate(previousPath);
      }, 50);
    } else {
      setTimeout(() => {
        navigate(-1);
      }, 50);
    }
  };

  const getDirection = () => {
    // Determine if we're going forward or backward
    const pageOrder = ['/', '/setup', '/assignment', '/summary'];
    const currentIdx = pageOrder.indexOf(pathname);
    
    if (currentIdx === -1) {
      // Check for legacy routes
      const legacyMap: Record<string, string> = {
        '/part2': '/setup',
        '/part3': '/assignment',
        '/part4': '/summary',
      };
      const mappedPath = legacyMap[pathname];
      if (mappedPath) {
        return pageOrder.indexOf(mappedPath) > 0 ? 'forward' : 'backward';
      }
      return 'forward';
    }
    
    const prevPath = navigationHistory[currentIndex - 1] || '/';
    const prevIdx = pageOrder.indexOf(prevPath);
    
    return currentIdx > prevIdx ? 'forward' : 'backward';
  };

  return {
    navigateWithTransition,
    navigateBack,
    direction: getDirection(),
  };
}
