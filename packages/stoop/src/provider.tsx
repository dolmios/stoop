"use client";

import React, { createContext, useCallback, useContext, useState, useEffect, useMemo } from "react";

import type { ThemeContextValue, ThemeProviderProps } from "./types.js";

export type { ThemeContextValue, ThemeProviderProps };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "stoop-theme",
}: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const setTheme = useCallback(
    (newTheme: string): void => {
      setThemeState(newTheme);

      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage not available
      }
    },
    [storageKey],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({ setTheme, theme }), [setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
