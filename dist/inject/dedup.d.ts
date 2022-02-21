/**
 * CSS injection deduplication.
 * Tracks which CSS rules have been injected to prevent duplicates.
 * Used by both browser and SSR injection systems.
 */
export declare function hasInjectedRule(key: string): boolean;
export declare function markRuleAsInjected(key: string, css: string): void;
export declare function isRuleInjected(key: string): boolean;
export declare function getAllInjectedRules(): Map<string, string>;
export declare function clearInjectedRules(): void;
