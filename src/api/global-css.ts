/**
 * Global CSS injection API.
 * Creates a function that injects global styles into the document.
 * Supports media queries, nested selectors, and theme tokens.
 */

import type { CSS, Theme, UtilityFunction } from "../types";

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

export function createGlobalCSSFunction(
  defaultTheme: Theme,
  prefix = "",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
) {
  const injected = new Set<string>();

  return function globalCss(styles: CSS): () => void {
    if (typeof document === "undefined") {
      return () => {};
    }

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

      Object.entries(obj).forEach(([key, value]) => {
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
    const themedStyles = replaceThemeTokensWithVars(stylesWithUtils, defaultTheme);

    const cssText = generateGlobalCSS(themedStyles);

    injectCSS(cssText, sanitizedPrefix, `__global_${cssKey}`);

    return () => {
      injected.delete(cssKey);
    };
  };
}
