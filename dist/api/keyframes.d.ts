/**
 * CSS keyframes animation API.
 * Creates a function that generates and injects @keyframes rules.
 * Caches animations by content hash to prevent duplicates.
 */
import type { CSS } from "../types";
export declare function createKeyframesFunction(prefix?: string): (keyframes: Record<string, CSS>) => string;
