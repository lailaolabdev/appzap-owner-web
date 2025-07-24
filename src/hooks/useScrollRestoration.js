import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useScrollRestoration() {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollPositions = useRef({});

  // Save scroll position before leaving the list
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.current[location.key] = window.scrollY;
    };

    return () => {
      saveScrollPosition();
    };
  }, [location.key]);

  // Restore scroll position when returning
  useEffect(() => {
    if (scrollPositions.current[location.key]) {
      window.scrollTo(0, scrollPositions.current[location.key]);
    }
  }, [location.key]);

  // Enhanced navigate function that can restore position
  const navigateWithScroll = (to, options) => {
    scrollPositions.current[location.key] = window.scrollY;
    navigate(to, options);
  };

  return { navigateWithScroll };
}