/**
 * Shared constants used throughout the library.
 * Includes cache size limits, nesting depth limits, and fallback context.
 */

import { createContext } from "react";

import type { CSS, ThemeContextValue } from "./types";

export const EMPTY_CSS: CSS = Object.freeze({});

export const MAX_CSS_CACHE_SIZE = 10000;
export const MAX_CLASS_NAME_CACHE_SIZE = 5000;
export const MAX_CSS_NESTING_DEPTH = 10;

export const FALLBACK_CONTEXT = createContext<ThemeContextValue | null>(null);
