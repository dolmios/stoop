/**
 * SSR cache management for CSS injection.
 * Maintains a cache of CSS text for server-side rendering.
 * Implements FIFO eviction to prevent memory leaks.
 */

import { MAX_CSS_CACHE_SIZE } from "../constants";

const cssTextCache: string[] = [];

export function addToSSRCache(css: string): void {
  if (cssTextCache.includes(css)) {
    return;
  }

  if (cssTextCache.length >= MAX_CSS_CACHE_SIZE) {
    cssTextCache.shift();
  }

  cssTextCache.push(css);
}

export function getSSRCacheText(): string {
  return cssTextCache.join("\n");
}

export function clearSSRCache(): void {
  cssTextCache.length = 0;
}

export function isInSSRCache(css: string): boolean {
  return cssTextCache.includes(css);
}
