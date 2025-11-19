/**
 * Type guard utilities.
 * Provides runtime type checking for CSS objects, themes, and styled component references.
 */

import type { CSS, StyledComponentRef, Theme } from "../types";

/**
 * Type guard for CSS objects.
 *
 * @param value - Value to check
 * @returns True if value is a CSS object
 */
export function isCSSObject(value: unknown): value is CSS {
  return typeof value === "object" && value !== null;
}

function isStyledComponentRef(value: unknown): value is StyledComponentRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "__isStoopStyled" in value &&
    "__stoopClassName" in value &&
    (value as StyledComponentRef).__isStoopStyled === true
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
