/**
 * Global CSS injection API.
 * Creates a function that injects global styles into the document.
 * Supports media queries, nested selectors, and theme tokens.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { MAX_CSS_NESTING_DEPTH } from "../constants";
import { injectCSS } from "../inject";
import {
  escapeCSSValue,
  hashObject,
  sanitizeCSSPropertyName,
  sanitizeCSSSelector,
  sanitizeMediaQuery,
  sanitizePrefix,
} from "../utils/string";
import { replaceThemeTokensWithVars } from "../utils/theme";
import { isCSSObject } from "../utils/type-guards";
import { applyUtilities } from "../utils/utilities";

/**
 * Creates a global CSS injection function.
 * Injects styles directly into the document with deduplication support.
 *
 * @param defaultTheme - Default theme for token resolution
 * @param prefix - Optional prefix for CSS rules
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @returns Function that accepts CSS objects and returns a cleanup function
 */
// Global Set to track injected global CSS across all instances
// This prevents the bug where multiple Stoop instances would share the same closure-scoped Set
const globalInjectedStyles = new WeakMap<Theme, Set<string>>();

function getInjectedSet(theme: Theme): Set<string> {
  let set = globalInjectedStyles.get(theme);

  if (!set) {
    set = new Set<string>();
    globalInjectedStyles.set(theme, set);
  }

  return set;
}

export function createGlobalCSSFunction(
  defaultTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
) {
  return function globalCss(styles: CSS): () => void {
    if (typeof document === "undefined") {
      return () => {};
    }

    const injected = getInjectedSet(defaultTheme);
    const cssKey = hashObject(styles);

    if (injected.has(cssKey)) {
      return () => {};
    }

    injected.add(cssKey);

    function generateGlobalCSS(obj: CSS, depth = 0): string {
      if (depth > MAX_CSS_NESTING_DEPTH) {
        return "";
      }

      let result = "";

      // FIXED: Sort keys for deterministic CSS generation
      const sortedEntries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));

      sortedEntries.forEach(([key, value]) => {
        if (isCSSObject(value)) {
          if (media && key in media) {
            const mediaQuery = sanitizeMediaQuery(media[key]);

            if (mediaQuery) {
            const nestedCss = generateGlobalCSS(value, depth + 1);

            result += `${mediaQuery} { ${nestedCss} }`;
            }
          } else if (key.startsWith("@")) {
            const sanitizedKey = sanitizeCSSSelector(key);

            if (sanitizedKey) {
            const nestedCss = generateGlobalCSS(value, depth + 1);

              result += `${sanitizedKey} { ${nestedCss} }`;
            }
          } else {
            const sanitizedKey = sanitizeCSSSelector(key);

            if (sanitizedKey) {
            const nestedCss = generateGlobalCSS(value, depth + 1);

              result += `${sanitizedKey} { ${nestedCss} }`;
            }
          }
        } else if (value !== undefined) {
          const property = sanitizeCSSPropertyName(key);

          if (property && (typeof value === "string" || typeof value === "number")) {
            const escapedValue = escapeCSSValue(value);

            result += `${property}: ${escapedValue}; `;
          }
        }
      });

      return result;
    }

    const sanitizedPrefix = sanitizePrefix(prefix);
    const stylesWithUtils = applyUtilities(styles, utils);
    const themedStyles = replaceThemeTokensWithVars(stylesWithUtils, defaultTheme, themeMap);

    const cssText = generateGlobalCSS(themedStyles);

    injectCSS(cssText, sanitizedPrefix, `__global_${cssKey}`);

    return () => {
      injected.delete(cssKey);
    };
  };
}
