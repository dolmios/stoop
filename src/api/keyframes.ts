/**
 * CSS keyframes animation API.
 * Creates a function that generates and injects @keyframes rules.
 * Caches animations by content hash to prevent duplicates.
 */

import type { CSS, Theme, ThemeScale } from "../types";

import { injectCSS } from "../inject";
import {
  escapeCSSValue,
  hashObject,
  sanitizeCSSPropertyName,
  sanitizePrefix,
  validateKeyframeKey,
} from "../utils/string";
import { replaceThemeTokensWithVars } from "../utils/theme";

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

    for (const prop in themedStyles) {
      const value = themedStyles[prop];

      if (value !== undefined && (typeof value === "string" || typeof value === "number")) {
        const sanitizedProp = sanitizeCSSPropertyName(prop);

        if (sanitizedProp) {
          const escapedValue = escapeCSSValue(value);

          css += ` ${sanitizedProp}: ${escapedValue};`;
        }
      }
    }

    css += " }";
  }

  css += " }";

  return css;
}

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
  prefix = "",
  theme?: Theme,
  themeMap?: Record<string, ThemeScale>,
): (keyframes: Record<string, CSS>) => string {
  const sanitizedPrefix = sanitizePrefix(prefix);
  const animationCache = new Map<string, string>();

  return function keyframes(keyframesObj: Record<string, CSS>): string {
    const keyframesKey = hashObject(keyframesObj);
    const cachedName = animationCache.get(keyframesKey);

    if (cachedName) {
      return cachedName;
    }

    const hashValue = keyframesKey.slice(0, 8);
    const animationName = sanitizedPrefix ? `${sanitizedPrefix}-${hashValue}` : `stoop-${hashValue}`;

    const css = keyframesToCSS(keyframesObj, animationName, theme, themeMap);
    const ruleKey = `__keyframes_${animationName}`;

    injectCSS(css, sanitizedPrefix, ruleKey);
    animationCache.set(keyframesKey, animationName);

    return animationName;
  };
}
