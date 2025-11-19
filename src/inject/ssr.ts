/**
 * SSR cache management for CSS injection.
 * Maintains a cache of CSS text for server-side rendering.
 * Implements FIFO eviction to prevent memory leaks.
 */

import { MAX_CSS_CACHE_SIZE } from "../constants";

const cssTextCache: string[] = [];

/**
 * Adds CSS to the SSR cache with FIFO eviction.
 *
 * @param css - CSS string to cache
 */
export function addToSSRCache(css: string): void {
  if (cssTextCache.includes(css)) {
    return;
  }

  if (cssTextCache.length >= MAX_CSS_CACHE_SIZE) {
    cssTextCache.shift();
  }

  cssTextCache.push(css);
}

/**
 * Gets all cached CSS text for SSR.
 *
 * @returns Joined CSS text string
 */
export function getSSRCacheText(): string {
  return cssTextCache.join("\n");
}

/**
 * Clears the SSR cache.
 */
export function clearSSRCache(): void {
  cssTextCache.length = 0;
}

/**
 * Checks if CSS is already in the SSR cache.
 *
 * @param css - CSS string to check
 * @returns True if CSS is cached
 */
export function isInSSRCache(css: string): boolean {
  return cssTextCache.includes(css);
}
