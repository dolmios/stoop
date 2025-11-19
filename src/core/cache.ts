/**
 * CSS compilation caching system.
 * Tracks compiled CSS strings and class names to prevent duplicate work.
 * Implements LRU (Least Recently Used) eviction when cache size limits are exceeded.
 */

import { MAX_CLASS_NAME_CACHE_SIZE } from "../constants";

const stylesCache = new Map<string, string>();

/**
 * LRU Cache implementation for class names and CSS strings.
 * Automatically evicts least recently used entries when size limit is exceeded.
 */
class LRUCache<K, V> extends Map<K, V> {
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
export const cssStringCache = new LRUCache<string, string>(MAX_CLASS_NAME_CACHE_SIZE);

/**
 * Checks if a CSS string is cached.
 *
 * @param css - CSS string to check
 * @returns True if CSS is cached
 */
export function isCachedStyle(css: string): boolean {
  return stylesCache.has(css);
}

/**
 * Marks a CSS string as cached.
 *
 * @param css - CSS string to cache
 */
export function markStyleAsCached(css: string): void {
  stylesCache.set(css, css);
}

/**
 * Limits cache size by evicting least recently used entries.
 */
export function limitCacheSize(): void {
  // Safety check for direct cache access (LRU handles eviction automatically)
  if (classNameCache.size > MAX_CLASS_NAME_CACHE_SIZE) {
    const firstKey = classNameCache.keys().next().value;

    if (firstKey) {
      classNameCache.delete(firstKey);
      cssStringCache.delete(firstKey);
    }
  }
}

/**
 * Clears all cached styles.
 */
export function clearStyleCache(): void {
  stylesCache.clear();
}
