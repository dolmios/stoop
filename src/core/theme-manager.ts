/**
 * Theme variable management.
 * Updates CSS custom properties when theme changes.
 * Ensures CSS variables are injected and kept in sync with theme updates.
 * Automatically merges themes with the default theme when applied.
 */

import type { Theme } from "../types";

import { injectThemeVariables } from "../inject";
import { generateCSSVariables, themesAreEqual } from "../utils/theme";

// Store default themes per prefix
const defaultThemes = new Map<string, Theme>();

/**
 * Registers the default theme for a given prefix.
 * Called automatically by createStoop.
 *
 * @param theme - Default theme from createStoop
 * @param prefix - Optional prefix for theme scoping
 */
export function registerDefaultTheme(theme: Theme, prefix = ""): void {
  const sanitizedPrefix = prefix || "";

  defaultThemes.set(sanitizedPrefix, theme);
}

/**
 * Gets the default theme for a given prefix.
 *
 * @param prefix - Optional prefix for theme scoping
 * @returns Default theme or null if not registered
 */
export function getDefaultTheme(prefix = ""): Theme | null {
  const sanitizedPrefix = prefix || "";

  return defaultThemes.get(sanitizedPrefix) || null;
}

/**
 * Merges a theme with the default theme if it's not already the default theme.
 * This ensures all themes extend the default theme, keeping all original properties.
 * Always merges to guarantee correctness - merging is cheap and ensures safety.
 *
 * @param theme - Theme to merge
 * @param prefix - Optional prefix for theme scoping
 * @returns Merged theme (or original if it's the default theme)
 */
function mergeWithDefaultTheme(theme: Theme, prefix = ""): Theme {
  const defaultTheme = getDefaultTheme(prefix);

  if (!defaultTheme) {
    // No default theme registered yet, return as-is
    return theme;
  }

  // If this is already the default theme, return as-is
  if (themesAreEqual(theme, defaultTheme)) {
    return theme;
  }

  // Always merge theme with default theme to ensure all properties are present
  // This guarantees correctness even if themes created with createTheme are passed
  // Start with default theme and overlay the provided theme
  const merged: Theme = { ...defaultTheme };

  // Type-safe iteration over theme keys
  const allThemeKeys = Object.keys(theme) as Array<keyof Theme>;

  for (const key of allThemeKeys) {
    if (key === "media") {
      // Preserve media from default theme, don't override
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
      // Deep merge nested objects (e.g., colors, space, etc.)
      // This ensures all default values are preserved, with theme overrides applied
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = { ...defaultValue, ...themeValue };
    } else if (themeValue !== undefined) {
      // Replace entire scale if theme provides a new value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = themeValue;
    }
  }

  return merged;
}

/**
 * Updates CSS custom properties when theme changes.
 * Automatically merges the theme with the default theme to ensure all properties are present.
 *
 * @param theme - Theme object to generate CSS variables from
 * @param prefix - Optional prefix for CSS variable names
 */
export function updateThemeVariables(theme: Theme, prefix = ""): void {
  if (typeof document === "undefined") {
    return;
  }

  // Merge theme with default theme to ensure all properties are present
  const mergedTheme = mergeWithDefaultTheme(theme, prefix);
  const cssVars = generateCSSVariables(mergedTheme, prefix);

  injectThemeVariables(cssVars, mergedTheme, prefix);
}
