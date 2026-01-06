/**
 * Theme variable management.
 * Updates CSS custom properties when theme changes and merges themes with the default theme.
 */

import type { Theme } from "../types";

import { injectAllThemeVariables } from "../inject";
import { isBrowser } from "../utils/helpers";
import { generateAllThemeVariables, themesAreEqual } from "../utils/theme";

const defaultThemes = new Map<string, Theme>();

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
export function getDefaultTheme(prefix = "stoop"): Theme | null {
  const sanitizedPrefix = prefix || "";

  return defaultThemes.get(sanitizedPrefix) || null;
}

/**
 * Merges source theme into target theme, handling nested objects.
 *
 * @param target - Target theme to merge into
 * @param source - Source theme to merge from
 * @returns Merged theme
 */
export function mergeThemes(target: Theme, source: Theme | Partial<Theme>): Theme {
  const merged: Theme = { ...target };
  const sourceKeys = Object.keys(source) as Array<keyof Theme>;

  for (const key of sourceKeys) {
    if (key === "media") {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = { ...targetValue, ...sourceValue };
    } else if (sourceValue !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = sourceValue;
    }
  }

  return merged;
}

/**
 * Merges a theme with the default theme, ensuring all themes extend the default theme.
 *
 * @param theme - Theme to merge
 * @param prefix - Optional prefix for theme scoping
 * @returns Merged theme (or original if it's the default theme)
 */
export function mergeWithDefaultTheme(theme: Theme, prefix = "stoop"): Theme {
  const defaultTheme = getDefaultTheme(prefix);

  if (!defaultTheme) {
    return theme;
  }

  if (themesAreEqual(theme, defaultTheme)) {
    return theme;
  }

  return mergeThemes(defaultTheme, theme);
}

/**
 * Injects CSS variables for all themes using attribute selectors.
 * All themes are available simultaneously, with theme switching handled by changing the data-theme attribute.
 *
 * @param themes - Map of theme names to theme objects
 * @param prefix - Optional prefix for CSS variable names
 * @param attribute - Attribute name for theme selection (defaults to 'data-theme')
 */
export function injectAllThemes(
  themes: Record<string, Theme>,
  prefix = "stoop",
  attribute = "data-theme",
): void {
  if (!isBrowser()) {
    return;
  }

  const mergedThemes: Record<string, Theme> = {};

  for (const [themeName, theme] of Object.entries(themes)) {
    mergedThemes[themeName] = mergeWithDefaultTheme(theme, prefix);
  }

  const allThemeVars = generateAllThemeVariables(mergedThemes, prefix, attribute);

  injectAllThemeVariables(allThemeVars, prefix);
}
