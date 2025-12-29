/**
 * Theme token resolution utilities.
 * Converts theme tokens to CSS variables for runtime theme switching.
 * Uses cached token index for efficient lookups and theme comparison.
 */

import type { CSS, Theme, ThemeScale } from "../types";

import {
  escapeCSSVariableValue,
  sanitizeCSSVariableName,
} from "./string";
import { getScaleForProperty } from "./theme-map";
import { isCSSObject, isThemeObject } from "./type-guards";

const tokenIndexCache = new WeakMap<Theme, Map<string, string[][]>>();

// Pre-compiled regex for token replacement
// Matches tokens like $primary, -$medium, $colors.primary, etc.
const TOKEN_REGEX = /(-?\$[a-zA-Z][a-zA-Z0-9]*(?:\$[a-zA-Z][a-zA-Z0-9]*)?(?:\.[a-zA-Z][a-zA-Z0-9]*)?)/g;

function buildTokenIndex(theme: Theme): Map<string, string[][]> {
  const cached = tokenIndexCache.get(theme);

  if (cached) {
    return cached;
  }

  const index = new Map<string, string[][]>();

  function processThemeObject(obj: Theme, path: string[] = []): void {
    // No need to sort - just iterate in natural order for better performance
    const keys = Object.keys(obj) as Array<ThemeScale>;

    for (const key of keys) {
      const value = obj[key];
      const currentPath = [...path, key];

      if (isThemeObject(value)) {
        processThemeObject(value, currentPath);
      } else {
        const existing = index.get(key);

        if (existing) {
          existing.push(currentPath);
        } else {
          index.set(key, [currentPath]);
        }
      }
    }
  }

  processThemeObject(theme);

  // Sort paths deterministically: shorter paths first, then alphabetical
  for (const [tokenName, paths] of index.entries()) {
    if (paths.length > 1) {
      paths.sort((a, b) => {
        const depthDiff = a.length - b.length;

        if (depthDiff !== 0) {
          return depthDiff;
        }

        const pathA = a.join(".");
        const pathB = b.join(".");

        return pathA.localeCompare(pathB);
      });

      if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `[Stoop] Ambiguous token "$${tokenName}" found in multiple categories: ${paths.map(p => p.join(".")).join(", ")}. ` +
          `Using "${paths[0].join(".")}" (deterministic: shorter paths first, then alphabetical). ` +
          `Use full path "$${paths[0].join(".")}" to be explicit.`
        );
      }
    }
  }

  tokenIndexCache.set(theme, index);

  return index;
}

function themesHaveSameKeys(theme1: Theme, theme2: Theme): boolean {
  // Filter out 'media' from key comparison since it's not a CSS variable scale
  const keys1 = Object.keys(theme1).filter((key) => key !== "media");
  const keys2 = Object.keys(theme2).filter((key) => key !== "media");

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!(key in theme2)) {
      return false;
    }
  }

  return true;
}

/**
 * Compares two themes for equality by structure and values.
 * Excludes 'media' property from comparison since it's not a CSS variable scale.
 *
 * @param theme1 - First theme to compare
 * @param theme2 - Second theme to compare
 * @returns True if themes are equal, false otherwise
 */
export function themesAreEqual(theme1: Theme | null, theme2: Theme | null): boolean {
  if (theme1 === theme2) {
    return true;
  }

  if (!theme1 || !theme2) {
    return false;
  }

  if (!themesHaveSameKeys(theme1, theme2)) {
    return false;
  }

  // Create copies without 'media' for comparison
  const theme1WithoutMedia = { ...theme1 };
  const theme2WithoutMedia = { ...theme2 };

  delete theme1WithoutMedia.media;
  delete theme2WithoutMedia.media;

  return JSON.stringify(theme1WithoutMedia) === JSON.stringify(theme2WithoutMedia);
}

function findTokenInTheme(
  theme: Theme,
  tokenName: string,
  scale?: ThemeScale,
): string[] | null {
  if (scale && scale in theme) {
    const scaleValue = theme[scale];

    if (
      scaleValue &&
      typeof scaleValue === "object" &&
      !Array.isArray(scaleValue) &&
      tokenName in scaleValue
    ) {
      return [scale, tokenName];
    }
  }

  const index = buildTokenIndex(theme);
  const paths = index.get(tokenName);

  if (!paths || paths.length === 0) {
    return null;
  }

  return paths[0];
}

/**
 * Converts a theme token string to a CSS variable reference.
 *
 * @param token - Token string (e.g., "$primary" or "$colors$primary")
 * @param theme - Optional theme for token resolution
 * @param property - Optional CSS property name for scale detection
 * @param themeMap - Optional theme scale mappings
 * @returns CSS variable reference string
 */
export function tokenToCSSVar(
  token: string,
  theme?: Theme,
  property?: string,
  themeMap?: Record<string, ThemeScale>,
): string {
  if (!token.startsWith("$")) {
    return token;
  }

  const tokenName = token.slice(1);

  // Handle explicit scale: $colors$primary or $colors.primary
  if (tokenName.includes("$") || tokenName.includes(".")) {
    const parts = tokenName.includes("$") ? tokenName.split("$") : tokenName.split(".");
    const sanitizedParts = parts.map((part) => sanitizeCSSVariableName(part));
    const cssVarName = `--${sanitizedParts.join("-")}`;

    return `var(${cssVarName})`;
  }

  // Handle shorthand token: $primary
  if (theme && property) {
    const scale = getScaleForProperty(property, themeMap);

    if (scale) {
      const foundPath = findTokenInTheme(theme, tokenName, scale);

      if (foundPath) {
        const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
        const cssVarName = `--${sanitizedParts.join("-")}`;

        return `var(${cssVarName})`;
      }
    }

    // Fallback: search all categories (backward compatibility)
    const foundPath = findTokenInTheme(theme, tokenName);

    if (foundPath) {
      const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
      const cssVarName = `--${sanitizedParts.join("-")}`;

      return `var(${cssVarName})`;
    }
  } else if (theme) {
    // No property context: search all categories
    const foundPath = findTokenInTheme(theme, tokenName);

    if (foundPath) {
      const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
      const cssVarName = `--${sanitizedParts.join("-")}`;

      return `var(${cssVarName})`;
    }
  }

  // Final fallback: generate CSS variable from token name
  const sanitizedTokenName = sanitizeCSSVariableName(tokenName);
  const cssVarName = `--${sanitizedTokenName}`;

  return `var(${cssVarName})`;
}

/**
 * Generates CSS custom properties from a theme object.
 *
 * @param theme - Theme object to convert to CSS variables
 * @param prefix - Optional prefix for CSS variable names
 * @returns CSS string with :root selector and CSS variables
 */
export function generateCSSVariables(theme: Theme, prefix = "stoop"): string {
  // Use simple :root selector for single instance (default case)
  // Only use attribute selector if explicitly needed for multiple instances
  // This prevents issues where data-stoop attribute isn't set on <html>
  const rootSelector = ":root";
  const variables: string[] = [];

  function processThemeObject(obj: Theme, path: string[] = []): void {
    // Sort keys for deterministic CSS variable order (important for SSR consistency)
    const keys = Object.keys(obj).sort() as Array<ThemeScale>;

    for (const key of keys) {
      // Skip media property - media queries cannot be CSS variables
      // CSS variables are resolved at computed time, but media queries are evaluated
      // at parse time, so @media (min-width: var(--breakpoint)) is not valid CSS.
      // Media queries in themes are used for breakpoint definitions during CSS compilation.
      if (key === "media") {
        continue;
      }

      const value = obj[key];
      const currentPath = [...path, key];

      if (isThemeObject(value)) {
        processThemeObject(value, currentPath);
      } else {
        const sanitizedParts = currentPath.map((part) => sanitizeCSSVariableName(part));
        const varName = `--${sanitizedParts.join("-")}`;
        const escapedValue =
          typeof value === "string" || typeof value === "number"
            ? escapeCSSVariableValue(value)
            : String(value);

        variables.push(`  ${varName}: ${escapedValue};`);
      }
    }
  }

  processThemeObject(theme);

  if (variables.length === 0) {
    return "";
  }

  return `${rootSelector} {\n${variables.join("\n")}\n}`;
}

/**
 * Recursively replaces theme tokens with CSS variable references in a CSS object.
 * FIXED: Removed theme-specific caching to prevent cross-contamination issues.
 * Token-to-CSS-var conversion is deterministic and fast enough without caching.
 *
 * @param obj - CSS object to process
 * @param theme - Optional theme for token resolution
 * @param themeMap - Optional theme scale mappings
 * @param property - Optional CSS property name for scale detection
 * @returns CSS object with tokens replaced by CSS variables
 */
export function replaceThemeTokensWithVars(
  obj: CSS,
  theme?: Theme,
  themeMap?: Record<string, ThemeScale>,
  property?: string,
): CSS {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result: CSS = {};

  // FIXED: Sort keys for deterministic output
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];

    if (isCSSObject(value)) {
      // Key is a selector (pseudo-selector, media query), not a CSS property
      // Pass undefined for property so nested CSS properties use their own keys
      result[key] = replaceThemeTokensWithVars(value, theme, themeMap, undefined);
    } else if (typeof value === "string" && value.includes("$")) {
      const cssProperty = property || key;

      // FIXED: Removed caching to prevent cross-theme contamination
      // Token resolution is deterministic and fast enough without caching
      result[key] = value.replace(TOKEN_REGEX, (token) => {
        // Handle negative tokens
        if (token.startsWith("-$")) {
          const positiveToken = token.slice(1);
          const cssVar = tokenToCSSVar(positiveToken, theme, cssProperty, themeMap);

          return `calc(-1 * ${cssVar})`;
        }

        return tokenToCSSVar(token, theme, cssProperty, themeMap);
      });
    } else {
      result[key] = value;
    }
  }

  return result;
}
