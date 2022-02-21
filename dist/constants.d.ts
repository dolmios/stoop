/**
 * Shared constants used throughout the library.
 * Includes cache size limits, nesting depth limits, and fallback context.
 */
import type { CSS, ThemeContextValue } from "./types";
export declare const EMPTY_CSS: CSS;
export declare const MAX_CSS_CACHE_SIZE = 10000;
export declare const MAX_CLASS_NAME_CACHE_SIZE = 5000;
export declare const MAX_CSS_NESTING_DEPTH = 10;
export declare const FALLBACK_CONTEXT: import("react").Context<ThemeContextValue | null>;
