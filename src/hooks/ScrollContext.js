// context/ScrollContext.js
import React, { createContext, useContext } from 'react';
import { useScrollPosition } from './useScrollRestoration';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const scrollPosition = useScrollPosition();

  return (
    <ScrollContext.Provider value={scrollPosition}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};