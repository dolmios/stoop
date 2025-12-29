/**
 * SSR cache management for CSS injection.
 * Maintains a cache of CSS text for server-side rendering.
 */

import { MAX_CSS_CACHE_SIZE } from "../constants";

const cssTextCache = new Map<string, boolean>();

/**
 * Adds CSS to the SSR cache with FIFO eviction.
 *
 * @param css - CSS string to cache
 */
export function addToSSRCache(css: string): void {
  if (cssTextCache.has(css)) {
    return;
  }

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
