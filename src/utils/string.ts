/**
 * String utility functions.
 * Provides hashing for class name generation, camelCase to kebab-case conversion,
 * and CSS sanitization utilities for security.
 */

/**
 * Generates a hash string from an input string.
 *
 * @param str - String to hash
 * @returns Hashed string
 */
export function hash(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
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
 *
 * @param selector - Selector to sanitize
 * @returns Sanitized selector string or empty string if invalid
 */
export function sanitizeCSSSelector(selector: string): string {
  const sanitized = selector.replace(/[^a-zA-Z0-9\s\-_>+~:.#[\]&@()]/g, "");

  if (!sanitized.trim() || /^[>+~:.#[\]&@()\s]+$/.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Validates and sanitizes CSS variable names to prevent injection attacks.
 * CSS custom properties must start with -- and contain only valid characters.
 *
 * @param name - Variable name to sanitize
 * @returns Sanitized variable name
 */
export function sanitizeCSSVariableName(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9-_]/g, "-");
  const cleaned = sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "");

  return cleaned || "invalid";
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
 *
 * @param prefix - Prefix to sanitize
 * @returns Sanitized prefix string
 */
export function sanitizePrefix(prefix: string): string {
  if (!prefix) {
    return "";
  }

  const sanitized = prefix.replace(/[^a-zA-Z0-9-_]/g, "");

  return sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "") || "";
}

/**
 * Escapes prefix for use in CSS attribute selectors.
 *
 * @param prefix - Prefix to escape
 * @returns Escaped prefix string
 */
export function escapePrefixForSelector(prefix: string): string {
  if (!prefix) {
    return "";
  }

  return prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
 *
 * @param className - Class name(s) to sanitize
 * @returns Sanitized class name string
 */
export function sanitizeClassName(className: string): string {
  if (!className || typeof className !== "string") {
    return "";
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

  return sanitizedClasses.join(" ");
}

/**
 * Sanitizes CSS property names to prevent injection attacks.
 *
 * @param propertyName - Property name to sanitize
 * @returns Sanitized property name
 */
export function sanitizeCSSPropertyName(propertyName: string): string {
  if (!propertyName || typeof propertyName !== "string") {
    return "";
  }

  const kebab = toKebabCase(propertyName);
  const sanitized = kebab.replace(/[^a-zA-Z0-9-]/g, "").replace(/^-+|-+$/g, "");

  return sanitized.replace(/^\d+/, "") || "";
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
