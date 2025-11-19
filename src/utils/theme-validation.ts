/**
 * Theme validation utilities.
 * Ensures theme objects only contain approved scales.
 */

import type { DefaultTheme } from "../types";

import { APPROVED_THEME_SCALES } from "../constants";

/**
 * Validates that a theme object only contains approved scales.
 *
 * @param theme - Theme object to validate
 * @returns Validated theme as DefaultTheme
 * @throws Error if theme contains invalid scales (in development)
 */
export function validateTheme(theme: unknown): DefaultTheme {
  if (!theme || typeof theme !== "object" || Array.isArray(theme)) {
    throw new Error("[Stoop] Theme must be a non-null object");
  }

  const themeObj = theme as Record<string, unknown>;
  const invalidScales: string[] = [];

  for (const key in themeObj) {
    // Allow media as a special property (not a scale, but part of theme)
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

    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      throw new Error(errorMessage);
    }

    // eslint-disable-next-line no-console
    console.warn(errorMessage);
  }

  return theme as DefaultTheme;
}
