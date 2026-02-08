/**
 * CSS property name stringification utilities.
 * Handles conversion of camelCase CSS property names to kebab-case,
 * including proper vendor prefix detection and normalization.
 */

import { SANITIZE_CACHE_SIZE_LIMIT } from "../constants";

import { LRUCache } from "./cache";

const propertyNameCache = new LRUCache<string, string>(SANITIZE_CACHE_SIZE_LIMIT);

/**
 * Converts a camelCase string to kebab-case.
 *
 * @param str - String to convert
 * @returns Kebab-case string
 */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Normalizes a property name for vendor prefix detection.
 * Handles all-caps and mixed-case scenarios.
 *
 * @param property - Property name to normalize
 * @returns Normalized property name
 */
function normalizePropertyName(property: string): string {
  if (property === property.toUpperCase() && property.length > 1) {
    return property.charAt(0) + property.slice(1).toLowerCase();
  }

  return property;
}

/**
 * Converts the rest of a property name (after vendor prefix) to kebab-case.
 * Ensures the first character is lowercase before conversion to avoid double dashes.
 *
 * @param rest - The property name part after the vendor prefix
 * @returns Kebab-case string
 */
function restToKebabCase(rest: string): string {
  if (!rest) {
    return "";
  }

  return (
    rest.charAt(0).toLowerCase() +
    rest
      .slice(1)
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
  );
}

/**
 * Sanitizes CSS property names to prevent injection attacks.
 * Handles vendor prefixes, camelCase conversion, and edge cases.
 *
 * Vendor prefix patterns handled:
 * - Moz* → -moz-*
 * - Webkit* → -webkit-*
 * - ms* → -ms-*
 * - O* → -o-*
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

  if (/^-[a-z]+-/.test(propertyName)) {
    propertyNameCache.set(propertyName, propertyName);

    return propertyName;
  }

  const normalized = normalizePropertyName(propertyName);

  // Mozilla prefix (case-insensitive): Moz*, moz*, MOZ* → -moz-*
  if (/^[Mm]oz/i.test(normalized)) {
    if (normalized.length === 3 || normalized.toLowerCase() === "moz") {
      const result = "-moz";

      propertyNameCache.set(propertyName, result);

      return result;
    }

    const match = /^[Mm]oz(.+)$/i.exec(normalized);

    if (match && match[1]) {
      const [, rest] = match;
      const kebab = restToKebabCase(rest);

      if (kebab) {
        const result = `-moz-${kebab}`;

        propertyNameCache.set(propertyName, result);

        return result;
      }
    }
  }

  // WebKit prefix (case-insensitive): Webkit*, webkit*, WEBKIT* → -webkit-*
  if (/^[Ww]ebkit/i.test(normalized)) {
    if (normalized.length === 6 || normalized.toLowerCase() === "webkit") {
      const result = "-webkit";

      propertyNameCache.set(propertyName, result);

      return result;
    }

    const match = /^[Ww]ebkit(.+)$/i.exec(normalized);

    if (match && match[1]) {
      const [, rest] = match;
      const kebab = restToKebabCase(rest);

      if (kebab) {
        const result = `-webkit-${kebab}`;

        propertyNameCache.set(propertyName, result);

        return result;
      }
    }
  }

  // Microsoft prefix (case-insensitive): ms*, Ms*, MS* → -ms-*
  if (/^[Mm]s/i.test(normalized)) {
    if (normalized.length === 2 || normalized.toLowerCase() === "ms") {
      const result = "-ms";

      propertyNameCache.set(propertyName, result);

      return result;
    }

    const match = /^[Mm]s(.+)$/i.exec(normalized);

    if (match && match[1]) {
      const [, rest] = match;
      const kebab = restToKebabCase(rest);

      if (kebab) {
        const result = `-ms-${kebab}`;

        propertyNameCache.set(propertyName, result);

        return result;
      }
    }
  }

  // Opera prefix (single uppercase O): O* → -o-* or just O → -o
  if (/^O/i.test(normalized)) {
    if (normalized.length === 1 || normalized.toLowerCase() === "o") {
      const result = "-o";

      propertyNameCache.set(propertyName, result);

      return result;
    }

    if (/^O[A-Z]/.test(normalized)) {
      const rest = normalized.substring(1);
      const kebab = restToKebabCase(rest);

      if (kebab) {
        const result = `-o-${kebab}`;

        propertyNameCache.set(propertyName, result);

        return result;
      }
    }
  }

  const kebab = toKebabCase(normalized);
  const sanitized = kebab.replace(/[^a-zA-Z0-9-]/g, "").replace(/^-+|-+$/g, "");
  const result = sanitized.replace(/^\d+/, "") || "";

  propertyNameCache.set(propertyName, result);

  return result;
}
