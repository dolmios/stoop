/**
 * CSS compilation engine.
 * Converts CSS objects to CSS strings and generates unique class names.
 * Handles nested selectors, media queries, styled component targeting, and theme tokens.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { MAX_CSS_NESTING_DEPTH, STOOP_COMPONENT_SYMBOL } from "../constants";
import { injectCSS } from "../inject";
import {
  escapeCSSValue,
  hash,
  sanitizeCSSPropertyName,
  sanitizeCSSSelector,
  sanitizeMediaQuery,
  sanitizePrefix,
} from "../utils/string";
import { replaceThemeTokensWithVars } from "../utils/theme";
import { isValidCSSObject } from "../utils/type-guards";
import { applyUtilities } from "../utils/utilities";
import { classNameCache, cssStringCache } from "./cache";

/**
 * Checks if a key/value pair represents a styled component reference.
 *
 * @param key - Property key to check
 * @param value - Property value to check
 * @returns True if key/value represents a styled component reference
 */
function isStyledComponentKey(key: string | symbol, value: unknown): boolean {
  if (typeof key === "symbol" && key === STOOP_COMPONENT_SYMBOL) {
    return true;
  }

  if (typeof value === "object" && value !== null && STOOP_COMPONENT_SYMBOL in value) {
    return true;
  }

  if (typeof key === "string" && key.startsWith("__STOOP_COMPONENT_")) {
    return true;
  }

  return false;
}

/**
 * Extracts the class name from a styled component reference.
 *
 * @param key - Property key
 * @param value - Property value
 * @returns Extracted class name or empty string
 */
function getClassNameFromKeyOrValue(key: string | symbol, value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "__stoopClassName" in value &&
    typeof (value as { __stoopClassName?: unknown }).__stoopClassName === "string"
  ) {
    return (value as { __stoopClassName: string }).__stoopClassName;
  }

  if (typeof key === "string" && key.startsWith("__STOOP_COMPONENT_")) {
    return key.replace("__STOOP_COMPONENT_", "");
  }

  return "";
}

/**
 * Converts a CSS object to a CSS string with proper nesting and selectors.
 * Handles pseudo-selectors, media queries, combinators, and styled component targeting.
 *
 * @param obj - CSS object to convert
 * @param selector - Current selector context
 * @param depth - Current nesting depth
 * @param media - Media query breakpoints
 * @returns CSS string
 */
function cssObjectToString(
  obj: CSS,
  selector = "",
  depth = 0,
  media?: Record<string, string>,
): string {
  if (!obj || typeof obj !== "object") {
    return "";
  }

  if (depth > MAX_CSS_NESTING_DEPTH) {
    return "";
  }

  const cssProperties: string[] = [];
  const nestedRulesList: string[] = [];

  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];

    if (isStyledComponentKey(key, value)) {
      const componentClassName = getClassNameFromKeyOrValue(key, value);

      if (!componentClassName) {
        continue;
      }

      const sanitizedClassName = sanitizeCSSSelector(componentClassName);

      if (!sanitizedClassName) {
        continue;
      }

      const componentSelector = selector
        ? `${selector} .${sanitizedClassName}`
        : `.${sanitizedClassName}`;
      const nestedCss = isValidCSSObject(value)
        ? cssObjectToString(value, componentSelector, depth + 1, media)
        : "";

      if (nestedCss) {
        nestedRulesList.push(nestedCss);
      }
      continue;
    }

    if (isValidCSSObject(value)) {
      if (media && key in media) {
        const mediaQuery = sanitizeMediaQuery(media[key]);

        if (mediaQuery) {
          const nestedCss = cssObjectToString(value, selector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(`${mediaQuery} { ${nestedCss} }`);
          }
        }
      } else if (key.startsWith("@")) {
        const sanitizedKey = sanitizeCSSSelector(key);

        if (sanitizedKey) {
          const nestedCss = cssObjectToString(value, selector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(`${sanitizedKey} { ${nestedCss} }`);
          }
        }
      } else if (key.includes("&")) {
        const sanitizedKey = sanitizeCSSSelector(key);

        if (sanitizedKey) {
          const parts = sanitizedKey.split("&");
          const nestedSelector = parts.join(selector);
          const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(nestedCss);
          }
        }
      } else if (key.startsWith(":")) {
        const sanitizedKey = sanitizeCSSSelector(key);

        if (sanitizedKey) {
          const nestedSelector = `${selector}${sanitizedKey}`;
          const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(nestedCss);
          }
        }
      } else if (key.includes(" ") || key.includes(">") || key.includes("+") || key.includes("~")) {
        const sanitizedKey = sanitizeCSSSelector(key);

        if (sanitizedKey) {
          const startsWithCombinator = /^[\s>+~]/.test(sanitizedKey.trim());
          const nestedSelector = startsWithCombinator
            ? `${selector}${sanitizedKey}`
            : `${selector} ${sanitizedKey}`;
          const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(nestedCss);
          }
        }
      } else {
        const sanitizedKey = sanitizeCSSSelector(key);

        if (sanitizedKey) {
          const nestedSelector = selector ? `${selector} ${sanitizedKey}` : sanitizedKey;
          const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

          if (nestedCss) {
            nestedRulesList.push(nestedCss);
          }
        }
      }
    } else if (value !== undefined) {
      const property = sanitizeCSSPropertyName(key);

      if (property && (typeof value === "string" || typeof value === "number")) {
        const escapedValue = escapeCSSValue(value);

        cssProperties.push(`${property}: ${escapedValue};`);
      }
    }
  }

  const rule = cssProperties.length > 0 ? `${selector} { ${cssProperties.join(" ")} }` : "";

  return rule + nestedRulesList.join("");
}

/**
 * Compiles CSS objects into CSS strings and generates unique class names.
 * Handles nested selectors, media queries, styled component targeting, and theme tokens.
 *
 * @param styles - CSS object to compile
 * @param currentTheme - Theme for token resolution
 * @param prefix - Optional prefix for generated class names
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @returns Generated class name
 */
export function compileCSS(
  styles: CSS,
  currentTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
): string {
  const sanitizedPrefix = sanitizePrefix(prefix);
  const stylesWithUtils = applyUtilities(styles, utils);
  const themedStyles = replaceThemeTokensWithVars(stylesWithUtils, currentTheme, themeMap);
  const cssString = cssObjectToString(themedStyles, "", 0, media);
  const stylesHash = hash(cssString);
  const className = sanitizedPrefix ? `${sanitizedPrefix}-${stylesHash}` : `css-${stylesHash}`;
  const cacheKey = `${sanitizedPrefix}:${className}`;

  const cachedCSS = cssStringCache.get(cacheKey);

  if (cachedCSS) {
    injectCSS(cachedCSS, sanitizedPrefix, cacheKey);

    return className;
  }

  const fullCSS = cssObjectToString(themedStyles, `.${className}`, 0, media);

  cssStringCache.set(cacheKey, fullCSS);
  classNameCache.set(cacheKey, className);

  injectCSS(fullCSS, sanitizedPrefix, cacheKey);

  return className;
}
