/**
 * Utility function application.
 * Applies utility functions (e.g., px, py) to transform shorthand properties into CSS.
 * Recursively processes nested CSS objects.
 */
import type { CSS, UtilityFunction } from "../types";
export declare function applyUtilities(styles: CSS, utils?: Record<string, UtilityFunction>): CSS;
