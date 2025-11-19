/**
 * Theme Provider component.
 * Manages theme state, localStorage persistence, and centralized theme variable updates.
 */

import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ComponentType,
  type Context,
  type JSX,
} from "react";

import type { ProviderProps, Theme, ThemeContextValue, ThemeManagementContextValue } from "../types";

import { updateThemeVariables } from "../core/theme-manager";

/**
 * Creates a Provider component for theme management.
 *
 * @param ThemeContext - Stoop's theme context for styled components
 * @param themes - Map of theme names to theme objects
 * @param defaultTheme - Default theme object
 * @param prefix - Optional prefix for CSS variable scoping
 * @returns Provider component and theme management context
 */
export function createProvider(
  ThemeContext: Context<ThemeContextValue | null>,
  themes: Record<string, Theme>,
  defaultTheme: Theme,
  prefix = "",
): {
  Provider: ComponentType<ProviderProps>;
  ThemeManagementContext: Context<ThemeManagementContextValue | null>;
} {
  const ThemeManagementContext = createContext<ThemeManagementContextValue | null>(null);

  const availableThemeNames = Object.keys(themes);
  const firstThemeName = availableThemeNames[0] || "default";

  function Provider({
    attribute = "data-theme",
    children,
    defaultTheme: defaultThemeProp,
    storageKey = "stoop-theme",
  }: ProviderProps): JSX.Element {
    // Get initial theme from localStorage synchronously before first render
    const getInitialTheme = useCallback((): string => {
      if (typeof window === "undefined") {
        return defaultThemeProp || firstThemeName;
      }

      try {
        const stored = localStorage.getItem(storageKey);

        if (stored && themes[stored]) {
          return stored;
        }
      } catch {
        // Ignore localStorage errors
      }

      return defaultThemeProp || firstThemeName;
    }, [defaultThemeProp, storageKey]);

    const [themeName, setThemeNameState] = useState<string>(getInitialTheme);

    // Get current theme object based on theme name
    const currentTheme = useMemo(() => {
      return themes[themeName] || themes[defaultThemeProp || firstThemeName] || defaultTheme;
    }, [themeName, defaultThemeProp]);

    // Update CSS variables when theme changes (centralized, runs once per theme change)
    useLayoutEffect(() => {
      if (currentTheme) {
        updateThemeVariables(currentTheme, prefix);
      }
    }, [currentTheme]);

    // Update document attribute when theme changes
    useLayoutEffect(() => {
      if (typeof document !== "undefined" && attribute) {
        document.documentElement.setAttribute(attribute, themeName);
      }
    }, [themeName, attribute]);

    // Set theme function with localStorage persistence
    const setTheme = useCallback(
      (newThemeName: string) => {
        if (themes[newThemeName]) {
          setThemeNameState(newThemeName);

          // Persist to localStorage
          try {
            localStorage.setItem(storageKey, newThemeName);
          } catch {
            // Ignore storage errors
          }
        } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${newThemeName}" not found. Available themes: ${availableThemeNames.join(", ")}`,
          );
        }
      },
      [storageKey],
    );

    const themeContextValue: ThemeContextValue = useMemo(
      () => ({
        theme: currentTheme,
        themeName,
      }),
      [currentTheme, themeName],
    );

    const toggleTheme = useCallback(() => {
      const currentIndex = availableThemeNames.indexOf(themeName);
      const nextIndex = (currentIndex + 1) % availableThemeNames.length;
      const newTheme = availableThemeNames[nextIndex];

      setTheme(newTheme);
    }, [themeName, setTheme]);

    const managementContextValue: ThemeManagementContextValue = useMemo(
      () => ({
        availableThemes: availableThemeNames,
        setTheme,
        theme: currentTheme,
        themeName,
        toggleTheme,
      }),
      [currentTheme, themeName, setTheme, toggleTheme],
    );

    return (
      <ThemeContext.Provider value={themeContextValue}>
        <ThemeManagementContext.Provider value={managementContextValue}>
          {children}
        </ThemeManagementContext.Provider>
      </ThemeContext.Provider>
    );
  }

  return {
    Provider,
    ThemeManagementContext,
  };
}
