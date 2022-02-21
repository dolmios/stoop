// Example theme implementation using Stoop
import type { CSS, CSSPropertyValue, UtilityFunction } from "../src/types";

import { createStoop } from "../src";

// Light theme colors - Vercel style
const lightColors = {
  accent: "#0070f3",
  background: "#ffffff",
  border: "#eaeaea",
  hover: "#fafafa",
  primary: "#000000",
  secondary: "#666666",
  text: "#000000",
  textSecondary: "#666666",
} as const;

// Dark theme colors - Vercel style
const darkColors = {
  accent: "#3291ff",
  background: "#000000",
  border: "#333333",
  hover: "#111111",
  primary: "#ffffff",
  secondary: "#888888",
  text: "#ffffff",
  textSecondary: "#888888",
} as const;

// Spacing tokens
const spacing = {
  large: "24px",
  medium: "16px",
  small: "8px",
  xlarge: "32px",
} as const;

// Font stacks - using system fonts
const fonts = {
  body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
} as const;

// Font sizes
const fontSizes = {
  h1: "2.25rem",
  h2: "1.875rem",
  large: "18px",
  medium: "16px",
  small: "14px",
} as const;

// Line heights
const lineHeights = {
  default: "1.4",
  small: "1.2",
} as const;

// Typography
const typography = {
  bold: "700",
  medium: "500",
  semibold: "600",
} as const;

// Transitions
const transitions = {
  default: "all 0.2s ease",
} as const;

// Opacities
const opacities = {
  disabled: "0.5",
} as const;

// Border radius
const borderRadius = {
  default: "6px",
  large: "8px",
  small: "4px",
} as const;

// Shadows
const shadows = {
  subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
} as const;

// Media queries
const media = {
  desktop: "@media (min-width: 1025px)",
  mobile: "@media (max-width: 768px)",
} as const;

// Utility functions - transform shorthand properties to CSS
const utils: Record<string, UtilityFunction> = {
  // Hide utility - accepts breakpoint name
  hidden: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const breakpoint = typeof value === "string" ? value : "";

    if (breakpoint === "mobile") {
      return {
        mobile: {
          display: "none",
        },
      };
    }

    if (breakpoint === "desktop") {
      return {
        desktop: {
          display: "none",
        },
      };
    }

    return { display: "none" };
  },
  // Margin utilities
  mb: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginBottom: val };
  },
  ml: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginLeft: val };
  },
  mr: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginRight: val };
  },
  mt: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginTop: val };
  },
  mx: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginLeft: val, marginRight: val };
  },
  my: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { marginBottom: val, marginTop: val };
  },
  // Padding utilities
  pb: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingBottom: val };
  },
  pl: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingLeft: val };
  },
  pr: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingRight: val };
  },
  pt: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingTop: val };
  },
  px: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingLeft: val, paddingRight: val };
  },
  py: (value: CSSPropertyValue | CSS | undefined): CSS => {
    const val = typeof value === "string" || typeof value === "number" ? String(value) : "";

    return { paddingBottom: val, paddingTop: val };
  },
};

// Light theme object
const lightTheme = {
  borderRadius,
  colors: lightColors,
  fonts,
  fontSizes,
  lineHeights,
  opacities,
  shadows,
  spacing,
  transitions,
  typography,
};

// Create Stoop instance with light theme
export const { createTheme, css, globalCss, styled, ThemeContext } = createStoop({
  media,
  theme: lightTheme,
  utils,
});

// Export light theme for use in Provider
export { lightTheme };

// Create dark theme
export const darkTheme = createTheme({
  colors: darkColors,
});
