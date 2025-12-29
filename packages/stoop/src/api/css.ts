/**
 * CSS class generation API.
 * Creates a function that compiles CSS objects into class names.
 */

import type { CSS, Theme, ThemeScale, UtilityFunction } from "../types";

import { compileCSS } from "../core/compiler";

/**
 * Creates a CSS function that compiles CSS objects into class names.
 *
 * @param defaultTheme - Default theme for token resolution
 * @param prefix - Optional prefix for generated class names
 * @param media - Optional media query breakpoints
 * @param utils - Optional utility functions
 * @param themeMap - Optional theme scale mappings
 * @returns Function that accepts CSS objects and returns class names
 */
export function createCSSFunction(
  defaultTheme: Theme,
  prefix = "stoop",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
  themeMap?: Record<string, ThemeScale>,
): (styles: CSS) => string {
  return function css(styles: CSS): string {
    return compileCSS(styles, defaultTheme, prefix, media, utils, themeMap);
  };
}
