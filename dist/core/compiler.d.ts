/**
 * CSS compilation engine.
 * Converts CSS objects to CSS strings and generates unique class names.
 * Handles nested selectors, media queries, styled component targeting, and theme tokens.
 */
import type { CSS, Theme, UtilityFunction } from "../types";
export declare function compileCSS(styles: CSS, currentTheme: Theme, prefix?: string, media?: Record<string, string>, utils?: Record<string, UtilityFunction>): string;
