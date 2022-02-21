/**
 * CSS class generation API.
 * Creates a function that compiles CSS objects into class names.
 * Manages theme context for styled components.
 */

import type { Context } from "react";

import type { CSS, Theme, ThemeContextValue, UtilityFunction } from "../types";

import { compileCSS } from "../core/compiler";

let themeContext: Context<ThemeContextValue | null> | null = null;

export function setThemeContext(context: Context<ThemeContextValue | null>): void {
  themeContext = context;
}

export function getThemeContext(): Context<ThemeContextValue | null> | null {
  return themeContext;
}

export function createCSSFunction(
  defaultTheme: Theme,
  prefix = "",
  media?: Record<string, string>,
  utils?: Record<string, UtilityFunction>,
): (styles: CSS) => string {
  return function css(styles: CSS): string {
    return compileCSS(styles, defaultTheme, prefix, media, utils);
  };
}
