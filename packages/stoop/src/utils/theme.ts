/**
 * Theme token resolution utilities.
 * Converts theme tokens to CSS variables for runtime theme switching.
 * Uses cached token index for efficient lookups and theme comparison.
 */

import type { CSS, Theme, ThemeScale } from "../types";

import { isCSSObject, isThemeObject, isProduction } from "./helpers";
import {
  escapeCSSVariableValue,
  getScaleForProperty,
  sanitizeCSSVariableName,
} from "./theme-utils";

// Pre-compiled regex for token replacement (matches $primary, -$medium, $colors.primary, etc.)
const TOKEN_REGEX =
  /(-?\$[a-zA-Z][a-zA-Z0-9]*(?:\$[a-zA-Z][a-zA-Z0-9]*)?(?:\.[a-zA-Z][a-zA-Z0-9]*)?)/g;

/**
 * Builds an index of all tokens in a theme for fast lookups.
 *
 * @param theme - Theme to index
 * @returns Map of token names to their paths in the theme
 */
function buildTokenIndex(theme: Theme): Map<string, string[][]> {
  const index = new Map<string, string[][]>();

  function processThemeObject(obj: Theme, path: string[] = []): void {
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

  for (const [, paths] of index.entries()) {
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
    }
  }

  return index;
}

/**
 * Checks if two themes have the same top-level keys (excluding 'media').
 *
 * @param theme1 - First theme
 * @param theme2 - Second theme
 * @returns True if themes have same keys
 */
function themesHaveSameKeys(theme1: Theme, theme2: Theme): boolean {
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
 * Compares two themes for structural and value equality.
 * Excludes 'media' property from comparison.
 *
 * @param theme1 - First theme to compare
 * @param theme2 - Second theme to compare
 * @returns True if themes are equal
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

  const theme1WithoutMedia = { ...theme1 };
  const theme2WithoutMedia = { ...theme2 };

  delete theme1WithoutMedia.media;
  delete theme2WithoutMedia.media;

  return JSON.stringify(theme1WithoutMedia) === JSON.stringify(theme2WithoutMedia);
}

/**
 * Finds a token in the theme, optionally scoped to a specific scale.
 *
 * @param theme - Theme to search
 * @param tokenName - Token name to find
 * @param scale - Optional scale to search within first
 * @returns Path to token or null if not found
 */
function findTokenInTheme(theme: Theme, tokenName: string, scale?: ThemeScale): string[] | null {
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

    const index = buildTokenIndex(theme);
    const paths = index.get(tokenName);

    if (paths && paths.length > 1) {
      if (!isProduction()) {
        const scaleInfo = scale
          ? `Property "${property}" maps to "${scale}" scale, but token not found there. `
          : `No scale mapping found for property "${property}". `;

        // eslint-disable-next-line no-console
        console.warn(
          `[Stoop] Ambiguous token "$${tokenName}" found in multiple categories: ${paths.map((p) => p.join(".")).join(", ")}. ` +
            `${scaleInfo}` +
            `Using "${paths[0].join(".")}" (deterministic: shorter paths first, then alphabetical). ` +
            `Use full path "$${paths[0].join(".")}" to be explicit.`,
        );
      }
    }

    const foundPath = findTokenInTheme(theme, tokenName);

    if (foundPath) {
      const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
      const cssVarName = `--${sanitizedParts.join("-")}`;

      return `var(${cssVarName})`;
    }
  } else if (theme) {
    const index = buildTokenIndex(theme);
    const paths = index.get(tokenName);

    if (paths && paths.length > 1) {
      if (!isProduction()) {
        // eslint-disable-next-line no-console
        console.warn(
          `[Stoop] Ambiguous token "$${tokenName}" found in multiple categories: ${paths.map((p) => p.join(".")).join(", ")}. ` +
            `Using "${paths[0].join(".")}" (deterministic: shorter paths first, then alphabetical). ` +
            `Use full path "$${paths[0].join(".")}" to be explicit, or use with a CSS property for automatic resolution.`,
        );
      }
    }

    const foundPath = findTokenInTheme(theme, tokenName);

    if (foundPath) {
      const sanitizedParts = foundPath.map((part) => sanitizeCSSVariableName(part));
      const cssVarName = `--${sanitizedParts.join("-")}`;

      return `var(${cssVarName})`;
    }
  }

  const sanitizedTokenName = sanitizeCSSVariableName(tokenName);
  const cssVarName = `--${sanitizedTokenName}`;

  return `var(${cssVarName})`;
}

/**
 * Generates CSS custom properties from a theme object.
 *
 * @param theme - Theme object to convert to CSS variables
 * @param prefix - Optional prefix for CSS variable names
 * @param attributeSelector - Optional attribute selector (e.g., '[data-theme="light"]'). Defaults to ':root'
 * @returns CSS string with selector and CSS variables
 */
export function generateCSSVariables(
  theme: Theme,
  prefix = "stoop",
  attributeSelector?: string,
): string {
  const rootSelector = attributeSelector || ":root";
  const variables: string[] = [];

  function processThemeObject(obj: Theme, path: string[] = []): void {
    const keys = Object.keys(obj).sort() as Array<ThemeScale>;

    for (const key of keys) {
      // Media queries cannot be CSS variables
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
 * Generates CSS custom properties for all themes using attribute selectors.
 * This allows all themes to be available simultaneously, with theme switching
 * handled by changing the data-theme attribute.
 *
 * @param themes - Map of theme names to theme objects
 * @param prefix - Optional prefix for CSS variable names
 * @param attribute - Attribute name for theme selection (defaults to 'data-theme')
 * @returns CSS string with all theme CSS variables
 */
export function generateAllThemeVariables(
  themes: Record<string, Theme>,
  prefix = "stoop",
  attribute = "data-theme",
): string {
  const themeBlocks: string[] = [];

  for (const [themeName, theme] of Object.entries(themes)) {
    const attributeSelector = `[${attribute}="${themeName}"]`;
    const cssVars = generateCSSVariables(theme, prefix, attributeSelector);

    if (cssVars) {
      themeBlocks.push(cssVars);
    }
  }

  return themeBlocks.join("\n\n");
}

/**
 * Recursively replaces theme tokens with CSS variable references in a CSS object.
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
  let hasTokens = false;

  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];

    if (isCSSObject(value)) {
      const processed = replaceThemeTokensWithVars(value, theme, themeMap, undefined);

      result[key] = processed;
      // Check if processing changed anything (indicates tokens were found)
      if (processed !== value) {
        hasTokens = true;
      }
    } else if (typeof value === "string" && value.includes("$")) {
      hasTokens = true;
      const cssProperty = property || key;

      result[key] = value.replace(TOKEN_REGEX, (token) => {
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

  // Early exit: if no tokens were found, return original object to avoid unnecessary copying
  if (!hasTokens) {
    return obj;
  }

  return result;
}
