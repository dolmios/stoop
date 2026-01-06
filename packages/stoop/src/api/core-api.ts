/**
 * Core API functions.
 * Consolidates theme creation, CSS class generation, and keyframes animation APIs.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { LRUCache } from "../core/cache";
import { compileCSS, cssObjectToString } from "../core/compiler";
import { sanitizeCSSPropertyName } from "../core/stringify";
import { mergeThemes } from "../core/theme-manager";
import { injectCSS } from "../inject";
import { applyUtilities, validateTheme } from "../utils/helpers";
import { replaceThemeTokensWithVars } from "../utils/theme";
import { hashObject, sanitizePrefix, validateKeyframeKey } from "../utils/theme-utils";

// ============================================================================
// Theme Creation API
// ============================================================================

/**
 * Creates a function that extends a base theme with overrides.
 * The returned function deep merges theme overrides with the base theme.
 *
 * @param baseTheme - Base theme to extend
 * @returns Function that accepts theme overrides and returns a merged theme
 */
export function createTheme(baseTheme: Theme): (themeOverrides?: Partial<Theme>) => Theme {
  return function createTheme(themeOverrides: Partial<Theme> = {}): Theme {
    const validatedOverrides = validateTheme(themeOverrides);

    return mergeThemes(baseTheme, validatedOverrides);
  };
}

// ============================================================================
// CSS Class Generation API
// ============================================================================

/**
 * Creates a CSS function that compiles CSS objects into class names.
 *
 * @param defaultTheme - Default theme for token resolution
 * @param prefix - Optional prefix for generated class names
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @returns Function that accepts CSS objects and returns class names
 */
export function createCSSFunction(
  defaultTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
): (styles: CSS) => string {
  return function css(styles: CSS): string {
    return compileCSS(styles, defaultTheme, prefix, media, utils, themeMap);
  };
}

// ============================================================================
// Keyframes Animation API
// ============================================================================

/**
 * Converts a keyframes object to a CSS @keyframes rule string.
 *
 * @param keyframesObj - Keyframes object with percentage/from/to keys
 * @param animationName - Name for the animation
 * @param theme - Optional theme for token resolution
 * @param themeMap - Optional theme scale mappings
 * @returns CSS @keyframes rule string
 */
function keyframesToCSS(
  keyframesObj: Record<string, CSS>,
  animationName: string,
  theme?: Theme,
  themeMap?: Record<string, ThemeScale>,
): string {
  let css = `@keyframes ${animationName} {`;

  const sortedKeys = Object.keys(keyframesObj).sort((a, b) => {
    const aNum = parseFloat(a.replace("%", ""));
    const bNum = parseFloat(b.replace("%", ""));

    if (a === "from") {
      return -1;
    }
    if (b === "from") {
      return 1;
    }
    if (a === "to") {
      return 1;
    }
    if (b === "to") {
      return -1;
    }

    return aNum - bNum;
  });

  for (const key of sortedKeys) {
    if (!validateKeyframeKey(key)) {
      continue;
    }

    const styles = keyframesObj[key];

    if (!styles || typeof styles !== "object") {
      continue;
    }

    css += ` ${key} {`;

    const themedStyles = replaceThemeTokensWithVars(styles, theme, themeMap);

    // Sort properties for deterministic CSS generation
    const sortedProps = Object.keys(themedStyles).sort();

    for (const prop of sortedProps) {
      const value = themedStyles[prop];

      if (value !== undefined && (typeof value === "string" || typeof value === "number")) {
        const sanitizedProp = sanitizeCSSPropertyName(prop);

        if (sanitizedProp) {
          // Don't escape keyframe values - escaping breaks complex CSS functions
          const cssValue = String(value);

          css += ` ${sanitizedProp}: ${cssValue};`;
        }
      }
    }

    css += " }";
  }

  css += " }";

  return css;
}

import { KEYFRAME_CACHE_LIMIT } from "../constants";

/**
 * Creates a keyframes animation function.
 * Generates and injects @keyframes rules with caching to prevent duplicates.
 *
 * @param prefix - Optional prefix for animation names
 * @param theme - Optional theme for token resolution
 * @param themeMap - Optional theme scale mappings
 * @returns Function that accepts keyframes objects and returns animation names
 */
export function createKeyframesFunction(
  prefix = "stoop",
  theme?: Theme,
  themeMap?: Record<string, ThemeScale>,
): (keyframes: Record<string, CSS>) => string {
  const sanitizedPrefix = sanitizePrefix(prefix);
  const animationCache = new LRUCache<string, string>(KEYFRAME_CACHE_LIMIT);

  return function keyframes(keyframesObj: Record<string, CSS>): string {
    const keyframesKey = hashObject(keyframesObj);
    const cachedName = animationCache.get(keyframesKey);

    if (cachedName) {
      return cachedName;
    }

    const hashValue = keyframesKey.slice(0, 8);
    const animationName = sanitizedPrefix
      ? `${sanitizedPrefix}-${hashValue}`
      : `stoop-${hashValue}`;

    const css = keyframesToCSS(keyframesObj, animationName, theme, themeMap);
    const ruleKey = `__keyframes_${animationName}`;

    injectCSS(css, sanitizedPrefix, ruleKey);
    animationCache.set(keyframesKey, animationName);

    return animationName;
  };
}

// ============================================================================
// Global CSS Injection API
// ============================================================================

/**
 * Creates a global CSS injection function.
 * Injects styles directly into the document with deduplication support.
 * Supports media queries, nested selectors, and theme tokens.
 *
 * @param defaultTheme - Default theme for token resolution
 * @param prefix - Optional prefix for CSS rules
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @returns Function that accepts CSS objects and returns a cleanup function
 */
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

    // Empty selector for global CSS (no base selector needed)
    const cssText = cssObjectToString(themedStyles, "", 0, media);

    injectCSS(cssText, sanitizedPrefix, `__global_${cssKey}`);

    return () => {
      globalInjectedStyles.delete(cssKey);
    };
  };
}
