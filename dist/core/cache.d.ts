/**
 * CSS compilation caching system.
 * Tracks compiled CSS strings and class names to prevent duplicate work.
 * Implements FIFO eviction when cache size limits are exceeded.
 */
export declare const classNameCache: Map<string, string>;
export declare const cssStringCache: Map<string, string>;
export declare function hasCachedStyle(css: string): boolean;
export declare function markStyleAsCached(css: string): void;
export declare function limitCacheSize(): void;
export declare function clearStyleCache(): void;
