/**
 * Utility functions for Stoop.
 * Demonstrates how to create custom utility functions that transform
 * shorthand properties into full CSS objects.
 */

import type { CSS, UtilityFunction } from "../../src/types";

type CSSPropertyValue = string | number;

/**
 * Utility functions for Stoop.
 * These functions transform shorthand properties (e.g., `px`, `py`) into
 * full CSS objects that can be used in styled components or css() calls.
 */
export const utils: Record<string, UtilityFunction> = {
  /**
   * Hide utility - accepts optional breakpoint name
   * @example
   * ```tsx
   * <Box hidden="mobile" />  // Hide on mobile
   * <Box hidden="desktop" /> // Hide on desktop
   * <Box hidden />           // Always hidden
   * ```
   */
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
  mb: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginBottom: val };
  },
  ml: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginLeft: val };
  },
  mr: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginRight: val };
  },
  mt: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginTop: val };
  },
  mx: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginLeft: val, marginRight: val };
  },
  my: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginBottom: val, marginTop: val };
  },

  // Padding utilities
  pb: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingBottom: val };
  },
  pl: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingLeft: val };
  },
  pr: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingRight: val };
  },
  pt: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingTop: val };
  },
  px: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingLeft: val, paddingRight: val };
  },
  py: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingBottom: val, paddingTop: val };
  },
};
