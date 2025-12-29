/**
 * CSS injection deduplication.
 * Tracks which CSS rules have been injected to prevent duplicates.
 * Used by both browser and SSR injection systems.
 */

const injectedRules = new Map<string, string>();

/**
 * Checks if a CSS rule has already been injected.
 *
 * @param key - Rule key to check
 * @returns True if rule is already injected
 */
export function isInjectedRule(key: string): boolean {
  return injectedRules.has(key);
}

/**
 * Marks a CSS rule as injected.
 *
 * @param key - Rule key
 * @param css - CSS string
 */
export function markRuleAsInjected(key: string, css: string): void {
  injectedRules.set(key, css);
}

/**
 * Gets all injected rules as a new Map.
 *
 * @returns Map of all injected rules
 */
export function getAllInjectedRules(): Map<string, string> {
  return new Map(injectedRules);
}

/**
 * Clears all injected rule tracking.
 */
export function clearInjectedRules(): void {
  injectedRules.clear();
}
