/**
 * Global CSS injection API.
 * Creates a function that injects global styles into the document.
 * Supports media queries, nested selectors, and theme tokens.
 */
import type { CSS, Theme, UtilityFunction } from "../types";
export declare function createGlobalCSSFunction(defaultTheme: Theme, prefix?: string, media?: Record<string, string>, utils?: Record<string, UtilityFunction>): (styles: CSS) => () => void;
