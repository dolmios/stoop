/**
 * Utility functions for Stoop UI.
 */

import type { CSS, UtilityFunction } from "stoop/types";

type CSSPropertyValue = string | number;

function normalizeValue(value: CSSPropertyValue | CSS | undefined): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function createSpacingUtility(property: string): UtilityFunction {
  return (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = normalizeValue(value);

    return { [property]: val } as CSS;
  };
}

function createAxisSpacingUtility(property1: string, property2: string): UtilityFunction {
  return (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = normalizeValue(value);

    return { [property1]: val, [property2]: val } as CSS;
  };
}

export const utils: Record<string, UtilityFunction> = {
  hidden: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const breakpoint = typeof value === "string" ? value : "";

    if (breakpoint === "mobile") {
      return {
        mobile: {
          display: "none",
        },
      };
    }

    if (breakpoint === "desktop") {
      return {
        desktop: {
          display: "none",
        },
      };
    }

    return { display: "none" };
  },

  // Margin utilities
  mb: createSpacingUtility("marginBottom"),
  ml: createSpacingUtility("marginLeft"),
  mr: createSpacingUtility("marginRight"),
  mt: createSpacingUtility("marginTop"),
  mx: createAxisSpacingUtility("marginLeft", "marginRight"),
  my: createAxisSpacingUtility("marginBottom", "marginTop"),

  // Padding utilities
  pb: createSpacingUtility("paddingBottom"),
  pl: createSpacingUtility("paddingLeft"),
  pr: createSpacingUtility("paddingRight"),
  pt: createSpacingUtility("paddingTop"),
  px: createAxisSpacingUtility("paddingLeft", "paddingRight"),
  py: createAxisSpacingUtility("paddingBottom", "paddingTop"),
};
