/**
 * Type guard utilities.
 * Provides runtime type checking for CSS objects, themes, and styled component references.
 */

import type { CSS, StyledComponentRef, Theme } from "../types";

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

export function isValidCSSObject(value: unknown): value is CSS {
  return isCSSObject(value) && !isStyledComponentRef(value);
}

export function isThemeObject(value: unknown): value is Theme {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
