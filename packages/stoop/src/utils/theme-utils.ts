/**
 * Theme-related string utilities and property mapping.
 * Provides hashing, CSS sanitization, and theme scale mapping for property-aware token resolution.
 */

import type { ThemeScale } from "../types";

import { DEFAULT_THEME_MAP, SANITIZE_CACHE_SIZE_LIMIT } from "../constants";
// ============================================================================
// String Utilities
// ============================================================================
import { LRUCache } from "../core/cache";

let cachedRootRegex: RegExp | null = null;

const selectorCache = new LRUCache<string, string>(SANITIZE_CACHE_SIZE_LIMIT);
const sanitizeClassNameCache = new LRUCache<string, string>(SANITIZE_CACHE_SIZE_LIMIT);
const variableNameCache = new LRUCache<string, string>(SANITIZE_CACHE_SIZE_LIMIT);

/**
 * Generates a hash string from an input string using FNV-1a algorithm.
 * Includes string length to reduce collision probability.
 *
 * @param str - String to hash
 * @returns Hashed string
 */
export function hash(str: string): string {
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;

  let hash = FNV_OFFSET_BASIS;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }

  hash ^= str.length;

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
 * Internal function to escape CSS values with optional brace escaping.
 *
 * @param value - Value to escape
 * @param escapeBraces - Whether to escape curly braces
 * @returns Escaped value string
 */
function escapeCSSValueInternal(value: string | number, escapeBraces = false): string {
  const str = String(value);

  let result = str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\A ")
    .replace(/\r/g, "")
    .replace(/\f/g, "\\C ");

  if (escapeBraces) {
    result = result.replace(/\{/g, "\\7B ").replace(/\}/g, "\\7D ");
  }

  return result;
}

/**
 * Escapes CSS property values to prevent injection attacks.
 * Escapes quotes, semicolons, and other special characters.
 *
 * @param value - Value to escape
 * @returns Escaped value string
 */
export function escapeCSSValue(value: string | number): string {
  return escapeCSSValueInternal(value, false);
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
  return escapeCSSValueInternal(value, true);
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

  sanitizeClassNameCache.set(className, result);

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
 * @param prefix - Optional prefix (unused, kept for API compatibility)
 * @returns RegExp for matching :root selector blocks
 */
export function getRootRegex(prefix = ""): RegExp {
  if (!cachedRootRegex) {
    const rootSelector = ":root";
    const escapedSelector = rootSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match :root block - use greedy match to handle nested braces (e.g., calc())
    // Since theme vars should only have one :root block, greedy matching is safe
    // Greedy matching ensures we capture the entire :root block, including nested functions
    cachedRootRegex = new RegExp(`${escapedSelector}\\s*\\{[\\s\\S]*\\}`);
  }

  return cachedRootRegex;
}

// ============================================================================
// Theme Map Utilities
// ============================================================================

/**
 * Auto-detects theme scale from CSS property name using pattern matching.
 * Used as fallback when property is not in DEFAULT_THEME_MAP.
 *
 * @param property - CSS property name
 * @returns Theme scale name or undefined if no pattern matches
 */
export function autoDetectScale(property: string): ThemeScale | undefined {
  // Color properties
  if (
    property.includes("Color") ||
    property === "fill" ||
    property === "stroke" ||
    property === "accentColor" ||
    property === "caretColor" ||
    property === "border" ||
    property === "outline" ||
    (property.includes("background") && !property.includes("Size") && !property.includes("Image"))
  ) {
    return "colors";
  }

  // Spacing properties
  if (
    /^(margin|padding|gap|inset|top|right|bottom|left|rowGap|columnGap|gridGap|gridRowGap|gridColumnGap)/.test(
      property,
    ) ||
    property.includes("Block") ||
    property.includes("Inline")
  ) {
    return "space";
  }

  // Size properties
  if (
    /(width|height|size|basis)$/i.test(property) ||
    property.includes("BlockSize") ||
    property.includes("InlineSize")
  ) {
    return "sizes";
  }

  // Typography: Font Size
  if (property === "fontSize" || (property === "font" && !property.includes("Family"))) {
    return "fontSizes";
  }

  // Typography: Font Family
  if (property === "fontFamily" || property.includes("FontFamily")) {
    return "fonts";
  }

  // Typography: Font Weight
  if (property === "fontWeight" || property.includes("FontWeight")) {
    return "fontWeights";
  }

  // Typography: Letter Spacing
  if (property === "letterSpacing" || property.includes("LetterSpacing")) {
    return "letterSpacings";
  }

  // Border Radius
  if (property.includes("Radius") || property.includes("radius")) {
    return "radii";
  }

  // Shadows
  if (
    property.includes("Shadow") ||
    property.includes("shadow") ||
    property === "filter" ||
    property === "backdropFilter"
  ) {
    return "shadows";
  }

  // Z-Index
  if (property === "zIndex" || property.includes("ZIndex") || property.includes("z-index")) {
    return "zIndices";
  }

  // Opacity
  if (property === "opacity" || property.includes("Opacity")) {
    return "opacities";
  }

  // Transitions and animations
  if (
    property.startsWith("transition") ||
    property.startsWith("animation") ||
    property.includes("Transition") ||
    property.includes("Animation")
  ) {
    return "transitions";
  }

  return undefined;
}

/**
 * Gets the theme scale for a CSS property.
 * Checks user themeMap first, then default themeMap, then pattern matching.
 *
 * @param property - CSS property name
 * @param userThemeMap - Optional user-provided themeMap override
 * @returns Theme scale name or undefined if no mapping found
 */
export function getScaleForProperty(
  property: string,
  userThemeMap?: Record<string, ThemeScale>,
): ThemeScale | undefined {
  if (userThemeMap && property in userThemeMap) {
    return userThemeMap[property];
  }

  if (property in DEFAULT_THEME_MAP) {
    return DEFAULT_THEME_MAP[property];
  }

  return autoDetectScale(property);
}
