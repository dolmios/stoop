/**
 * CSS compilation engine.
 * Converts CSS objects to CSS strings and generates unique class names.
 * Handles nested selectors, media queries, styled component targeting, and theme tokens.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { MAX_CSS_NESTING_DEPTH, STOOP_COMPONENT_SYMBOL } from "../constants";
import { injectCSS } from "../inject";
import { isValidCSSObject, applyUtilities, isStyledComponentRef } from "../utils/helpers";
import { replaceThemeTokensWithVars } from "../utils/theme";
import {
  escapeCSSValue,
  hash,
  sanitizeCSSSelector,
  sanitizeMediaQuery,
  sanitizePrefix,
} from "../utils/theme-utils";
import { classNameCache, cssStringCache } from "./cache";
import { sanitizeCSSPropertyName } from "./stringify";

/**
 * Set of CSS properties that require length units for numeric values.
 * These properties should have 'px' automatically appended to unitless numbers.
 */
const DIMENSIONAL_PROPERTIES = new Set([
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "top",
  "right",
  "bottom",
  "left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-width",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "font-size",
  "letter-spacing",
  "word-spacing",
  "text-indent",
  "flex-basis",
  "gap",
  "row-gap",
  "column-gap",
  "grid-template-rows",
  "grid-template-columns",
  "grid-auto-rows",
  "grid-auto-columns",
  "perspective",
  "outline-width",
  "outline-offset",
  "clip",
  "vertical-align",
  "object-position",
  "background-position",
  "background-size",
  "mask-position",
  "mask-size",
  "scroll-margin",
  "scroll-padding",
  "shape-margin",
]);

/**
 * Checks if a CSS property requires length units for numeric values.
 *
 * @param property - CSS property name (in kebab-case)
 * @returns True if the property requires units
 */
function requiresUnit(property: string): boolean {
  return DIMENSIONAL_PROPERTIES.has(property);
}

/**
 * Normalizes a CSS value by adding 'px' unit to unitless numeric values
 * for properties that require units.
 *
 * @param property - CSS property name (in kebab-case)
 * @param value - CSS value (string or number)
 * @returns Normalized value string
 */
function normalizeCSSValue(property: string, value: string | number): string {
  if (typeof value === "string") {
    // If it's already a string, check if it's a unitless number
    // Only add px if it's a pure number and the property requires units
    if (requiresUnit(property) && /^-?\d+\.?\d*$/.test(value.trim())) {
      return `${value}px`;
    }

    return value;
  }

  // For numeric values, add px if the property requires units
  if (typeof value === "number" && requiresUnit(property)) {
    return `${value}px`;
  }

  return String(value);
}

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

  if (isStyledComponentRef(value)) {
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
export function cssObjectToString(
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
  const importStatements: string[] = [];

  // Only sort keys when selector is empty (for hashing/deterministic output)
  // When selector is provided, we don't need deterministic ordering for performance
  const keys = selector === "" ? Object.keys(obj).sort() : Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];

    // Handle @import statements specially - they must be output as raw CSS and come first
    if (key === "@import" && (typeof value === "string" || typeof value === "number")) {
      const importValue = typeof value === "string" ? value : String(value);

      importStatements.push(`@import ${importValue};`);
      continue;
    }

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

          // Handle comma-separated selectors: split by comma, apply & replacement to each part, then rejoin
          if (selector.includes(",")) {
            const selectorParts = selector.split(",").map((s) => s.trim());
            const nestedSelectors = selectorParts.map((sel) => parts.join(sel));
            const nestedSelector = nestedSelectors.join(", ");
            const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

            if (nestedCss) {
              nestedRulesList.push(nestedCss);
            }
          } else {
            // Single selector: simple & replacement
            const nestedSelector = parts.join(selector);
            const nestedCss = cssObjectToString(value, nestedSelector, depth + 1, media);

            if (nestedCss) {
              nestedRulesList.push(nestedCss);
            }
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
      } else if (key.includes(",")) {
        // Handle comma-separated selectors (e.g., "a, a:visited")
        // Split by comma, sanitize each part, then rejoin
        // This must come before the space/combinator check since comma-separated selectors can contain spaces
        const parts = key.split(",").map((part) => part.trim());
        const sanitizedParts = parts
          .map((part) => sanitizeCSSSelector(part))
          .filter((part) => part);

        if (sanitizedParts.length > 0) {
          const nestedSelector = sanitizedParts.join(", ");
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
        const normalizedValue = normalizeCSSValue(property, value);

        // Special handling for content property with empty string
        // CSS requires content: ""; not content: ;
        if (property === "content" && normalizedValue === "") {
          cssProperties.push(`${property}: "";`);
        } else {
          const escapedValue = escapeCSSValue(normalizedValue);

          cssProperties.push(`${property}: ${escapedValue};`);
        }
      }
    }
  }

  const parts: string[] = [];

  // @import statements must come first in CSS
  parts.push(...importStatements);

  if (cssProperties.length > 0) {
    // When selector is empty (e.g., inside @font-face, @keyframes), don't wrap in braces
    // The at-rule will wrap it
    if (selector === "") {
      parts.push(cssProperties.join(" "));
    } else {
      parts.push(`${selector} { ${cssProperties.join(" ")} }`);
    }
  }

  parts.push(...nestedRulesList);

  return parts.join("");
}

/**
 * Extracts CSS properties string from a CSS object for hashing.
 * Only processes top-level properties (no nested rules, media queries, etc.).
 * This is optimized for simple CSS objects without nesting.
 *
 * @param obj - CSS object to process
 * @param media - Optional media query breakpoints
 * @returns CSS properties string without selector wrapper, or empty string if complex
 */
function extractCSSPropertiesForHash(obj: CSS, media?: Record<string, string>): string {
  if (!obj || typeof obj !== "object") {
    return "";
  }

  const cssProperties: string[] = [];
  const keys = Object.keys(obj).sort(); // Sort for deterministic hashing

  for (const key of keys) {
    const value = obj[key];

    // Check for nested rules - if found, we need full stringification
    if (isValidCSSObject(value)) {
      return ""; // Complex CSS, use full stringification
    }

    // Check for media queries
    if (media && key in media) {
      return ""; // Has media queries, use full stringification
    }

    // Check for pseudo-selectors, combinators, etc.
    if (
      key.startsWith("@") ||
      key.includes("&") ||
      key.startsWith(":") ||
      key.includes(" ") ||
      key.includes(">") ||
      key.includes("+") ||
      key.includes("~")
    ) {
      return ""; // Complex selector, use full stringification
    }

    if (value !== undefined && !isStyledComponentKey(key, value)) {
      const property = sanitizeCSSPropertyName(key);

      if (property && (typeof value === "string" || typeof value === "number")) {
        const normalizedValue = normalizeCSSValue(property, value);

        // Special handling for content property with empty string
        // CSS requires content: ""; not content: ;
        if (property === "content" && normalizedValue === "") {
          cssProperties.push(`${property}: "";`);
        } else {
          const escapedValue = escapeCSSValue(normalizedValue);

          cssProperties.push(`${property}: ${escapedValue};`);
        }
      }
    }
  }

  return cssProperties.join(" ");
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

  // Optimize: Try to extract properties for hash first (fast path for simple CSS)
  const propertiesString = extractCSSPropertiesForHash(themedStyles, media);
  let cssString: string;
  let stylesHash: string;

  if (propertiesString) {
    // Fast path: simple CSS without nested rules - use properties string for hash
    cssString = propertiesString;
    stylesHash = hash(cssString);
  } else {
    // Fallback: complex CSS with nested rules - need full stringification
    cssString = cssObjectToString(themedStyles, "", 0, media);
    stylesHash = hash(cssString);
  }

  const className = sanitizedPrefix ? `${sanitizedPrefix}-${stylesHash}` : `css-${stylesHash}`;
  const cacheKey = `${sanitizedPrefix}:${className}`;

  const cachedCSS = cssStringCache.get(cacheKey);

  if (cachedCSS) {
    injectCSS(cachedCSS, sanitizedPrefix, cacheKey);

    return className;
  }

  // Generate final CSS with className selector
  let fullCSS: string;

  if (propertiesString) {
    // Fast path: wrap properties with selector
    fullCSS = `.${className} { ${propertiesString} }`;
  } else {
    // Fallback: full stringification with selector
    fullCSS = cssObjectToString(themedStyles, `.${className}`, 0, media);
  }

  cssStringCache.set(cacheKey, fullCSS);
  classNameCache.set(cacheKey, className);

  injectCSS(fullCSS, sanitizedPrefix, cacheKey);

  return className;
}
