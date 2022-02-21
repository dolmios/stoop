/**
 * String utility functions.
 * Provides hashing for class name generation, camelCase to kebab-case conversion,
 * and CSS sanitization utilities for security.
 */
export declare function hash(str: string): string;
export declare function hashObject(obj: unknown): string;
export declare function toKebabCase(str: string): string;
/**
 * Escapes CSS property values to prevent injection attacks.
 * Escapes quotes, semicolons, and other special characters.
 */
export declare function escapeCSSValue(value: string | number): string;
/**
 * Validates and sanitizes CSS selectors to prevent injection attacks.
 * Only allows safe selector characters. Returns empty string for invalid selectors.
 */
export declare function sanitizeCSSSelector(selector: string): string;
/**
 * Validates and sanitizes CSS variable names to prevent injection attacks.
 * CSS custom properties must start with -- and contain only valid characters.
 */
export declare function sanitizeCSSVariableName(name: string): string;
/**
 * Escapes CSS variable values to prevent injection attacks.
 */
export declare function escapeCSSVariableValue(value: string | number): string;
/**
 * Sanitizes prefix for use in CSS selectors and class names.
 * Only allows alphanumeric characters, hyphens, and underscores.
 */
export declare function sanitizePrefix(prefix: string): string;
/**
 * Escapes prefix for use in CSS attribute selectors.
 */
export declare function escapePrefixForSelector(prefix: string): string;
/**
 * Sanitizes media query strings to prevent injection attacks.
 * Only allows safe characters for media queries.
 */
export declare function sanitizeMediaQuery(mediaQuery: string): string;
/**
 * Sanitizes CSS class names to prevent injection attacks.
 * Only allows valid CSS class name characters.
 */
export declare function sanitizeClassName(className: string): string;
/**
 * Sanitizes CSS property names to prevent injection attacks.
 */
export declare function sanitizeCSSPropertyName(propertyName: string): string;
/**
 * Validates keyframe percentage keys (e.g., "0%", "50%", "from", "to").
 */
export declare function validateKeyframeKey(key: string): boolean;
