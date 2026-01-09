"use client";

/**
 * Predefined theme configuration for stoop-ui.
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

const globalCssConfig = {
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  "*, *::before, *::after": {
    boxSizing: "inherit",
  },
  "[aria-hidden='true']": {
    display: "none",
  },
  "[hidden]": {
    display: "none",
  },
  a: {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
    "&:hover": {
      opacity: "$hover",
    },
    color: "$text",
    textDecoration: "none",
    transition: "$default",
  },
  body: {
    backgroundColor: "$background",
    color: "$text",
    display: "flex",
    flexDirection: "column",
    fontFamily: "$body",
    fontSize: "$default",
    fontWeight: "$default",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "100%",
    minHeight: "100vh",
    minWidth: 0,
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden",
    padding: 0,
    transition: "$default",
    WebkitFontSmoothing: "antialiased",
    width: "100%",
  },
  button: {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  "button, input, select, textarea": {
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    margin: 0,
  },
  code: {
    backgroundColor: "$hover",
    borderRadius: "$small",
    fontFamily: "$mono",
    fontSize: "$small",
    padding: "2px 6px",
  },
  h1: {
    fontSize: "$h1",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: "$heading",
    fontWeight: "$bold",
    lineHeight: 1.2,
    margin: 0,
  },
  h2: {
    fontSize: "$h2",
  },
  h3: {
    fontSize: "$h3",
  },
  html: {
    maxWidth: "100%",
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden",
    scrollBehavior: "smooth",
    WebkitFontSmoothing: "antialiased",
    width: "100%",
  },
  img: {
    display: "block",
    height: "auto",
    maxWidth: "100%",
  },
  "input, select, textarea": {
    "&:focus-visible": {
      borderRadius: "$small",
      outline: "2px solid $text",
      outlineOffset: "2px",
    },
  },
  p: {
    margin: 0,
  },
  "p, span, div, a, button, input, select, textarea, li, td, th": {
    fontWeight: "$default",
  },
  pre: {
    fontFamily: "$mono",
    margin: 0,
  },
  "pre code": {
    backgroundColor: "transparent",
    padding: 0,
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  "ul, ol": {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
};

const stoopConfig = {
  globalCss: globalCssConfig,
  theme: lightTheme,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  utils,
} as const;

// Create internal stoop instance with predefined theme
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
