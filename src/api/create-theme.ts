/**
 * Theme extension API.
 * Creates a function that deep merges theme overrides with a base theme.
 */

import type { Theme, ThemeScale } from "../types";

import { validateTheme } from "../utils/theme-validation";
import { isThemeObject } from "../utils/type-guards";

/**
 * Creates a function that extends a base theme with overrides.
 * The returned function deep merges theme overrides with the base theme.
 *
 * @param baseTheme - Base theme to extend
 * @returns Function that accepts theme overrides and returns a merged theme
 */
export function createTheme(
  baseTheme: Theme,
): (themeOverrides: Partial<Theme>) => Theme {
  return function createTheme(themeOverrides: Partial<Theme>): Theme {
    const validatedOverrides = validateTheme(themeOverrides);

    function deepMerge(target: Theme, source: Partial<Theme>): Theme {
      // Start with a copy of the target to preserve all properties
      const result = { ...target };

      // Merge all keys from source, but preserve target keys that aren't in source
      const sourceKeys = Object.keys(source) as Array<ThemeScale>;

      for (const key of sourceKeys) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (isThemeObject(sourceValue) && isThemeObject(targetValue)) {
          // Deep merge nested objects (e.g., colors, space, etc.)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[key] = { ...targetValue, ...sourceValue };
        } else if (sourceValue !== undefined) {
          // Replace entire scale if source provides a new value
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[key] = sourceValue;
        }
      }

      // Ensure all target keys are preserved (in case source doesn't have them)
      const targetKeys = Object.keys(target) as Array<ThemeScale>;

      for (const key of targetKeys) {
        if (!(key in result)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[key] = target[key];
        }
      }

      return result;
    }

    return deepMerge(baseTheme, validatedOverrides);
  };
}
