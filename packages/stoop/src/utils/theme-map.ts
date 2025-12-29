/**
 * ThemeMap utilities for property-aware token resolution.
 * Maps CSS properties to theme scales for deterministic token resolution.
 */

import type { ThemeScale } from "../types";

import { DEFAULT_THEME_MAP } from "../constants";

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
