/**
 * Stoop theme configuration.
 *
 * This file demonstrates best practices for organizing a Stoop theme:
 * - All 12 approved theme scales are defined inline
 * - Light (default) and dark themes are created
 * - Media queries and utilities are configured inline
 * - The Stoop instance is created and exported
 *
 * @file This file MUST be named `stoop.theme.ts` to follow Stoop conventions.
 */

import { createStoop } from "../src";
import { utils } from "./lib/utils";

const lightTheme = {
  colors: {
    accent: "#0070f3",
    background: "#ffffff",
    border: "#eaeaea",
    hover: "#fafafa",
    primary: "#000000",
    secondary: "#666666",
    text: "#000000",
    textSecondary: "#666666",
  },
  fonts: {
    body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
  },
  fontSizes: {
    h1: "2.25rem",
    h2: "1.875rem",
    large: "18px",
    medium: "16px",
    small: "14px",
  },
  fontWeights: {
    bold: "700",
    medium: "500",
    semibold: "600",
  },
  letterSpacings: {
    default: "0",
    tight: "-0.025em",
    wide: "0.025em",
  },
  media: {
    desktop: "@media (min-width: 1025px)",
    mobile: "@media (max-width: 768px)",
  },
  opacities: {
    disabled: "0.5",
    hover: "0.8",
  },
  radii: {
    default: "6px",
    large: "8px",
    small: "4px",
  },
  shadows: {
    medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  space: {
    large: "24px",
    medium: "16px",
    small: "8px",
    xlarge: "32px",
  },
  transitions: {
    default: "all 0.2s ease",
    fast: "all 0.1s ease",
    slow: "all 0.3s ease",
  },
  zIndices: {
    dropdown: "1000",
    modal: "2000",
    tooltip: "3000",
  },
};

const darkTheme = {
  colors: {
    accent: "#3291ff",
    background: "#000000",
    border: "#333333",
    hover: "#111111",
    primary: "#ffffff",
    secondary: "#888888",
    text: "#ffffff",
    textSecondary: "#888888",
  },
};

/**
 * Creates and exports the Stoop instance with theme configuration.
 * Includes built-in Provider and useTheme for multi-theme support.
 */
export const {
  createTheme,
  css,
  globalCss,
  keyframes,
  preloadTheme,
  Provider,
  styled,
  theme,
  useTheme,
} = createStoop({
  theme: lightTheme,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  utils,
});

// Re-export theme objects for direct access if needed
export { lightTheme, darkTheme };
