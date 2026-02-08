/**
 * Helper utilities for Stoop.
 * Consolidates environment detection, type guards, theme validation, and utility function application.
 */

import type {
  CSS,
  CSSPropertyValue,
  DefaultTheme,
  StyledComponentRef,
  Theme,
  UtilityFunction,
} from "../types";

import { APPROVED_THEME_SCALES } from "../constants";

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Checks if code is running in a browser environment.
 *
 * @returns True if running in browser, false if in SSR/Node environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof window.document === "object" &&
    typeof document.createElement === "function"
  );
}

/**
 * Checks if running in production mode.
 *
 * @returns True if running in production mode
 */
export function isProduction(): boolean {
  return typeof process !== "undefined" && process.env?.NODE_ENV === "production";
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for CSS objects.
 *
 * @param value - Value to check
 * @returns True if value is a CSS object
 */
export function isCSSObject(value: unknown): value is CSS {
  return typeof value === "object" && value !== null;
}

/**
 * Checks if a value is a styled component reference.
 *
 * @param value - Value to check
 * @returns True if value is a styled component reference
 */
export function isStyledComponentRef(value: unknown): value is StyledComponentRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "__isStoopStyled" in value &&
    "__stoopClassName" in value &&
    (value as StyledComponentRef).__isStoopStyled
  );
}

/**
 * Type guard for valid CSS objects (excludes styled component references).
 *
 * @param value - Value to check
 * @returns True if value is a valid CSS object
 */
export function isValidCSSObject(value: unknown): value is CSS {
  return isCSSObject(value) && !isStyledComponentRef(value);
}

/**
 * Type guard for theme objects.
 *
 * @param value - Value to check
 * @returns True if value is a theme object
 */
export function isThemeObject(value: unknown): value is Theme {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ============================================================================
// Theme Validation
// ============================================================================

/**
 * Validates that a theme object only contains approved scales.
 *
 * @param theme - Theme object to validate
 * @returns Validated theme as DefaultTheme
 * @throws Error if theme contains invalid scales (development only)
 */
export function validateTheme(theme: unknown): DefaultTheme {
  if (!theme || typeof theme !== "object" || Array.isArray(theme)) {
    throw new Error("[Stoop] Theme must be a non-null object");
  }

  // Skip all validation in production for performance
  if (isProduction()) {
    return theme as DefaultTheme;
  }

  const themeObj = theme as Record<string, unknown>;
  const invalidScales: string[] = [];

  for (const key in themeObj) {
    if (key === "media") {
      continue;
    }
    if (!APPROVED_THEME_SCALES.includes(key as (typeof APPROVED_THEME_SCALES)[number])) {
      invalidScales.push(key);
    }
  }

  if (invalidScales.length > 0) {
    const errorMessage =
      `[Stoop] Theme contains invalid scales: ${invalidScales.join(", ")}. ` +
      `Only these scales are allowed: ${APPROVED_THEME_SCALES.join(", ")}`;

    throw new Error(errorMessage);
  }

  return theme as DefaultTheme;
}

// ============================================================================
// Utility Function Application
// ============================================================================

/**
 * Applies utility functions to transform shorthand properties into CSS.
 *
 * @param styles - CSS object to process
 * @param utils - Optional utility functions object
 * @returns CSS object with utilities applied
 */
export function applyUtilities(styles: CSS, utils?: Record<string, UtilityFunction>): CSS {
  if (!utils || !styles || typeof styles !== "object") {
    return styles;
  }

  const utilityKeys = Object.keys(utils);

  // Fast path: check if any utility keys are present before creating new object
  let hasUtilities = false;

  for (const key in styles) {
    if (utilityKeys.includes(key)) {
      hasUtilities = true;
      break;
    }
  }

  // If no utility keys found, return original object
  if (!hasUtilities) {
    return styles;
  }

  const result: CSS = {};

  for (const key in styles) {
    const value = styles[key];

    if (utilityKeys.includes(key) && utils[key]) {
      try {
        const utilityResult = utils[key](value as CSSPropertyValue | CSS);

        if (utilityResult && typeof utilityResult === "object") {
          for (const utilKey in utilityResult) {
            result[utilKey] = utilityResult[utilKey];
          }
        }
      } catch {
        result[key] = value;
      }
    } else if (isCSSObject(value)) {
      result[key] = applyUtilities(value, utils);
    } else {
      result[key] = value;
    }
  }

  return result;
}
