/**
 * CSS compilation caching system.
 * Tracks compiled CSS strings and class names to prevent duplicate work.
 * Implements FIFO eviction when cache size limits are exceeded.
 */

import { MAX_CLASS_NAME_CACHE_SIZE } from "../constants";

const stylesCache = new Map<string, string>();

export const classNameCache = new Map<string, string>();
export const cssStringCache = new Map<string, string>();

export function hasCachedStyle(css: string): boolean {
  return stylesCache.has(css);
}

export function markStyleAsCached(css: string): void {
  stylesCache.set(css, css);
}

export function limitCacheSize(): void {
  if (classNameCache.size > MAX_CLASS_NAME_CACHE_SIZE) {
    const firstKey = classNameCache.keys().next().value;

    if (firstKey) {
      classNameCache.delete(firstKey);
      cssStringCache.delete(firstKey);
    }
  }
}

export function clearStyleCache(): void {
  stylesCache.clear();
}
