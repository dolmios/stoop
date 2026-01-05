/**
 * Global CSS injection API.
 * Creates a function that injects global styles into the document.
 * Supports media queries, nested selectors, and theme tokens.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { cssObjectToString } from "../core/compiler";
import { injectCSS } from "../inject";
import { applyUtilities } from "../utils/helpers";
import { replaceThemeTokensWithVars } from "../utils/theme";
import { hashObject, sanitizePrefix } from "../utils/theme-utils";

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
// Use CSS hash as key instead of theme object reference for better deduplication
const globalInjectedStyles = new Set<string>();

export function createGlobalCSSFunction(
  defaultTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
) {
  return function globalCss(styles: CSS): () => void {
    const cssKey = hashObject(styles);

    if (globalInjectedStyles.has(cssKey)) {
      return () => {};
    }

    globalInjectedStyles.add(cssKey);

    const sanitizedPrefix = sanitizePrefix(prefix);

    const stylesWithUtils = applyUtilities(styles, utils);
    const themedStyles = replaceThemeTokensWithVars(stylesWithUtils, defaultTheme, themeMap);

    // Use cssObjectToString from compiler.ts instead of duplicate generateGlobalCSS
    // Empty selector for global CSS (no base selector needed)
    const cssText = cssObjectToString(themedStyles, "", 0, media);

    injectCSS(cssText, sanitizedPrefix, `__global_${cssKey}`);

    return () => {
      globalInjectedStyles.delete(cssKey);
    };
  };
}
