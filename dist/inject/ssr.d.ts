/**
 * SSR cache management for CSS injection.
 * Maintains a cache of CSS text for server-side rendering.
 * Implements FIFO eviction to prevent memory leaks.
 */
export declare function addToSSRCache(css: string): void;
export declare function getSSRCacheText(): string;
export declare function clearSSRCache(): void;
export declare function isInSSRCache(css: string): boolean;
