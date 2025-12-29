/**
 * SSR cache management for CSS injection.
 * Maintains a cache of CSS text for server-side rendering.
 * Uses Set for O(1) deduplication and maintains insertion order.
 */

import { MAX_CSS_CACHE_SIZE } from "../constants";

// Use a single Map to maintain both order and deduplication
// This prevents Set/Array synchronization issues
const cssTextCache = new Map<string, boolean>();

/**
 * Adds CSS to the SSR cache with FIFO eviction.
 * Uses a single Map to maintain order and prevent synchronization issues.
 *
 * @param css - CSS string to cache
 */
export function addToSSRCache(css: string): void {
  if (cssTextCache.has(css)) {
    return;
  }

  // FIFO eviction when cache is full
  if (cssTextCache.size >= MAX_CSS_CACHE_SIZE) {
    const firstKey = cssTextCache.keys().next().value;

    if (firstKey !== undefined) {
      cssTextCache.delete(firstKey);
    }
  }

  cssTextCache.set(css, true);
}

/**
 * Gets all cached CSS text for SSR.
 * Map maintains insertion order, so we can iterate keys directly.
 *
 * @returns Joined CSS text string
 */
export function getSSRCacheText(): string {
  return Array.from(cssTextCache.keys()).join("\n");
}

/**
 * Clears the SSR cache.
 */
export function clearSSRCache(): void {
  cssTextCache.clear();
}

/**
 * Checks if CSS is already in the SSR cache.
 *
 * @param css - CSS string to check
 * @returns True if CSS is cached
 */
export function isInSSRCache(css: string): boolean {
  return cssTextCache.has(css);
}
