"use client";

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

import type {
  ProviderProps,
  Theme,
  ThemeContextValue,
  ThemeManagementContextValue,
} from "../types";

import { updateThemeVariables } from "../core/theme-manager";
import { isBrowser } from "../utils/environment";

/**
 * Creates a Provider component for theme management.
 *
 * @param themes - Map of theme names to theme objects
 * @param defaultTheme - Default theme object
 * @param prefix - Optional prefix for CSS variable scoping
 * @returns Provider component, theme context, and theme management context
 */
export function createProvider(
  themes: Record<string, Theme>,
  defaultTheme: Theme,
  prefix = "stoop",
): {
  Provider: ComponentType<ProviderProps>;
  ThemeContext: Context<ThemeContextValue | null>;
  ThemeManagementContext: Context<ThemeManagementContextValue | null>;
} {
  const ThemeContext = createContext<ThemeContextValue | null>(null);
  const ThemeManagementContext = createContext<ThemeManagementContextValue | null>(null);

  const availableThemeNames = Object.keys(themes);
  const firstThemeName = availableThemeNames[0] || "default";

  function Provider({
    attribute = "data-theme",
    children,
    defaultTheme: defaultThemeProp,
    storageKey = "stoop-theme",
  }: ProviderProps): JSX.Element {
    // SSR-safe initialization: always start with default, then hydrate from localStorage
    const [themeName, setThemeNameState] = useState<string>(() => {
      // During SSR, always return the default theme
      if (!isBrowser()) {
        return defaultThemeProp || firstThemeName;
      }

      // On client, try to read from localStorage
      try {
        const stored = localStorage.getItem(storageKey);

        if (stored && themes[stored]) {
          return stored;
        }
      } catch {
        // localStorage access failed (e.g., in private browsing mode)
      }

      return defaultThemeProp || firstThemeName;
    });

    // Hydrate from localStorage after mount to prevent hydration mismatch
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      try {
        const stored = localStorage.getItem(storageKey);

        if (stored && themes[stored] && stored !== themeName) {
          setThemeNameState(stored);
        }
      } catch {
        // localStorage access failed
      }
    }, [storageKey, themeName]);

    const currentTheme = useMemo(() => {
      return themes[themeName] || themes[defaultThemeProp || firstThemeName] || defaultTheme;
    }, [themeName, defaultThemeProp, firstThemeName, themes]);

    useLayoutEffect(() => {
      if (currentTheme) {
        updateThemeVariables(currentTheme, prefix);
      }
    }, [currentTheme, prefix]);

    useLayoutEffect(() => {
      if (isBrowser() && attribute) {
        document.documentElement.setAttribute(attribute, themeName);
      }
    }, [themeName, attribute]);

    const setTheme = useCallback(
      (newThemeName: string) => {
        if (themes[newThemeName]) {
          setThemeNameState(newThemeName);

          try {
            localStorage.setItem(storageKey, newThemeName);
          } catch {
            // localStorage access failed (e.g., in private browsing mode)
          }
        } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${newThemeName}" not found. Available themes: ${availableThemeNames.join(", ")}`,
          );
        }
      },
      [storageKey, themes, availableThemeNames],
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
    ThemeContext,
    ThemeManagementContext,
  };
}
