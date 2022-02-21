/**
 * Theme token resolution utilities.
 * Converts theme tokens to CSS variables for runtime theme switching.
 * Uses cached token index for efficient lookups and theme comparison.
 */
import type { CSS, Theme } from "../types";
export declare function themesAreEqual(theme1: Theme | null, theme2: Theme | null): boolean;
export declare function tokenToCSSVar(token: string, theme?: Theme): string;
export declare function generateCSSVariables(theme: Theme, prefix?: string): string;
export declare function replaceThemeTokensWithVars(obj: CSS, theme?: Theme): CSS;
