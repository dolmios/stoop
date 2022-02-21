/**
 * CSS keyframes animation API.
 * Creates a function that generates and injects @keyframes rules.
 * Caches animations by content hash to prevent duplicates.
 */

import type { CSS } from "../types";

import { injectCSS } from "../inject";
import {
  escapeCSSValue,
  hashObject,
  sanitizeCSSPropertyName,
  sanitizePrefix,
  validateKeyframeKey,
} from "../utils/string";

function keyframesToCSS(keyframesObj: Record<string, CSS>, animationName: string): string {
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
    // Validate keyframe key to prevent injection
    if (!validateKeyframeKey(key)) {
      continue;
    }

    const styles = keyframesObj[key];

    if (!styles || typeof styles !== "object") {
      continue;
    }

    css += ` ${key} {`;

    for (const prop in styles) {
      const value = styles[prop];

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

export function createKeyframesFunction(prefix = ""): (keyframes: Record<string, CSS>) => string {
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

    const css = keyframesToCSS(keyframesObj, animationName);
    const ruleKey = `__keyframes_${animationName}`;

    injectCSS(css, sanitizedPrefix, ruleKey);
    animationCache.set(keyframesKey, animationName);

    return animationName;
  };
}
