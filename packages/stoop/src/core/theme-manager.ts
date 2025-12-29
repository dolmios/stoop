/**
 * Theme variable management.
 * Updates CSS custom properties when theme changes.
 * Ensures CSS variables are injected and kept in sync with theme updates.
 * Automatically merges themes with the default theme when applied.
 */

import type { Theme } from "../types";

import { injectThemeVariables } from "../inject";
import { isBrowser } from "../utils/environment";
import { generateCSSVariables, themesAreEqual } from "../utils/theme";

const defaultThemes = new Map<string, Theme>();
const mergedThemeCache = new WeakMap<Theme, Map<string, Theme>>();

/**
 * Registers the default theme for a given prefix.
 * Called automatically by createStoop.
 *
 * @param theme - Default theme from createStoop
 * @param prefix - Optional prefix for theme scoping
 */
export function registerDefaultTheme(theme: Theme, prefix = "stoop"): void {
  const sanitizedPrefix = prefix || "";

  defaultThemes.set(sanitizedPrefix, theme);
}

/**
 * Gets the default theme for a given prefix.
 *
 * @param prefix - Optional prefix for theme scoping
 * @returns Default theme or null if not registered
 */
function getDefaultTheme(prefix = "stoop"): Theme | null {
  const sanitizedPrefix = prefix || "";

  return defaultThemes.get(sanitizedPrefix) || null;
}

/**
 * Merges a theme with the default theme if it's not already the default theme.
 * This ensures all themes extend the default theme, keeping all original properties.
 * Uses caching to avoid repeated merging of the same theme objects.
 *
 * @param theme - Theme to merge
 * @param prefix - Optional prefix for theme scoping
 * @returns Merged theme (or original if it's the default theme)
 */
function mergeWithDefaultTheme(theme: Theme, prefix = "stoop"): Theme {
  const defaultTheme = getDefaultTheme(prefix);

  if (!defaultTheme) {
    return theme;
  }

  if (themesAreEqual(theme, defaultTheme)) {
    return theme;
  }

  let prefixCache = mergedThemeCache.get(theme);

  if (!prefixCache) {
    prefixCache = new Map<string, Theme>();
    mergedThemeCache.set(theme, prefixCache);
  }

  const cached = prefixCache.get(prefix);

  if (cached) {
    return cached;
  }

  const merged: Theme = { ...defaultTheme };
  const allThemeKeys = Object.keys(theme) as Array<keyof Theme>;

  for (const key of allThemeKeys) {
    if (key === "media") {
      continue;
    }

    const themeValue = theme[key];
    const defaultValue = defaultTheme[key];

    if (
      themeValue &&
      typeof themeValue === "object" &&
      !Array.isArray(themeValue) &&
      defaultValue &&
      typeof defaultValue === "object" &&
      !Array.isArray(defaultValue)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = { ...defaultValue, ...themeValue };
    } else if (themeValue !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = themeValue;
    }
  }

  prefixCache.set(prefix, merged);

  return merged;
}

/**
 * Updates CSS custom properties when theme changes.
 *
 * @param theme - Theme object to generate CSS variables from
 * @param prefix - Optional prefix for CSS variable names
 */
export function updateThemeVariables(theme: Theme, prefix = "stoop"): void {
  if (!isBrowser()) {
    return;
  }

  const mergedTheme = mergeWithDefaultTheme(theme, prefix);
  const cssVars = generateCSSVariables(mergedTheme, prefix);

  injectThemeVariables(cssVars, mergedTheme, prefix);
}
