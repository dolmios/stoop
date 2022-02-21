/**
 * CSS injection deduplication.
 * Tracks which CSS rules have been injected to prevent duplicates.
 * Used by both browser and SSR injection systems.
 */

const injectedRules = new Map<string, string>();

export function hasInjectedRule(key: string): boolean {
  return injectedRules.has(key);
}

export function markRuleAsInjected(key: string, css: string): void {
  injectedRules.set(key, css);
}

export function isRuleInjected(key: string): boolean {
  return injectedRules.has(key);
}

export function getAllInjectedRules(): Map<string, string> {
  return new Map(injectedRules);
}

export function clearInjectedRules(): void {
  injectedRules.clear();
}
