/**
 * Theme extension API.
 * Creates a function that deep merges theme overrides with a base theme.
 */

import type { Theme } from "../types";

import { isThemeObject } from "../utils/type-guards";

export function createCreateThemeFunction(
  baseTheme: Theme,
): (themeOverrides: Partial<Theme>) => Theme {
  return function createTheme(themeOverrides: Partial<Theme>): Theme {
    function deepMerge(target: Theme, source: Partial<Theme>): Theme {
      const result = { ...target };

      for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (isThemeObject(sourceValue) && isThemeObject(targetValue)) {
          result[key] = deepMerge(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
          result[key] = sourceValue as Theme[Extract<keyof Theme, string>];
        }
      }

      return result;
    }

    return deepMerge(baseTheme, themeOverrides);
  };
}
