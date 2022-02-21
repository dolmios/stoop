/**
 * Type guard utilities.
 * Provides runtime type checking for CSS objects, themes, and styled component references.
 */
import type { CSS, Theme } from "../types";
export declare function isCSSObject(value: unknown): value is CSS;
export declare function isValidCSSObject(value: unknown): value is CSS;
export declare function isThemeObject(value: unknown): value is Theme;
