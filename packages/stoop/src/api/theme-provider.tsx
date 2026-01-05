"use client";

/**
 * Theme Provider component and hook.
 * Manages theme state, localStorage persistence, cookie sync, and centralized theme variable updates.
 * Includes the useTheme hook for accessing theme management context.
 */

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
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

import { injectAllThemes } from "../core/theme-manager";
import { isBrowser, isProduction } from "../utils/helpers";
import { getCookie, setCookie, getFromStorage, setInStorage } from "../utils/storage";

/**
 * Syncs a theme value between cookie and localStorage.
 * If cookie exists, syncs to localStorage. If localStorage exists, syncs to cookie.
 *
 * @param value - Theme value to sync
 * @param cookieKey - Cookie key (if undefined, cookie sync is skipped)
 * @param storageKey - LocalStorage key
 */
function syncThemeStorage(value: string, cookieKey: string | undefined, storageKey: string): void {
  if (!isBrowser()) {
    return;
  }

  const cookieValue = cookieKey ? getCookie(cookieKey) : null;
  const localStorageResult = getFromStorage(storageKey);
  const localStorageValue = localStorageResult.success ? localStorageResult.value : null;

  // Sync cookie -> localStorage
  if (cookieValue === value && localStorageValue !== value) {
    setInStorage(storageKey, value);
  }

  // Sync localStorage -> cookie
  if (localStorageValue === value && cookieKey && cookieValue !== value) {
    setCookie(cookieKey, value);
  }
}

/**
 * Reads theme from cookie or localStorage, preferring cookie if available.
 *
 * @param cookieKey - Cookie key (if undefined, cookie is not checked)
 * @param storageKey - LocalStorage key
 * @param themes - Available themes map for validation
 * @returns Theme name or null if not found or invalid
 */
function readThemeFromStorage(
  cookieKey: string | undefined,
  storageKey: string,
  themes: Record<string, Theme>,
): string | null {
  if (!isBrowser()) {
    return null;
  }

  // Try cookie first if cookieKey is provided
  if (cookieKey !== undefined) {
    const cookieValue = getCookie(cookieKey);

    if (cookieValue && themes[cookieValue]) {
      return cookieValue;
    }
  }

  // Fall back to localStorage
  const storageResult = getFromStorage(storageKey);
  const stored = storageResult.success ? storageResult.value : null;

  if (stored && themes[stored]) {
    return stored;
  }

  return null;
}

/**
 * Creates a Provider component for theme management.
 *
 * @param themes - Map of theme names to theme objects
 * @param defaultTheme - Default theme object
 * @param prefix - Optional prefix for CSS variable scoping
 * @param globalCss - Optional global CSS object from config
 * @param globalCssFunction - Optional globalCss function from createStoop
 * @returns Provider component, theme context, and theme management context
 *
 * @remarks
 * To prevent FOUC (Flash of Unstyled Content) when a user has a non-default theme stored,
 * call `preloadTheme()` from your stoop instance in a script tag before React hydrates:
 *
 * ```html
 * <script>
 *   // Read theme from storage and preload before React renders
 *   const storedTheme = localStorage.getItem('stoop-theme') || 'light';
 *   stoopInstance.preloadTheme(storedTheme);
 * </script>
 * ```
 */
export function createProvider(
  themes: Record<string, Theme>,
  defaultTheme: Theme,
  prefix = "stoop",
  globalCss?: import("../types").CSS,
  globalCssFunction?: import("../types").GlobalCSSFunction,
): {
  Provider: ComponentType<ProviderProps>;
  ThemeContext: Context<ThemeContextValue | null>;
  ThemeManagementContext: Context<ThemeManagementContextValue | null>;
} {
  const ThemeContext = createContext<ThemeContextValue | null>(null);
  const ThemeManagementContext = createContext<ThemeManagementContextValue | null>(null);

  const availableThemeNames = Object.keys(themes);
  const firstThemeName = availableThemeNames[0] || "default";

  // Create global styles function from config if provided
  const configGlobalStyles =
    globalCss && globalCssFunction ? globalCssFunction(globalCss) : undefined;

  function Provider({
    attribute = "data-theme",
    children,
    cookieKey,
    defaultTheme: defaultThemeProp,
    storageKey = "stoop-theme",
  }: ProviderProps): JSX.Element {
    // SSR-safe initialization: always start with default theme to match SSR
    // This prevents hydration mismatch - server always renders with default theme
    // Hydration will happen in useLayoutEffect to update to stored theme
    const [themeName, setThemeNameState] = useState<string>(defaultThemeProp || firstThemeName);

    // Track if hydration has occurred to prevent re-running hydration effect
    const hasHydratedRef = useRef(false);

    // Hydrate from cookie/localStorage after mount to prevent hydration mismatch
    // Only run once on mount - storage changes are handled by the storage event listener
    useLayoutEffect(() => {
      if (!isBrowser() || hasHydratedRef.current) {
        return;
      }

      const stored = readThemeFromStorage(cookieKey, storageKey, themes);

      if (stored) {
        // Sync between cookie and localStorage
        syncThemeStorage(stored, cookieKey, storageKey);

        // Only update if different from initial state to avoid unnecessary re-render
        if (stored !== themeName) {
          setThemeNameState(stored);
        }
      }

      hasHydratedRef.current = true;
    }, [cookieKey, storageKey, themes]); // Removed themeName from deps - only run once on mount

    // Listen for storage changes from other tabs/windows
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      const handleStorageChange = (e: StorageEvent): void => {
        if (e.key === storageKey && e.newValue && themes[e.newValue] && e.newValue !== themeName) {
          setThemeNameState(e.newValue);
          // Sync to cookie if cookieKey is provided
          syncThemeStorage(e.newValue, cookieKey, storageKey);
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return (): void => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, [storageKey, cookieKey, themeName, themes]);

    const currentTheme = useMemo(() => {
      return themes[themeName] || themes[defaultThemeProp || firstThemeName] || defaultTheme;
    }, [themeName, defaultThemeProp, firstThemeName, themes, defaultTheme]);

    // Track if themes and global styles have been injected
    const themesInjectedRef = useRef(false);
    const globalStylesInjectedRef = useRef(false);

    // Inject all theme CSS variables once on mount (before global styles and theme switching)
    // This ensures all themes are available simultaneously via attribute selectors
    useLayoutEffect(() => {
      if (!isBrowser() || themesInjectedRef.current) {
        return;
      }

      // Inject all themes using attribute selectors
      // This allows instant theme switching by only changing the data-theme attribute
      injectAllThemes(themes, prefix, attribute);
      themesInjectedRef.current = true;
    }, [themes, prefix, attribute]);

    // Inject global styles once on mount (after themes are injected)
    useLayoutEffect(() => {
      if (!isBrowser() || globalStylesInjectedRef.current) {
        return;
      }

      // Inject global styles from config
      // These use CSS variables, so they'll automatically work with all themes
      if (configGlobalStyles) {
        configGlobalStyles();
        globalStylesInjectedRef.current = true;
      }
    }, [configGlobalStyles]);

    // Update data-theme attribute when theme changes
    // No need to update CSS variables since all themes are already injected
    useLayoutEffect(() => {
      if (!isBrowser()) {
        return;
      }

      // Simply update the data-theme attribute - CSS variables are already available
      if (attribute) {
        document.documentElement.setAttribute(attribute, themeName);
      }
    }, [themeName, attribute]);

    const setTheme = useCallback(
      (newThemeName: string) => {
        if (themes[newThemeName]) {
          setThemeNameState(newThemeName);
          setInStorage(storageKey, newThemeName);
          syncThemeStorage(newThemeName, cookieKey, storageKey);
        } else if (!isProduction()) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Stoop] Theme "${newThemeName}" not found. Available themes: ${availableThemeNames.join(", ")}`,
          );
        }
      },
      [storageKey, cookieKey, themes, availableThemeNames, themeName],
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
    }, [themeName, setTheme, availableThemeNames]);

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

/**
 * Creates a useTheme hook for a specific theme management context.
 *
 * @param ThemeManagementContext - React context for theme management
 * @returns Hook function that returns theme management context value
 */
export function createUseThemeHook(
  ThemeManagementContext: Context<ThemeManagementContextValue | null>,
): () => ThemeManagementContextValue {
  return function useTheme(): ThemeManagementContextValue {
    const context = useContext(ThemeManagementContext);

    if (!context) {
      throw new Error("useTheme must be used within a Provider");
    }

    return context;
  };
}
