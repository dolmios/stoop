// Example ThemeProvider implementation using Stoop
import { createContext, useContext, useEffect, useState, type JSX } from "react";

import type { ThemeName, ThemeContextValue, ThemeProviderProps } from "./types";

import { ThemeContext as StoopThemeContext, darkTheme, lightTheme } from "./theme";

// Context for theme management
const ThemeManagementContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider - Example implementation showing how to use Stoop's ThemeContext
 * This demonstrates how users can build their own Provider
 */
export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps): JSX.Element {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);

  // Determine current theme based on themeName
  // For light theme, we use null to fall back to base theme (lightTheme)
  // For dark theme, we use the created darkTheme
  const currentTheme = themeName === "dark" ? darkTheme : lightTheme;

  // Global styles use CSS variables, so they update automatically when theme changes
  // No need to re-inject on theme change since we're using CSS variables

  // Load stored theme from localStorage after mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("stoop-theme") as ThemeName | null;

      if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
        setThemeName(storedTheme);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme: ThemeName = themeName === "light" ? "dark" : "light";

    setThemeName(newTheme);

    // Persist to localStorage
    try {
      localStorage.setItem("stoop-theme", newTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const setTheme = (theme: ThemeName): void => {
    setThemeName(theme);

    // Persist to localStorage
    try {
      localStorage.setItem("stoop-theme", theme);
    } catch {
      // Ignore storage errors
    }
  };

  const contextValue: ThemeContextValue = {
    setTheme,
    theme: currentTheme,
    themeName,
    toggleTheme,
  };

  return (
    <StoopThemeContext.Provider value={{ theme: currentTheme }}>
      <ThemeManagementContext.Provider value={contextValue}>
        {children}
      </ThemeManagementContext.Provider>
    </StoopThemeContext.Provider>
  );
}

/**
 * Hook to access theme and theme controls
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeManagementContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
