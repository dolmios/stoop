import { defineConfig, keyframes } from "stoop";

export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

export const fadeInUp = keyframes({
  from: { opacity: 0, transform: "translateY(4px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const fadeOutDown = keyframes({
  from: { opacity: 1, transform: "translateY(0)" },
  to: { opacity: 0, transform: "translateY(4px)" },
});

export const slideInScale = keyframes({
  from: { opacity: 0, transform: "scale(0.95) translateY(-10px)" },
  to: { opacity: 1, transform: "scale(1) translateY(0)" },
});

export const slideOutScale = keyframes({
  from: { opacity: 1, transform: "scale(1) translateY(0)" },
  to: { opacity: 0, transform: "scale(0.95) translateY(-10px)" },
});

export const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const pulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

export const animations = {
  fadeIn,
  fadeInUp,
  fadeOut,
  fadeOutDown,
  pulse,
  slideInScale,
  slideOutScale,
  spin,
} as const;

export const theme = defineConfig({
  media: {
    desktop: "@media (min-width: 1025px)",
    mobile: "@media (max-width: 768px)",
  },
  theme: {
    colors: {
      background: "#faf9f6",
      border: "#e5e3df",
      borderBottom: "#d4d1cb",
      borderEmphasis: "#c4c0b8",
      borderLight: "#f0ede8",
      borderStrong: "#d4d1cb",
      danger: "#ef4444",
      dangerActive: "#991b1b",
      dangerHover: "#dc2626",
      error: "#dc2626",
      errorDark: "#b91c1c",
      errorLight: "#ef4444",
      hover: "#f0ede8",
      overlay: "rgba(0, 0, 0, 0.4)",
      success: "#16a34a",
      successDark: "#15803d",
      successLight: "#22c55e",
      surface: "#ffffff",
      surfaceHover: "#faf9f6",
      surfaceLight: "#faf9f6",
      text: "#1a1a1a",
      textSecondary: "#666666",
    },
    fonts: {
      body: "var(--font-standard, system-ui, -apple-system, sans-serif)",
      heading: "var(--font-standard, system-ui, -apple-system, sans-serif)",
      mono: "var(--font-monaspace, ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace)",
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
  },
  themes: {
    dark: {
      colors: {
        background: "#1a1a1a",
        border: "#333333",
        borderBottom: "#2a2a2a",
        borderEmphasis: "#404040",
        borderLight: "#2a2a2a",
        borderStrong: "#404040",
        danger: "#ef4444",
        dangerActive: "#991b1b",
        dangerHover: "#dc2626",
        error: "#dc2626",
        errorDark: "#b91c1c",
        errorLight: "#ef4444",
        hover: "#2a2a2a",
        overlay: "rgba(0, 0, 0, 0.6)",
        success: "#16a34a",
        successDark: "#15803d",
        successLight: "#22c55e",
        surface: "#242424",
        surfaceHover: "#2a2a2a",
        surfaceLight: "#1f1f1f",
        text: "#ffffff",
        textSecondary: "#999999",
      },
    },
    light: {
      colors: {
        background: "#faf9f6",
        border: "#e5e3df",
        borderBottom: "#d4d1cb",
        borderEmphasis: "#c4c0b8",
        borderLight: "#f0ede8",
        borderStrong: "#d4d1cb",
        danger: "#ef4444",
        dangerActive: "#991b1b",
        dangerHover: "#dc2626",
        error: "#dc2626",
        errorDark: "#b91c1c",
        errorLight: "#ef4444",
        hover: "#f0ede8",
        overlay: "rgba(0, 0, 0, 0.4)",
        success: "#16a34a",
        successDark: "#15803d",
        successLight: "#22c55e",
        surface: "#ffffff",
        surfaceHover: "#faf9f6",
        surfaceLight: "#faf9f6",
        text: "#1a1a1a",
        textSecondary: "#666666",
      },
    },
  },
});

export default theme;
