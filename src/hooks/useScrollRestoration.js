import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to save and restore scroll position
 * Useful for maintaining scroll position when navigating between views
 */
const useScrollRestoration = (key = 'default', enabled = true) => {
  const scrollPositionRef = useRef(0);
  const isRestoringRef = useRef(false);

  // Save current scroll position
  const saveScrollPosition = useCallback(() => {
    if (!enabled) return;
    
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    scrollPositionRef.current = scrollY;
    
    // Optional: Save to sessionStorage for persistence across page reloads
    sessionStorage.setItem(`scroll-position-${key}`, scrollY.toString());
  }, [key, enabled]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (!enabled) return;
    
    // Prevent multiple rapid restorations
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;
    
    const savedPosition = scrollPositionRef.current;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Additional delay to ensure content is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'instant' // Use 'smooth' if you want animated scrolling
        });
        isRestoringRef.current = false;
      }, 50);
    });
  }, [enabled]);

  // Clear saved position
  const clearScrollPosition = useCallback(() => {
    scrollPositionRef.current = 0;
    sessionStorage.removeItem(`scroll-position-${key}`);
  }, [key]);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    if (!enabled) return;
    
    const savedPosition = sessionStorage.getItem(`scroll-position-${key}`);
    if (savedPosition) {
      scrollPositionRef.current = parseInt(savedPosition, 10);
    }
  }, [key, enabled]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    getCurrentScrollPosition: () => scrollPositionRef.current
  };
};

export default useScrollRestoration;