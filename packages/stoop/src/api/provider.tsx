"use client";

/**
 * Theme Provider component.
 * Manages theme state, localStorage persistence, cookie sync, and centralized theme variable updates.
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
 * Gets a cookie value by name.
 *
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
function getCookie(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

/**
 * Sets a cookie value.
 *
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Max age in seconds (defaults to 1 year)
 */
function setCookie(name: string, value: string, maxAge = 31536000): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

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
    cookieKey,
    defaultTheme: defaultThemeProp,
    storageKey = "stoop-theme",
  }: ProviderProps): JSX.Element {
    const effectiveCookieKey = cookieKey || storageKey;

    // SSR-safe initialization: always start with default, then hydrate from cookie/localStorage
    const [themeName, setThemeNameState] = useState<string>(() => {
      // During SSR, always return the default theme
      if (!isBrowser()) {
        return defaultThemeProp || firstThemeName;
      }

      // On client, try to read from cookie first (for SSR compatibility), then localStorage
      if (cookieKey !== undefined) {
        const cookieValue = getCookie(effectiveCookieKey);

        if (cookieValue && themes[cookieValue]) {
          // Sync to localStorage if cookie exists but localStorage doesn't
          try {
            const localStorageValue = localStorage.getItem(storageKey);

            if (localStorageValue !== cookieValue) {
              localStorage.setItem(storageKey, cookieValue);
            }
          } catch {
            // localStorage access failed (e.g., in private browsing mode)
          }

          return cookieValue;
        }
      }

      // Fall back to localStorage
      try {
        const stored = localStorage.getItem(storageKey);

        if (stored && themes[stored]) {
          // Sync to cookie if localStorage exists but cookie doesn't
          if (cookieKey !== undefined) {
            setCookie(effectiveCookieKey, stored);
          }

          return stored;
        }
      } catch {
        // localStorage access failed (e.g., in private browsing mode)
      }

      return defaultThemeProp || firstThemeName;
    });

    // Hydrate from cookie/localStorage after mount to prevent hydration mismatch
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      let stored: string | null = null;

      // Check cookie first if cookieKey is provided
      if (cookieKey !== undefined) {
        stored = getCookie(effectiveCookieKey);
      }

      // Fall back to localStorage if cookie not found
      if (!stored) {
        try {
          stored = localStorage.getItem(storageKey);
        } catch {
          // localStorage access failed
        }
      }

      if (stored && themes[stored] && stored !== themeName) {
        setThemeNameState(stored);
      }
    }, [storageKey, effectiveCookieKey, cookieKey, themes]);

    // Listen for storage changes from other tabs/windows
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      const handleStorageChange = (e: StorageEvent): void => {
        if (e.key === storageKey && e.newValue && themes[e.newValue] && e.newValue !== themeName) {
          setThemeNameState(e.newValue);
          // Sync to cookie if cookieKey is provided
          if (cookieKey !== undefined) {
            setCookie(effectiveCookieKey, e.newValue);
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return (): void => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, [storageKey, effectiveCookieKey, cookieKey, themeName, themes]);

    const currentTheme = useMemo(() => {
      return themes[themeName] || themes[defaultThemeProp || firstThemeName] || defaultTheme;
    }, [themeName, defaultThemeProp, firstThemeName, themes]);

    // Synchronously update CSS variables and data-theme attribute together to prevent FOUC
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      if (currentTheme) {
        // Update CSS variables first
        updateThemeVariables(currentTheme, prefix);
        // Immediately update data-theme attribute in the same frame
        if (attribute) {
          document.documentElement.setAttribute(attribute, themeName);
        }
      }
    }, [currentTheme, themeName, attribute, prefix]);

    const setTheme = useCallback(
      (newThemeName: string) => {
        if (themes[newThemeName]) {
          setThemeNameState(newThemeName);

          // Update localStorage
          try {
            localStorage.setItem(storageKey, newThemeName);
          } catch {
            // localStorage access failed (e.g., in private browsing mode)
          }

          // Update cookie if cookieKey is provided
          if (cookieKey !== undefined) {
            setCookie(effectiveCookieKey, newThemeName);
          }
        } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${newThemeName}" not found. Available themes: ${availableThemeNames.join(", ")}`,
          );
        }
      },
      [storageKey, effectiveCookieKey, cookieKey, themes, availableThemeNames],
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
