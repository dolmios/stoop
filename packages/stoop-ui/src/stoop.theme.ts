"use client";

/**
 * Fixed theme configuration for stoop-ui.
 * This theme cannot be customized by users.
 *
 * Font Configuration:
 * - Uses CSS variables for fonts: --font-standard and --font-monaspace
 * - Consumers must provide these CSS variables themselves (fonts cannot be bundled)
 * - Fallback fonts are provided if CSS variables are not defined
 *
 * Example usage in Next.js:
 * ```tsx
 * const standardFont = localFont({
 *   variable: "--font-standard",
 *   src: [{ path: "./fonts/standard.woff2" }]
 * });
 *
 * <html className={standardFont.variable}>
 *   <ThemeProvider>...</ThemeProvider>
 * </html>
 * ```
 */

import { createStoop } from "stoop";

import { utils } from "./utils";

const lightTheme = {
  colors: {
    background: "#faf9f6",
    border: "#e5e3df",
    borderBottom: "#d4d1cb",
    borderEmphasis: "#c4c0b8",
    borderLight: "#f0ede8",
    borderStrong: "#d4d1cb",
    hover: "#f0ede8",
    overlay: "rgba(0, 0, 0, 0.4)",
    surface: "#ffffff",
    surfaceHover: "#faf9f6",
    surfaceLight: "#faf9f6",
    text: "#1a1a1a",
    textSecondary: "#666666",
  },
  fonts: {
    body: "var(--font-standard, system-ui, -apple-system, sans-serif)",
    heading: "var(--font-standard, system-ui, -apple-system, sans-serif)",
    mono: "var(--font-monaspace, ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace)",
  },
  fontSizes: {
    default: "16px",
    h1: "3rem",
    h2: "2rem",
    h3: "1.5rem",
    h4: "1.25rem",
    h5: "1.125rem",
    h6: "1rem",
    small: "14px",
  },
  fontWeights: {
    bold: "500",
    default: "400",
  },
  letterSpacings: {
    default: "0",
  },
  media: {
    desktop: "@media (min-width: 1025px)",
    mobile: "@media (max-width: 768px)",
  },
  opacities: {
    disabled: "0.5",
    hover: "0.8",
    light: "0.6",
  },
  radii: {
    default: "6px",
    large: "8px",
    small: "4px",
  },
  shadows: {
    default: "0 2px 4px rgba(0, 0, 0, 0.1)",
    inset: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
    largest: "0 8px 24px rgba(0, 0, 0, 0.15)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.12)",
    subtle: "0 1px 2px rgba(0, 0, 0, 0.08)",
  },
  space: {
    large: "32px",
    larger: "48px",
    medium: "16px",
    small: "8px",
    smaller: "4px",
    smallest: "2px",
  },
  transitions: {
    default: "all 0.2s ease",
    fast: "all 0.1s ease",
  },
  zIndices: {
    menu: "1000",
    modal: "1100",
    modalPopover: "1200",
    popover: "1000",
    sticky: "10",
  },
};

const darkTheme = {
  colors: {
    background: "#1a1a1a",
    border: "#333333",
    borderBottom: "#2a2a2a",
    borderEmphasis: "#404040",
    borderLight: "#2a2a2a",
    borderStrong: "#404040",
    hover: "#2a2a2a",
    overlay: "rgba(0, 0, 0, 0.6)",
    surface: "#242424",
    surfaceHover: "#2a2a2a",
    surfaceLight: "#1f1f1f",
    text: "#ffffff",
    textSecondary: "#999999",
  },
};

const stoopConfig = {
  theme: lightTheme,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  utils,
} as const;

// Create internal stoop instance with fixed theme
const stoopInstance = createStoop(stoopConfig);

// Export APIs needed by components
export const { styled } = stoopInstance;
export const { keyframes } = stoopInstance;
export const { globalCss } = stoopInstance;
export const { getCssText } = stoopInstance;

// Export Provider and useTheme for ThemeProvider
export const { Provider } = stoopInstance;
export const { useTheme } = stoopInstance;

// Export type for external use
export type StoopUITheme = typeof stoopInstance;
