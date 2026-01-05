/**
 * Storage and theme detection utilities.
 * Provides simplified localStorage and cookie management, plus automatic theme selection.
 * Supports SSR compatibility and error handling.
 */

import type {
  Theme,
  ThemeDetectionOptions,
  ThemeDetectionResult,
  StorageOptions,
  StorageResult,
} from "../types";

import { DEFAULT_COOKIE_MAX_AGE, DEFAULT_COOKIE_PATH } from "../constants";
import { isBrowser } from "./helpers";

// ============================================================================
// Storage Utilities
// ============================================================================

/**
 * Parses a JSON value safely.
 *
 * @param value - String value to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Safely gets a value from localStorage.
 *
 * @param key - Storage key
 * @returns Storage result
 */
export function getFromStorage(key: string): StorageResult<string | null> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: null };
  }

  try {
    const value = localStorage.getItem(key);

    return { source: "localStorage", success: true, value };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage access failed",
      success: false,
      value: null,
    };
  }
}

/**
 * Safely sets a value in localStorage.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @returns Storage result
 */
export function setInStorage(key: string, value: string): StorageResult<void> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: undefined };
  }

  try {
    localStorage.setItem(key, value);

    return { success: true, value: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage write failed",
      success: false,
      value: undefined,
    };
  }
}

/**
 * Safely removes a value from localStorage.
 *
 * @param key - Storage key
 * @returns Storage result
 */
export function removeFromStorage(key: string): StorageResult<void> {
  if (!isBrowser()) {
    return { error: "Not in browser environment", success: false, value: undefined };
  }

  try {
    localStorage.removeItem(key);

    return { success: true, value: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "localStorage remove failed",
      success: false,
      value: undefined,
    };
  }
}

/**
 * Gets a cookie value.
 *
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

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
 * @param options - Cookie options
 * @returns Success status
 */
export function setCookie(
  name: string,
  value: string,
  options: Omit<StorageOptions, "type"> & { maxAge?: number; path?: string; secure?: boolean } = {},
): boolean {
  if (!isBrowser()) return false;

  const { maxAge = DEFAULT_COOKIE_MAX_AGE, path = DEFAULT_COOKIE_PATH, secure = false } = options;

  try {
    document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}${secure ? "; secure" : ""}`;

    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a cookie by setting it to expire.
 *
 * @param name - Cookie name
 * @param path - Cookie path
 * @returns Success status
 */
export function removeCookie(name: string, path = "/"): boolean {
  if (!isBrowser()) return false;

  try {
    document.cookie = `${name}=; path=${path}; max-age=0`;

    return true;
  } catch {
    return false;
  }
}

/**
 * Unified storage API that works with both localStorage and cookies.
 *
 * @param key - Storage key
 * @param options - Storage options
 * @returns Storage result
 */
export function getStorage(
  key: string,
  options: StorageOptions = {},
): StorageResult<string | null> {
  const { type = "localStorage" } = options;

  if (type === "cookie") {
    const value = getCookie(key);

    return {
      source: "cookie",
      success: value !== null,
      value,
    };
  }

  return getFromStorage(key);
}

/**
 * Unified storage API that works with both localStorage and cookies.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 * @returns Storage result
 */
export function setStorage(
  key: string,
  value: string,
  options: StorageOptions = {},
): StorageResult<void> {
  const { type = "localStorage" } = options;

  if (type === "cookie") {
    const success = setCookie(key, value, options);

    return {
      error: success ? undefined : "Cookie write failed",
      success,
      value: undefined,
    };
  }

  return setInStorage(key, value);
}

/**
 * Unified storage API that works with both localStorage and cookies.
 *
 * @param key - Storage key
 * @param options - Storage options
 * @returns Storage result
 */
export function removeStorage(key: string, options: StorageOptions = {}): StorageResult<void> {
  const { type = "localStorage" } = options;

  if (type === "cookie") {
    const success = removeCookie(key, options.path);

    return {
      error: success ? undefined : "Cookie remove failed",
      success,
      value: undefined,
    };
  }

  return removeFromStorage(key);
}

/**
 * Gets a JSON value from storage with automatic parsing.
 *
 * @param key - Storage key
 * @param fallback - Fallback value if parsing fails or key not found
 * @param options - Storage options
 * @returns Parsed JSON value or fallback
 */
export function getJsonFromStorage<T>(
  key: string,
  fallback: T,
  options: StorageOptions = {},
): StorageResult<T> {
  const result = getStorage(key, options);

  if (!result.success || result.value === null) {
    return { ...result, value: fallback };
  }

  const parsed = safeJsonParse(result.value, fallback);

  return { ...result, value: parsed };
}

/**
 * Sets a JSON value in storage with automatic serialization.
 *
 * @param key - Storage key
 * @param value - Value to serialize and store
 * @param options - Storage options
 * @returns Storage result
 */
export function setJsonInStorage<T>(
  key: string,
  value: T,
  options: StorageOptions = {},
): StorageResult<void> {
  try {
    const serialized = JSON.stringify(value);

    return setStorage(key, serialized, options);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "JSON serialization failed",
      success: false,
      value: undefined,
    };
  }
}

/**
 * Creates a typed storage interface for a specific key.
 *
 * @param key - Storage key
 * @param options - Storage options
 * @returns Typed storage interface
 */
export function createStorage<T = string>(
  key: string,
  options: StorageOptions = {},
): {
  get: () => StorageResult<string | null>;
  getJson: (fallback: T) => StorageResult<T>;
  remove: () => StorageResult<void>;
  set: (value: string) => StorageResult<void>;
  setJson: (value: T) => StorageResult<void>;
} {
  return {
    get: (): StorageResult<string | null> => getStorage(key, options),
    getJson: (fallback: T): StorageResult<T> => getJsonFromStorage(key, fallback, options),
    remove: (): StorageResult<void> => removeStorage(key, options),
    set: (value: string): StorageResult<void> => setStorage(key, value, options),
    setJson: (value: T): StorageResult<void> => setJsonInStorage(key, value, options),
  };
}

// ============================================================================
// Theme Detection Utilities
// ============================================================================

/**
 * Gets localStorage value safely (internal helper for theme detection).
 * Uses getFromStorage for consistency.
 *
 * @param key - Storage key
 * @returns Stored value or null if not found or access failed
 */
function getLocalStorage(key: string): string | null {
  const result = getFromStorage(key);

  return result.success ? result.value : null;
}

/**
 * Detects system color scheme preference.
 *
 * @returns 'dark' or 'light' based on system preference
 */
function getSystemPreference(): "dark" | "light" | null {
  if (!isBrowser()) return null;

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return null;
  }
}

/**
 * Validates if a theme name exists in available themes.
 *
 * @param themeName - Theme name to validate
 * @param themes - Available themes map
 * @returns True if theme is valid
 */
function isValidTheme(themeName: string, themes?: Record<string, Theme>): boolean {
  return !themes || !!themes[themeName];
}

/**
 * Detects the best theme to use based on multiple sources with priority.
 *
 * Priority order (highest to lowest):
 * 1. Explicit localStorage preference
 * 2. Cookie preference (for SSR compatibility)
 * 3. System color scheme preference
 * 4. Default theme
 *
 * @param options - Theme detection options
 * @returns Theme detection result
 */
export function detectTheme(options: ThemeDetectionOptions = {}): ThemeDetectionResult {
  const {
    cookie: cookieKey,
    default: defaultTheme = "light",
    localStorage: storageKey,
    systemPreference = true,
    themes,
  } = options;

  // 1. Check localStorage (highest priority - explicit user choice)
  if (storageKey) {
    const stored = getLocalStorage(storageKey);

    if (stored && isValidTheme(stored, themes)) {
      return {
        confidence: 0.9, // High confidence - explicit user choice
        source: "localStorage",
        theme: stored,
      };
    }
  }

  // 2. Check cookie (for SSR compatibility)
  if (cookieKey) {
    const cookieValue = getCookie(cookieKey);

    if (cookieValue && isValidTheme(cookieValue, themes)) {
      return {
        confidence: 0.8, // High confidence - persisted preference
        source: "cookie",
        theme: cookieValue,
      };
    }
  }

  // 3. Check system preference
  if (systemPreference) {
    const system = getSystemPreference();

    if (system && isValidTheme(system, themes)) {
      return {
        confidence: 0.6, // Medium confidence - system default
        source: "system",
        theme: system,
      };
    }
  }

  // 4. Fall back to default
  return {
    confidence: 0.3, // Low confidence - fallback only
    source: "default",
    theme: defaultTheme,
  };
}

/**
 * Creates a theme detector function with pre-configured options.
 *
 * @param options - Theme detection options
 * @returns Theme detection function
 */
export function createThemeDetector(options: ThemeDetectionOptions): () => ThemeDetectionResult {
  return (): ThemeDetectionResult => detectTheme(options);
}

/**
 * Auto-detects theme for SSR contexts (server-side or during hydration).
 * Uses only cookie and default sources since localStorage isn't available.
 *
 * @param options - Theme detection options
 * @returns Theme name
 */
export function detectThemeForSSR(options: ThemeDetectionOptions = {}): string {
  const { cookie: cookieKey, default: defaultTheme = "light", themes } = options;

  // Only check cookie in SSR context
  if (cookieKey) {
    const cookieValue = getCookie(cookieKey);

    if (cookieValue && isValidTheme(cookieValue, themes)) {
      return cookieValue;
    }
  }

  return defaultTheme;
}

/**
 * Listens for system theme changes and calls callback when changed.
 *
 * @param callback - Function to call when system theme changes
 * @returns Cleanup function
 */
export function onSystemThemeChange(callback: (theme: "dark" | "light") => void): () => void {
  if (!isBrowser()) {
    return () => {}; // No-op in SSR
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent): void => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}
