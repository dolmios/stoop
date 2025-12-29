/**
 * Shared Stoop configuration.
 * Can be imported by both server and client code.
 */

import { utils } from "./utils";

export const lightTheme = {
  colors: {
    background: "#faf9f6",
    border: "#e5e3df",
    hover: "#f0ede8",
    text: "#1a1a1a",
  },
  fonts: {
    body: "var(--font-standard), system-ui, -apple-system, sans-serif",
    heading: "var(--font-standard), system-ui, -apple-system, sans-serif",
    mono: "var(--font-monaspace), ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
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
  },
  radii: {
    large: "8px",
    small: "4px",
  },
  space: {
    large: "32px",
    larger: "48px",
    medium: "16px",
    small: "8px",
    smaller: "4px",
  },
  transitions: {
    default: "all 0.2s ease",
  },
};

export const darkTheme = {
  colors: {
    background: "#1a1a1a",
    border: "#333333",
    hover: "#2a2a2a",
    text: "#ffffff",
  },
};

export const stoopConfig = {
  theme: lightTheme,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
  utils,
} as const;
