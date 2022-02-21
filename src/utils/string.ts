/**
 * String utility functions.
 * Provides hashing for class name generation, camelCase to kebab-case conversion,
 * and CSS sanitization utilities for security.
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

export function hashObject(obj: unknown): string {
  try {
    return hash(JSON.stringify(obj));
  } catch {
    return hash(String(obj));
  }
}

export function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Escapes CSS property values to prevent injection attacks.
 * Escapes quotes, semicolons, and other special characters.
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
 */
export function sanitizeCSSSelector(selector: string): string {
  // Allow alphanumeric, hyphens, underscores, spaces, >, +, ~, :, ., #, [, ], &, @, and whitespace
  // Remove any characters that could be used for injection
  const sanitized = selector.replace(/[^a-zA-Z0-9\s\-_>+~:.#[\]&@()]/g, "");

  // Prevent empty selectors or selectors that are just special characters
  if (!sanitized.trim() || /^[>+~:.#[\]&@()\s]+$/.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Validates and sanitizes CSS variable names to prevent injection attacks.
 * CSS custom properties must start with -- and contain only valid characters.
 */
export function sanitizeCSSVariableName(name: string): string {
  // Remove any characters that aren't valid in CSS custom property names
  // Allow: letters, numbers, hyphens, underscores
  const sanitized = name.replace(/[^a-zA-Z0-9-_]/g, "-");

  // Ensure it doesn't start with a number or hyphen
  const cleaned = sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "");

  return cleaned || "invalid";
}

/**
 * Escapes CSS variable values to prevent injection attacks.
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
 */
export function sanitizePrefix(prefix: string): string {
  if (!prefix) {
    return "";
  }

  // Only allow alphanumeric, hyphens, and underscores
  const sanitized = prefix.replace(/[^a-zA-Z0-9-_]/g, "");

  // Ensure it doesn't start with a number or hyphen
  return sanitized.replace(/^[\d-]+/, "").replace(/^-+/, "") || "";
}

/**
 * Escapes prefix for use in CSS attribute selectors.
 */
export function escapePrefixForSelector(prefix: string): string {
  if (!prefix) {
    return "";
  }

  // Escape special regex characters for use in attribute selectors
  return prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Sanitizes media query strings to prevent injection attacks.
 * Only allows safe characters for media queries.
 */
export function sanitizeMediaQuery(mediaQuery: string): string {
  if (!mediaQuery || typeof mediaQuery !== "string") {
    return "";
  }

  // Allow alphanumeric, spaces, parentheses, colons, commas, and common media query operators
  // Remove any characters that could be used for injection
  const sanitized = mediaQuery.replace(/[^a-zA-Z0-9\s():,<>=-]/g, "");

  // Basic validation: must contain at least one letter and be non-empty
  if (!sanitized.trim() || !/[a-zA-Z]/.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Sanitizes CSS class names to prevent injection attacks.
 * Only allows valid CSS class name characters.
 */
export function sanitizeClassName(className: string): string {
  if (!className || typeof className !== "string") {
    return "";
  }

  // Split by spaces to handle multiple class names
  const classes = className.trim().split(/\s+/);
  const sanitizedClasses: string[] = [];

  for (const cls of classes) {
    if (!cls) {
      continue;
    }

    // CSS class names can contain: letters, numbers, hyphens, underscores
    // Must start with a letter, underscore, or hyphen (but not a number)
    const sanitized = cls.replace(/[^a-zA-Z0-9-_]/g, "");

    // Ensure it doesn't start with a number
    const cleaned = sanitized.replace(/^\d+/, "");

    if (cleaned && /^[a-zA-Z-_]/.test(cleaned)) {
      sanitizedClasses.push(cleaned);
    }
  }

  return sanitizedClasses.join(" ");
}

/**
 * Sanitizes CSS property names to prevent injection attacks.
 */
export function sanitizeCSSPropertyName(propertyName: string): string {
  if (!propertyName || typeof propertyName !== "string") {
    return "";
  }

  // Convert to kebab-case first
  const kebab = toKebabCase(propertyName);

  // Remove any characters that aren't valid in CSS property names
  // Allow: letters, numbers, hyphens (but not at start/end)
  const sanitized = kebab.replace(/[^a-zA-Z0-9-]/g, "").replace(/^-+|-+$/g, "");

  // Must start with a letter
  return sanitized.replace(/^\d+/, "") || "";
}

/**
 * Validates keyframe percentage keys (e.g., "0%", "50%", "from", "to").
 */
export function validateKeyframeKey(key: string): boolean {
  if (!key || typeof key !== "string") {
    return false;
  }

  // Allow "from" and "to"
  if (key === "from" || key === "to") {
    return true;
  }

  // Allow percentage values like "0%", "50%", "100%"
  const percentageMatch = /^\d+(\.\d+)?%$/.test(key);

  if (percentageMatch) {
    const num = parseFloat(key);

    return num >= 0 && num <= 100;
  }

  return false;
}
