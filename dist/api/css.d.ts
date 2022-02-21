/**
 * CSS class generation API.
 * Creates a function that compiles CSS objects into class names.
 * Manages theme context for styled components.
 */
import type { Context } from "react";
import type { CSS, Theme, ThemeContextValue, UtilityFunction } from "../types";
export declare function setThemeContext(context: Context<ThemeContextValue | null>): void;
export declare function getThemeContext(): Context<ThemeContextValue | null> | null;
export declare function createCSSFunction(defaultTheme: Theme, prefix?: string, media?: Record<string, string>, utils?: Record<string, UtilityFunction>): (styles: CSS) => string;
