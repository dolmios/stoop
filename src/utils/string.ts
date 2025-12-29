/**
 * String utility functions.
 * Provides hashing for class name generation, camelCase to kebab-case conversion,
 * and CSS sanitization utilities for security.
 */

import { LRUCache } from "../core/cache";

// Memoization caches for frequently called sanitization functions
// Using LRU-style caches to prevent memory leaks
const sanitizeCacheSizeLimit = 1000;

// Pre-compiled regex cache for :root selector matching
const rootRegexCache = new Map<string, RegExp>();

const selectorCache = new LRUCache<string, string>(sanitizeCacheSizeLimit);
const propertyNameCache = new LRUCache<string, string>(sanitizeCacheSizeLimit);
const sanitizeClassNameCache = new LRUCache<string, string>(sanitizeCacheSizeLimit);
const variableNameCache = new LRUCache<string, string>(sanitizeCacheSizeLimit);

/**
 * Generates a hash string from an input string using FNV-1a algorithm.
 * Includes string length to reduce collision probability.
 *
 * @param str - String to hash
 * @returns Hashed string
 */
export function hash(str: string): string {
  // FNV-1a hash algorithm (32-bit)
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;

  let hash = FNV_OFFSET_BASIS;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }

  // Include string length to further reduce collisions
  hash ^= str.length;

  // Convert to unsigned 32-bit integer and encode in base-36
  return (hash >>> 0).toString(36);
}

/**
 * Generates a hash string from an object by stringifying it.
 *
 * @param obj - Object to hash
 * @returns Hashed string
 */
export function hashObject(obj: unknown): string {
  try {
    return hash(JSON.stringify(obj));
  } catch {
    return hash(String(obj));
  }
}

/**
 * Converts a camelCase string to kebab-case.
 *
 * @param str - String to convert
 * @returns Kebab-case string
 */
export function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Escapes CSS property values to prevent injection attacks.
 * Escapes quotes, semicolons, and other special characters.
 *
 * @param value - Value to escape
 * @returns Escaped value string
 */
export function escapeCSSValue(value: string | number): string {
  const str = String(value);

  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\A ")
    .replace(/\r/g, "")
    .replace(/\f/g, "\\C ");
}

/**
 * Validates and sanitizes CSS selectors to prevent injection attacks.
 * Only allows safe selector characters. Returns empty string for invalid selectors.
 * Uses memoization for performance.
 *
 * @param selector - Selector to sanitize
 * @returns Sanitized selector string or empty string if invalid
 */
export function sanitizeCSSSelector(selector: string): string {
  const cached = selectorCache.get(selector);

  if (cached !== undefined) {
    return cached;
  }

  const sanitized = selector.replace(/[^a-zA-Z0-9\s\-_>+~:.#[\]&@()]/g, "");

  const result = !sanitized.trim() || /^[>+~:.#[\]&@()\s]+$/.test(sanitized) ? "" : sanitized;

  // LRU cache handles eviction automatically
  selectorCache.set(selector, result);

  return result;
}

/**
 * Validates and sanitizes CSS variable names to prevent injection attacks.
 * CSS custom properties must start with -- and contain only valid characters.
 * Uses memoization for performance.
 *
 * @param name - Variable name to sanitize
 * @returns Sanitized variable name
 */
export function sanitizeCSSVariableName(name: string): string {
  const cached = variableNameCache.get(name);

  if (cached !== undefined) {
    return cached;
  }

  const sanitized = name.replace(/[^a-zA-Z0-9-_]/g, "-");
  const cleaned = sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "");
  const result = cleaned || "invalid";

  // LRU cache handles eviction automatically
  variableNameCache.set(name, result);

  return result;
}

/**
 * Escapes CSS variable values to prevent injection attacks.
 *
 * @param value - Value to escape
 * @returns Escaped value string
 */
export function escapeCSSVariableValue(value: string | number): string {
  const str = String(value);

  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\A ")
    .replace(/\r/g, "")
    .replace(/\f/g, "\\C ")
    .replace(/\{/g, "\\7B ")
    .replace(/\}/g, "\\7D ");
}

/**
 * Sanitizes prefix for use in CSS selectors and class names.
 * Only allows alphanumeric characters, hyphens, and underscores.
 * Defaults to "stoop" if prefix is empty or becomes empty after sanitization.
 *
 * @param prefix - Prefix to sanitize
 * @returns Sanitized prefix string (never empty, defaults to "stoop")
 */
export function sanitizePrefix(prefix: string): string {
  if (!prefix) {
    return "stoop";
  }

  const sanitized = prefix.replace(/[^a-zA-Z0-9-_]/g, "");
  const cleaned = sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "");

  // Return "stoop" as default if sanitization results in empty string
  return cleaned || "stoop";
}

/**
 * Sanitizes media query strings to prevent injection attacks.
 * Only allows safe characters for media queries.
 *
 * @param mediaQuery - Media query string to sanitize
 * @returns Sanitized media query string or empty string if invalid
 */
export function sanitizeMediaQuery(mediaQuery: string): string {
  if (!mediaQuery || typeof mediaQuery !== "string") {
    return "";
  }

  const sanitized = mediaQuery.replace(/[^a-zA-Z0-9\s():,<>=\-@]/g, "");

  if (!sanitized.trim() || !/[a-zA-Z]/.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Sanitizes CSS class names to prevent injection attacks.
 * Only allows valid CSS class name characters.
 * Uses memoization for performance.
 *
 * @param className - Class name(s) to sanitize
 * @returns Sanitized class name string
 */
export function sanitizeClassName(className: string): string {
  if (!className || typeof className !== "string") {
    return "";
  }

  const cached = sanitizeClassNameCache.get(className);

  if (cached !== undefined) {
    return cached;
  }

  const classes = className.trim().split(/\s+/);
  const sanitizedClasses: string[] = [];

  for (const cls of classes) {
    if (!cls) {
      continue;
    }

    const sanitized = cls.replace(/[^a-zA-Z0-9-_]/g, "");
    const cleaned = sanitized.replace(/^\d+/, "");

    if (cleaned && /^[a-zA-Z-_]/.test(cleaned)) {
      sanitizedClasses.push(cleaned);
    }
  }

  const result = sanitizedClasses.join(" ");

  // LRU cache handles eviction automatically
  sanitizeClassNameCache.set(className, result);

  return result;
}

/**
 * Sanitizes CSS property names to prevent injection attacks.
 * Uses memoization for performance.
 *
 * @param propertyName - Property name to sanitize
 * @returns Sanitized property name
 */
export function sanitizeCSSPropertyName(propertyName: string): string {
  if (!propertyName || typeof propertyName !== "string") {
    return "";
  }

  const cached = propertyNameCache.get(propertyName);

  if (cached !== undefined) {
    return cached;
  }

  const kebab = toKebabCase(propertyName);
  const sanitized = kebab.replace(/[^a-zA-Z0-9-]/g, "").replace(/^-+|-+$/g, "");
  const result = sanitized.replace(/^\d+/, "") || "";

  // LRU cache handles eviction automatically
  propertyNameCache.set(propertyName, result);

  return result;
}

/**
 * Validates keyframe percentage keys (e.g., "0%", "50%", "from", "to").
 *
 * @param key - Keyframe key to validate
 * @returns True if key is valid
 */
export function validateKeyframeKey(key: string): boolean {
  if (!key || typeof key !== "string") {
    return false;
  }

  if (key === "from" || key === "to") {
    return true;
  }

  const percentageMatch = /^\d+(\.\d+)?%$/.test(key);

  if (percentageMatch) {
    const num = parseFloat(key);

    return num >= 0 && num <= 100;
  }

  return false;
}

/**
 * Gets a pre-compiled regex for matching :root CSS selector blocks.
 * Uses caching for performance.
 *
 * @param prefix - Optional prefix for cache key (not used in regex, but for cache isolation)
 * @returns RegExp for matching :root selector blocks
 */
export function getRootRegex(prefix = ""): RegExp {
  const cacheKey = prefix || "default";
  let regex = rootRegexCache.get(cacheKey);

  if (!regex) {
    // Match simple :root selector (we no longer use attribute selectors)
    const rootSelector = ":root";
    const escapedSelector = rootSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Use [\s\S]*? to match any character including newlines (non-greedy)
    regex = new RegExp(`${escapedSelector}\\s*\\{[\\s\\S]*?\\}`, "g");
    rootRegexCache.set(cacheKey, regex);
  }

  return regex;
}
