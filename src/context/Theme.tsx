"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, JSX } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const ThemeProvider = ({ 
  children, 
  storageKey = 'themeMode' 
}: ThemeProviderProps): JSX.Element => {
  const [mode, setMode] = useState<ThemeMode>('light');
  
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setMode(stored || (prefersDark ? 'dark' : 'light'));
  }, [storageKey]);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(storageKey, mode);
  }, [mode, storageKey]);

  const toggleTheme = (): void => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}; 