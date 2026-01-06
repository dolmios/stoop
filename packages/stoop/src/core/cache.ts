/**
 * CSS compilation caching system.
 * Tracks compiled CSS strings and class names to prevent duplicate work.
 * Implements LRU (Least Recently Used) eviction when cache size limits are exceeded.
 */

import { MAX_CLASS_NAME_CACHE_SIZE, MAX_CSS_CACHE_SIZE } from "../constants";

/**
 * LRU Cache implementation for class names and CSS strings.
 * Automatically evicts least recently used entries when size limit is exceeded.
 */
export class LRUCache<K, V> extends Map<K, V> {
  private readonly maxSize: number;

  constructor(maxSize: number) {
    super();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = super.get(key);

    if (value !== undefined) {
      super.delete(key);
      super.set(key, value);
    }

    return value;
  }

  set(key: K, value: V): this {
    if (super.has(key)) {
      super.delete(key);
    } else if (this.size >= this.maxSize) {
      const firstKey = this.keys().next().value;

      if (firstKey !== undefined) {
        super.delete(firstKey);
      }
    }

    super.set(key, value);

    return this;
  }
}

export const classNameCache = new LRUCache<string, string>(MAX_CLASS_NAME_CACHE_SIZE);
export const cssStringCache = new LRUCache<string, string>(MAX_CSS_CACHE_SIZE);

const injectedStylesCache = new Set<string>();

/**
 * Checks if a CSS string has been injected.
 *
 * @param css - CSS string to check
 * @returns True if CSS has been injected
 */
export function isCachedStyle(css: string): boolean {
  return injectedStylesCache.has(css);
}

/**
 * Marks a CSS string as injected.
 *
 * @param css - CSS string to cache
 */
export function markStyleAsCached(css: string): void {
  injectedStylesCache.add(css);
}

/**
 * Clears all cached styles.
 */
export function clearStyleCache(): void {
  classNameCache.clear();
  cssStringCache.clear();
  injectedStylesCache.clear();
}
