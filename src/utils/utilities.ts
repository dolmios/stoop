/**
 * Utility function application.
 * Applies utility functions (e.g., px, py) to transform shorthand properties into CSS.
 * Recursively processes nested CSS objects.
 */

import type { CSS, CSSPropertyValue, UtilityFunction } from "../types";

import { isCSSObject } from "./type-guards";

export function applyUtilities(styles: CSS, utils?: Record<string, UtilityFunction>): CSS {
  if (!utils || !styles || typeof styles !== "object") {
    return styles;
  }

  const result: CSS = {};
  const utilityKeys = Object.keys(utils);

  for (const key in styles) {
    const value = styles[key];

    if (utilityKeys.includes(key) && utils[key]) {
      try {
        const utilityResult = utils[key](value as CSSPropertyValue | CSS);

        if (utilityResult && typeof utilityResult === "object") {
          Object.assign(result, utilityResult);
        }
      } catch {
        result[key] = value;
      }
    } else if (isCSSObject(value)) {
      result[key] = applyUtilities(value, utils);
    } else {
      result[key] = value;
    }
  }

  return result;
}
